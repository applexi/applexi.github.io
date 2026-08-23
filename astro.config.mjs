// @ts-check
import { readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { satteri } from "@astrojs/markdown-satteri";
import { satteriKatex } from "satteri-katex";

/**
 * Code colors come from the GrayJack theme pack, the same VS Code themes used while
 * writing, so a snippet looks the way it did in the editor. They're TextMate themes,
 * which is what the highlighter wants, copied into `src/themes` with their license.
 *
 * @param {string} name
 */
const editorTheme = (name) => {
  const theme = JSON.parse(
    readFileSync(new URL(`./src/themes/${name}.json`, import.meta.url), "utf8"),
  );
  // The highlighter turns a theme's name into CSS classes, and these ship with
  // spaces and apostrophes in theirs.
  return { ...theme, name };
};

// satteri-katex types its return as possibly undefined; it never is.
const katex = /** @type {import("satteri").MdastPluginDefinition} */ (
  satteriKatex({
    // `\sample` renders the uniform-sampling arrow. It's a macro because a literal
    // `\$` inside math would close the expression early.
    macros: { "\\sample": "\\overset{\\$}{\\leftarrow}" },
  })
);

/**
 * `<toggle>` and `<title>` are renamed to `<details>` and `<summary>`, while
 * `<highlight>` becomes a block `<div>`, before the HTML is written. That gives posts
 * the browser's own fold behaviour — keyboard support, find-in-page, no JavaScript —
 * and lets highlights safely contain lists and toggles without naming those elements
 * while writing.
 * Only raw HTML is touched, so `<title>` inside backticks stays as written.
 *
 * @type {import("satteri").MdastPluginDefinition}
 */
const toggleSyntax = {
  name: "toggle-syntax",
  html(node, ctx) {
    const renamed = node.value
      .replace(/<(\/?)toggle(?=[\s>])/g, "<$1details")
      .replace(/<(\/?)title(?=[\s>])/g, "<$1summary")
      .replace(/<highlight(?=[\s>])/g, '<div class="highlight"')
      .replace(/<\/highlight(?=[\s>])/g, "</div");
    if (renamed !== node.value) ctx.setProperty(node, "value", renamed);
  },
};

// https://astro.build/config
export default defineConfig({
  // Must match your deployed URL. Update this if you move to a custom domain.
  // No `base` is needed because the repo is named `<username>.github.io`.
  site: "https://applexi.github.io",
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: {
        light: editorTheme("grayjack-catppuccin-latte"),
        dark: editorTheme("cosmicgirl-dracula-pastel"),
      },
      wrap: true,
    },
    // `$x$` for inline math, `$$...$$` for display math, rendered at build time.
    // KaTeX has to run on the mdast, before the highlighter claims display math.
    processor: satteri({
      features: { math: true },
      mdastPlugins: [katex, toggleSyntax],
    }),
  },
});
