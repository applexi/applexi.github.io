# applexi.github.io

Personal website built with [Astro](https://astro.build), hosted free on GitHub Pages.

Live at <https://applexi.github.io>.

## Running it locally

```bash
npm install     # first time only
npm run dev     # http://localhost:4321
```

Other commands: `npm run build` produces the static site in `dist/`, `npm run preview`
serves that build, and `npm run check` type-checks everything.

## Make it yours

Start with these two files. Between them they hold every piece of personal
information on the site.

Everything personal lives in `src/site.config.ts` — your name, tagline, home page
intro, social links, nav, and resume link.

The home page shows only your intro. Projects and posts live on their own pages,
reachable from the nav.

Then replace the sample content:

- `src/content/projects/` — one Markdown file per project
- `src/content/writing/` — one Markdown file per post

### Adding your resume

Put the PDF at `public/resume.pdf`, then set `resumePdf: "/resume.pdf"` in
`src/site.config.ts`. A Resume link appears in the nav and opens the PDF in a new
tab. Until you set it, the link stays hidden so there's no dead link.

### Adding an avatar

Put an image at `public/avatar.jpg` and set `avatar: "/avatar.jpg"` in
`src/site.config.ts`. Leave it empty to show no photo.

## Adding a project

Create a file in `src/content/projects/`. The filename becomes the URL, so
`url-shortener.md` publishes at `/projects/url-shortener`.

```markdown
---
title: URL Shortener
description: One sentence shown in listings.
github: https://github.com/applexi/url-shortener
demo: https://short.example.com
tags: ["Go", "Redis"]
order: 1
---

Markdown here becomes the project's detail page.
```

Only `title` and `description` are required. `order` controls sorting on the Projects
page (lower numbers first). Add `paper:` for a write-up — either an external URL or a
file you've dropped in `public/`, like `/marage.pdf` — and a Paper link appears
alongside the source and demo links.

## Adding a piece of writing

Create a file in `src/content/writing/`.

```markdown
---
title: My first post
description: One sentence shown in listings and search results.
pubDate: 2026-09-01
tags: ["Poetry", "notes"]
---

Write here.
```

`title`, `description`, and `pubDate` are required. Set `draft: true` to keep a post
visible in `npm run dev` but out of the published site. Posts are listed newest first.

Folders inside `src/content/writing/` are for keeping the directory tidy and don't reach
the site: a post in `crypto/one-time-pad.md` is still published at `/writing/one-time-pad`,
and moving a file between folders leaves its URL alone. The same goes for
`src/content/projects/`. Since the folder is dropped, two posts can't share a file name —
that fails the build with both paths named rather than letting one shadow the other.

### Posts meant to be read in order

A series is a set of posts naming it, plus one that introduces it. The introduction is
`part: 0`, and every series needs one:

```markdown
---
title: Bootstrap placement
description: One sentence shown in listings and search results.
pubDate: 2026-09-01
series: "Bootstrap placement"
part: 0
---

Say what the series is about. The list of instalments appears under this.
```

The instalments then need nothing but the name:

```markdown
---
title: Where the noise comes from
description: One sentence shown in listings and search results.
pubDate: 2026-09-08
series: "Bootstrap placement"
---
```

Part 0 gets a box listing the instalments and no navigation at the foot, being the page
that holds the list rather than a step in it. Each instalment gets the parts either side of
it and a centred link back to part 0, except that the first has no previous link: part 0
isn't an instalment, so nothing precedes the first one. That's the reason for the split. One
post can't be both the contents and the first instalment without its previous link and its
contents link pointing at the same place.

Instalments sort by `pubDate`, so a series written in order needs no numbering. Add `part: 2`
when the reading order isn't the publication order — the overview written last that belongs
third. Numbering one instalment means numbering them all, since unnumbered ones sort behind
numbered ones. Two posts claiming one number fails the build, as does a series with no
`part: 0`, both naming the files rather than picking a winner quietly.

`/writing/series` is every `part: 0` post as an ordinary list of rows, the same shape as
`/writing` and `/projects`, except that the date on a row is the newest date in that series
rather than the contents post's own, and the rows sort by it — so a series you're adding to
rises back to the top. The instalments aren't listed here; that's what the contents post is
for. An "All series" pill sits opposite the heading on `/writing`, and disappears when there
are no series to look at. Nothing needs maintaining here either.
The one thing to know is that a post named `series.md` would sit at that same URL and lose,
so the build stops and tells you to rename it.

On `/writing` a series takes a single row: the newest instalment, with the series name and
where that instalment sits written beside the title, so a long series can't crowd everything
else off the page. The name links to part 0, for a reader who would rather start at the
beginning, and part 0 has no row of its own — until the series has no instalments yet, when
it takes the row itself rather than vanish. Tag pages list every post separately, since each
carries its own tags and a reader there is after a subject rather than a reading order, and
the feed carries them all.

Instalments in that box fade to the muted grey once read, which is `:visited` and so comes
with its rules: only colours may change, Chrome counts the visit only when the reader
arrived by clicking a link on this site rather than from a search result, and the list
number can't follow the title because it belongs to the item and not the link.

No post ever names another, which is the point: there's one ordering to keep right
instead of a pair of links per edge that can disagree. Adding an instalment is one new file,
and part 0 picks it up on its own.

Series and tags do different jobs, so they don't interfere — a series is a reading order,
a tag is a subject, and a post can sit in both. Note that a drafted middle instalment is
missing from the published chain, so readers go from part two straight to part four while
your local copy looks complete, and a drafted part 0 fails the build for the same reason a
missing one does.

The four `series-demo-*` drafts in `src/content/writing/` show all of this in
`npm run dev`. Delete them whenever.

## Tags and search

Tags have no pages of their own. `/search` is where they live: a text box, every tag as a
pill you can switch on, and everything on the site listed below in the two sections it
already uses. A chip on a post or project opens `/search?tag=<slug>` with that tag on, so
tagging something needs nothing wired up.

The pills sit behind a fold, so the page opens on the search box and the results rather
than on a wall of tags. It unfolds itself when a tag arrives in the URL, since one is
already on, and the summary counts what's selected — that being the only place a filter
shows while folded.

Filtering happens in the page, with no search library. Titles, descriptions and tags are
matched against the markup, which is already there, and `/search.json` carries the body
text of every entry so a word from the middle of a post finds it too. That file is built
alongside the pages and fetched once, so the first keystroke works before it lands and
gets deeper when it does. Selected pills combine with and, the query and the pills both
live in the URL as `?q=` and `?tag=`, so a search can be linked, and with JavaScript off
the page is simply a list of everything.

Slugs are lowercased with punctuation turned into hyphens, so `AWS Nitro Enclaves` becomes
`aws-nitro-enclaves`. Tags that differ only in case are one tag, and the first spelling
encountered is the one displayed — so keep spelling consistent.

A `blurb` on an important tag shows under the pills while that tag is the only one
selected, which is the one thing tag pages used to do that the pills couldn't.

### Highlighted blocks

To set a passage apart with a tinted background, wrap it in `<highlight>`:

```markdown
<highlight>

Everything reads normally in here — only the background changes.

</highlight>
```

The blank lines matter for the same reason they do in folds: without them the contents
stop being parsed as Markdown. The tint comes from `--bg-highlight`, defined once per
theme at the top of `src/styles/global.css`.

To highlight bullets, the opening tag goes _inside_ the bullet, right after the `-`:

```markdown
- <highlight>this bullet is highlighted</highlight>
- <highlight>this bullet is highlighted along with its children
  - child
  - another child
  </highlight>
```

The tint reaches left to take in the bullet marker, and gets tighter padding than a
standalone block. What doesn't work is opening the tag on its own line before a `-`: that
puts `<highlight>` in one list item and `</highlight>` in another, which no browser can
nest, and the tint ends up wrapping nothing.

### Collapsible sections

Markdown has no fold syntax, so use tags — they work in posts and project pages:

```markdown
<toggle>
<title>What's inside</title>

Markdown, math, and lists all work in here.

</toggle>
```

These compile to `<details>` and `<summary>`, which is where the fold behaviour comes
from: the browser's own, with no JavaScript, keyboard support, and find-in-page opening a
collapsed fold to show a match. The rename lives in `astro.config.mjs`, and only touches
raw HTML, so `<title>` inside backticks stays as written. Writing `<details>` and
`<summary>` directly still works too.

The blank line after `</title>` is what keeps the contents being parsed as Markdown. The
title itself is plain text — `**bold**` in there won't render. Keep headings and link
targets outside folds, since a collapsed fold won't open itself when someone follows a
link into it.

### Math

Posts and project pages render LaTeX: `$x^2$` inline, `$$...$$` on its own line. KaTeX
does the work at build time, so no JavaScript ships and the stylesheet only loads on the
pages that have prose.

The `katex` version in `package.json` only supplies the stylesheet; the renderer is the
copy `satteri-katex` depends on. Keep the two on the same major version, or the class
names stop matching and every superscript, subscript, and accent renders at full size.

One macro is defined in `astro.config.mjs`: `\sample` gives the uniform-sampling arrow
(`\overset{$}{\leftarrow}`). It exists because a literal `\$` inside math ends the
expression early, so anything needing a dollar sign in math wants a macro instead.

### Code colors

Code blocks are highlighted with two themes copied out of the GrayJack theme pack, the
same VS Code themes used while writing: Catppuccin Latte in light mode, CosmicGirl's
Dracula (Pastel) in dark. They live in `src/themes/` and are loaded by name in
`astro.config.mjs`.

To use a different one, copy its `.json` out of the extension into `src/themes/` and
change the name in that config. Any VS Code theme works as long as it's a standalone
TextMate theme, meaning it has its own `tokenColors` rather than an `include` pointing at
another file.

The block's _background_ isn't taken from the theme — it stays on `--bg-subtle` so it
matches inline code and table headers. Only the token colors come from the theme. Dropping
the `.astro-code` background rule in `global.css` would let each theme's own backdrop
through instead.

Inline code takes its text color from `--code-text` in `global.css`, set to each theme's
own foreground so `like this` matches a block with no language. Swapping themes means
updating those two values too.

The themes are Mozilla Public License 2.0, © Eric Shimizu Karbstein; the license travels
with them in `src/themes/LICENSE-grayjack-themes.txt`.

### Important tags

Some tags say what a thing _is_ rather than what it's about — Poetry, Creative Writing,
Technical Note. Those are listed in `importantTags` in `src/site.config.ts`, and they're
ordinary tags with three differences: they sort ahead of other tags wherever tags are
shown, they get their own group of pills at the top of `/search`, and their `blurb` from
the config appears there while one of them is the only tag selected.

Each one also carries a `short` name, a lowercase form for when a tag needs to read as
part of a sentence rather than as a label.

Making a tag important is one entry in that list; the `label` has to match how the tag is
written in frontmatter. Removing it from the list turns it back into a normal tag without
touching any posts.

## Publishing

Push to `main`. GitHub Actions builds and deploys automatically, usually in a minute
or two. You can watch it in the repo's **Actions** tab.

```bash
git add .
git commit -m "Add a post"
git push
```

## First-time GitHub setup

1. Create a repo on GitHub named exactly `applexi.github.io`. The name matters —
   it's what gets you the root URL and lets you skip Astro's `base` config.
2. Push this project to it.
3. In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
   Nothing deploys until you do this.

## Restyling

Colors, fonts, spacing, and content width are all CSS variables at the top of
`src/styles/global.css`. There are two color blocks — one for light mode, one for
dark — so edit both and the whole site follows.

## Using a custom domain

If you buy a domain later:

1. Add `public/CNAME` containing just the domain, e.g. `aprillexi.com`.
2. Change `site` in `astro.config.mjs` to `https://aprillexi.com`.
3. Point your domain's DNS at GitHub Pages and set the domain under
   **Settings → Pages**.

## Layout

```
src/
├── site.config.ts        # your name, bio, links, nav, resume PDF
├── content.config.ts     # frontmatter schemas for projects + writing
├── content/
│   ├── projects/         # one .md per project
│   └── writing/          # one .md per post
├── layouts/              # shared page shell
├── components/           # header, footer, cards, theme toggle
├── lib/collections.ts    # sorting + draft filtering
├── pages/                # routes
└── styles/global.css     # all styling
```
