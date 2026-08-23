import type { CollectionEntry } from "astro:content";
import { importantTags } from "../site.config";
import { getPosts, getProjects } from "./collections";

export interface Tag {
  /** URL-safe form, used as the `tag` parameter on /search. */
  slug: string;
  /** The tag as written in frontmatter, shown to readers. */
  label: string;
  /** True for the tags listed in site.config, which sort first everywhere. */
  important: boolean;
  /** Only important tags carry this: a shorter name for use in prose. */
  short?: string;
  projects: CollectionEntry<"projects">[];
  posts: CollectionEntry<"writing">[];
}

/**
 * "AWS Nitro Enclaves" and "aws-nitro-enclaves" both become "aws-nitro-enclaves",
 * so tags that differ only in punctuation or case share one page.
 */
export function tagSlug(tag: string) {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Tags have no pages of their own: a chip opens /search with that tag already on. */
export function tagUrl(tag: string) {
  return `/search?tag=${tagSlug(tag)}`;
}

const important = new Map(
  importantTags.map((tag, index) => [tagSlug(tag.label), { ...tag, index }]),
);

export function isImportant(tag: string) {
  return important.has(tagSlug(tag));
}

/**
 * Important tags first, in the order site.config lists them; everything else keeps
 * the order it was written in.
 */
export function sortTags(tags: string[]) {
  const rank = (tag: string) =>
    important.get(tagSlug(tag))?.index ?? importantTags.length;
  return [...tags].sort((a, b) => rank(a) - rank(b));
}

/** How many things carry a tag, used for sorting and for the counts on the pills. */
export function tagCount(tag: Tag) {
  return tag.projects.length + tag.posts.length;
}

/**
 * Every tag across both collections, each with the entries that carry it. Important
 * tags come first in configured order, the rest by how often they're used.
 */
export async function getTags(): Promise<Tag[]> {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const tags = new Map<string, Tag>();

  const add = <T extends "projects" | "writing">(
    entry: CollectionEntry<T>,
    key: "projects" | "posts",
  ) => {
    for (const label of entry.data.tags) {
      const slug = tagSlug(label);
      if (!slug) continue;
      const known = important.get(slug);
      const tag =
        tags.get(slug) ??
        ({
          slug,
          // Important tags read as configured; others take their first spelling.
          label: known?.label ?? label,
          important: Boolean(known),
          short: known?.short,
          projects: [],
          posts: [],
        } satisfies Tag);
      (tag[key] as CollectionEntry<T>[]).push(entry);
      tags.set(slug, tag);
    }
  };

  for (const project of projects) add(project, "projects");
  for (const post of posts) add(post, "posts");

  const rank = (tag: Tag) =>
    important.get(tag.slug)?.index ?? importantTags.length;

  return [...tags.values()].sort(
    (a, b) =>
      rank(a) - rank(b) ||
      tagCount(b) - tagCount(a) ||
      a.label.localeCompare(b.label),
  );
}

/** The two groups of filter pills shown on /search. */
export async function getTagGroups() {
  const tags = await getTags();
  return {
    important: tags.filter((tag) => tag.important),
    normal: tags.filter((tag) => !tag.important),
  };
}
