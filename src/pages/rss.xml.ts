import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts } from "../lib/collections";
import { sortTags } from "../lib/tags";
import { site } from "../site.config";

export async function GET(context: APIContext) {
  const posts = await getPosts();

  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: sortTags(post.data.tags),
      link: `/writing/${post.id}/`,
    })),
  });
}
