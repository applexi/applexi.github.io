import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getAllSeries, type SeriesSummary } from "../../../lib/collections";
import { sortTags } from "../../../lib/tags";
import { site } from "../../../site.config";

export async function getStaticPaths() {
  const series = (await getAllSeries()).filter((summary) => summary.contents.data.subscribe);
  return series.map((summary) => ({
    params: { id: summary.contents.id },
    props: { summary },
  }));
}

export async function GET(context: APIContext) {
  const { summary } = context.props as { summary: SeriesSummary };
  const posts = [summary.contents, ...summary.parts];

  return rss({
    title: `${summary.name} · ${site.title}`,
    description: `Updates to ${summary.name}.`,
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
