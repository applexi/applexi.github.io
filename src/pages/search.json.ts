import { getPosts, getProjects } from "../lib/collections";

/**
 * Strips enough Markdown that a search for a word doesn't miss it for sitting next to a
 * backtick, and drops link targets so a query can't match a URL nobody can see.
 */
const searchable = (body = "") =>
  body
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/[`*_~>#|]+/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();

/**
 * The body text of everything, keyed as the search page keys its results.
 *
 * Titles, descriptions and tags are already in the page's markup, so the page matches
 * those itself and this only exists to make the text of a post searchable without
 * writing every post into the markup twice.
 */
export async function GET() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const text: Record<string, string> = {};

  for (const project of projects) {
    text[`project:${project.id}`] = searchable(project.body);
  }
  for (const post of posts) {
    text[`writing:${post.id}`] = searchable(post.body);
  }

  return new Response(JSON.stringify(text), {
    headers: { "content-type": "application/json" },
  });
}
