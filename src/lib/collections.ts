import { getCollection, type CollectionEntry } from "astro:content";

/** Drafts stay visible while running `npm run dev`, but never ship to production. */
const isVisible = ({ data }: { data: { draft: boolean } }) =>
  import.meta.env.PROD ? !data.draft : true;

export async function getProjects() {
  const projects = await getCollection("projects", isVisible);
  return projects.sort(
    (a, b) =>
      a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
  );
}

export async function getPosts() {
  const posts = await getCollection("writing", isVisible);
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

/** Where a post sits in its series, and what comes either side of it. */
export interface Series {
  name: string;
  /** The `part: 0` post, which lists the series and introduces it. */
  contents: CollectionEntry<"writing">;
  /** The instalments in reading order, the contents post not among them. */
  parts: CollectionEntry<"writing">[];
  /** 0 on the contents post, otherwise which instalment this is, counting from one. */
  part: number;
  prev?: CollectionEntry<"writing">;
  next?: CollectionEntry<"writing">;
}

/** Unnumbered parts sort behind numbered ones, so mixing the two is a mistake. */
const UNNUMBERED = Number.MAX_SAFE_INTEGER;

const inReadingOrder = (
  a: CollectionEntry<"writing">,
  b: CollectionEntry<"writing">,
) =>
  (a.data.part ?? UNNUMBERED) - (b.data.part ?? UNNUMBERED) ||
  a.data.pubDate.valueOf() - b.data.pubDate.valueOf();

/**
 * Every series: its contents post, then its instalments in reading order.
 *
 * The order comes out of the series itself rather than out of links between posts, so
 * the two directions can't disagree and inserting a post doesn't touch its neighbours.
 *
 * Drafts count while running `npm run dev` and not in a build, so a drafted middle part
 * closes the gap on the published site.
 */
async function getSeriesPosts() {
  const series = new Map<string, CollectionEntry<"writing">[]>();

  for (const post of await getPosts()) {
    const { series: name } = post.data;
    if (!name) continue;
    series.set(name, [...(series.get(name) ?? []), post]);
  }

  for (const [name, posts] of series) {
    posts.sort(inReadingOrder);

    const clash = posts.find(
      (entry, i) =>
        i > 0 &&
        entry.data.part !== undefined &&
        entry.data.part === posts[i - 1].data.part,
    );
    if (clash) {
      throw new Error(
        `Series "${name}" has two posts numbered part ${clash.data.part}: ` +
          `${posts[posts.indexOf(clash) - 1].id} and ${clash.id}`,
      );
    }

    // Part 0 is what holds a series together: it lists the instalments, and every one of
    // them links back to it. Without it there's no series, only posts naming one.
    if (posts[0].data.part !== 0) {
      throw new Error(
        `Series "${name}" has no contents post. One of its posts needs "part: 0", ` +
          `which is the one that introduces the series and lists the rest: ` +
          `${posts.map((entry) => entry.id).join(", ")}`,
      );
    }
  }

  return series;
}

export async function getSeries(
  post: CollectionEntry<"writing">,
): Promise<Series | undefined> {
  const { series: name } = post.data;
  if (!name) return undefined;

  const [contents, ...parts] = (await getSeriesPosts()).get(name) ?? [];
  const part =
    post.id === contents.id
      ? 0
      : parts.findIndex((entry) => entry.id === post.id) + 1;

  return {
    name,
    contents,
    parts,
    part,
    // The contents post is nobody's previous, so the first instalment has none, and the
    // contents post itself has neither: it holds the whole list instead.
    prev: part > 1 ? parts[part - 2] : undefined,
    next: part > 0 ? parts[part] : undefined,
  };
}

/** A whole series, for an index that shows several of them at once. */
export interface SeriesSummary {
  name: string;
  contents: CollectionEntry<"writing">;
  parts: CollectionEntry<"writing">[];
  /** The newest date in the series, so an index can lead with what's moving. */
  updated: Date;
}

export async function getAllSeries(): Promise<SeriesSummary[]> {
  const series = await getSeriesPosts();

  return [...series]
    .map(([name, [contents, ...parts]]) => ({
      name,
      contents,
      parts,
      updated: new Date(
        Math.max(
          ...[contents, ...parts].map((entry) => entry.data.pubDate.valueOf()),
        ),
      ),
    }))
    .sort((a, b) => b.updated.valueOf() - a.updated.valueOf());
}

/**
 * The writing list, with each series folded down to one row: the newest instalment, since
 * that's the news, with its label leading back to the contents post. The contents post
 * doesn't get a row of its own unless there's nothing else to show yet.
 */
export async function getListedPosts() {
  const series = await getSeriesPosts();

  return (await getPosts()).filter((post) => {
    const { series: name } = post.data;
    if (!name) return true;

    const [contents, ...parts] = series.get(name) ?? [];
    return (parts[parts.length - 1] ?? contents).id === post.id;
  });
}
