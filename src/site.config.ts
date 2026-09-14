/**
 * Everything personal about this site lives here.
 * Edit this file first; you should rarely need to touch anything else.
 */

export const site = {
  // Your GitHub username. Must match the repo name `<username>.github.io`.
  githubUsername: "applexi",

  // Shown in the browser tab, RSS feed, and page metadata.
  title: "Aprille Xi",
  tagline: "Applied cryptography, cryptosystems, and machine learning research",

  // Used for social previews and search engines.
  description:
    "Personal site of Aprille Xi.",

  // Full deployed URL. Change this only if you move to a custom domain.
  url: "https://applexi.github.io",

  // Optional: drop an image at public/avatar.jpg and set this to "/avatar.jpg".
  avatar: "",
};

/**
 * The intro shown on the home page. Each string becomes its own paragraph.
 *
 * Drafted from your resume. The facts should be right, but the voice is mine —
 * rewrite it to sound like you.
 */
export const intro = [
  "Hi, I'm Aprille! I studied computer science at Carnegie Mellon university, concentrating in machine learning. I enjoy researching a complex topic, analyzing it, and then implementing and optimizing it.",
  "Right now I'm an Engineering Fellow on the applied research team at Tools for Humanity, studying trusted execution environments and multi-party computation. Before that I spent a year and a half in CMU's Cryptosystems Group helping with bootstrap placement for fully homomorphic encryption, and a stretch at LearnLab building LLM tooling for tutoring systems.",
  "For fun, I really like drawing, writing, and thinking about things I could create.",
  "This site is where I keep my technical projects, not-so-technical projects, and maybe the occasional thought in the form of writing.",
];

/**
 * Tags that say what kind of thing something is, rather than what it's about.
 * They behave like any other tag — write them in a post's `tags` list — but they sort
 * ahead of the rest wherever tags are shown, and get their own group of pills on /search.
 *
 * `label` must match how the tag is written in frontmatter, and `short` is a shorter name
 * for the tag, used where it reads better in prose.
 */
export const importantTags = [
  { label: "Technical Project", short: "technical projects" },
  { label: "Personal Project", short: "personal projects" },
  { label: "Poetry", short: "poems" },
  { label: "Creative Writing", short: "prose" },
  { label: "Technical Note", short: "technical notes" },
] as const;

/**
 * Links shown in the footer and on the home page.
 * Delete any you don't want; add any you do.
 */
export const socials = [
  { label: "GitHub", href: "https://github.com/applexi" },
  { label: "Email", href: "mailto:xi.aprille@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/aprille-xi" },
];

/**
 * Your resume, linked straight from the nav as a PDF.
 * Drop the file at public/resume.pdf, then set this to "/resume.pdf".
 * While it's empty the Resume link stays hidden, so there's no dead link.
 */
export const resumePdf = "/resume.pdf";

/** Top navigation. Remove an entry to hide that section from the nav. */
export const nav = [
  { label: "Home", href: "/" },
  { label: "Search", href: "/search" },
  { label: "Projects", href: "/projects" },
  { label: "Writing", href: "/writing" },
  // ...(resumePdf ? [{ label: "Resume", href: resumePdf }] : []),
];
