import { existsSync } from "node:fs";
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Folders inside a content directory are filing for me and not structure for the site:
 * an id, and so a URL, is the file name with any folders above it dropped.
 *
 * Two files of the same name in different folders would leave one quietly shadowing the
 * other, so that throws instead. A file that has since moved doesn't count as a clash,
 * which is what the `existsSync` is for — a rename hands us the old path again.
 */
const flatIds = () => {
  const seen = new Map<string, string>();

  return ({ entry, base }: { entry: string; base: URL }) => {
    const id = entry
      .split("/")
      .pop()!
      .replace(/\.mdx?$/, "");

    const earlier = seen.get(id);
    if (earlier && earlier !== entry && existsSync(new URL(earlier, base))) {
      throw new Error(
        `"${earlier}" and "${entry}" would both be published as "${id}". ` +
          `Folders don't appear in URLs, so the file names have to differ.`,
      );
    }

    seen.set(id, entry);
    return id;
  };
};

const projects = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/projects",
    generateId: flatIds(),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    github: z.url().optional(),
    demo: z.url().optional(),
    // A write-up: either a full URL or a file in public/, e.g. "/marage.pdf".
    paper: z.string().optional(),
    tags: z.array(z.string()).default([]),
    // Higher numbers sort first. Ties fall back to alphabetical order.
    order: z.number().default(99),
    draft: z.boolean().default(false),
  }),
});

const writing = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/writing",
    generateId: flatIds(),
  }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      // Posts meant to be read in order name the same series. Previous and next links
      // are worked out from that name, so no post points at another one.
      series: z.string().optional(),
      // Only needed when the reading order isn't the order they were published in.
      part: z.number().optional(),
      // Set only on a series' part-0 contents page to offer subscriptions for that series.
      subscribe: z.boolean().default(false),
      draft: z.boolean().default(false),
    })
    .refine((data) => data.part === undefined || data.series !== undefined, {
      message: "part needs a series to be a part of",
      path: ["part"],
    })
    .refine((data) => !data.subscribe || data.part === 0, {
      message: "subscribe can only be set on a series' part-0 contents page",
      path: ["subscribe"],
    }),
});

export const collections = { projects, writing };
