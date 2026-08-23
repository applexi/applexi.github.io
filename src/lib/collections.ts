import { getCollection } from "astro:content";

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
