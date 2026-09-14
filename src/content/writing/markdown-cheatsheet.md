---
title: "Markdown Cheat Sheet"
description: Compact examples for writing notes on this site.
pubDate: 2026-08-23
tags: ["Technical Note", "Writing"]
draft: true
---

# Markdown Cheat Sheet

## Text

**bold** · *italic* · ~~strikethrough~~ · `inline code` · [link](https://example.com) · $x^2 + y^2$

```md
**bold** *italic* ~~strikethrough~~ `inline code` [link](url) $x^2$
```

## Lists and indentation

Ordinary list items under a heading share one indent (the list’s `padding-left`). Nested
bullets add another step.

- Dot
  - Nested dot
    - Deeper dot

1. Numbered
   1. Nested numbered

- [ ] Task
- [x] Done

```md
- Dot
  - Nested dot
1. Numbered
   1. Nested numbered
```

A blank line between two `-` blocks starts a **new** list. That is fine when you want a
break after a toggle or highlight; both lists still line up with each other.

## Highlight

Two shapes. Prefer the first when the tinted block contains a **list**.

### Standalone highlight (lists, long notes)

Wrap the whole block. Leave blank lines inside the tags. The list inside lines up with
ordinary lists under headings (horizontal padding on the tint is dropped when the
highlight’s only child is a list).

<highlight>

- Tinted list item, same indent as a normal bullet under a heading
  - Nested item inside the tint
- Another tinted sibling

</highlight>

- Untinted bullet after the highlight (separate list; same indent)

```md
<highlight>

- Tinted list item
  - Nested item
- Another tinted sibling

</highlight>

- Untinted bullet after the highlight
```

### Highlight in a bullet (short, no nested list)

Keep the tags on the **same** list item. Close `</highlight>` on the last line of that
item’s content — do not put `</highlight>` on its own line after nested bullets.

- <highlight>**Short tinted bullet.** No nested list inside.</highlight>

```md
- <highlight>**Short tinted bullet.** No nested list inside.</highlight>
```

### What breaks

Do **not** write `- <highlight>` … nested `-` bullets … `</highlight>` on a following line.
Markdown/HTML repair can eject later siblings out of the `<ul>`, so they lose indent and
sit flush with headings.

## Toggle

Toggles become `<details>` / `<summary>`. Two shapes.

### Standalone toggle (preferred after code blocks or before more lists)

Same style as the other folds in long notes. Blank lines after `<title>` are fine here.

<toggle>
<title>Standalone toggle</title>

- Any Markdown content
- Including nested lists

</toggle>

```md
<toggle>
<title>Standalone toggle</title>

- Contents
- More contents

</toggle>
```

### Toggle in a bullet

Use when the fold should sit in a list. Close `</toggle>` on the **last content line**
inside the fold (same idea as short bullet highlights). A blank line right after
`<title>` in this shape wraps the opener in `<p>` and leaves the inner list unindented.

- <toggle> <title>Toggle in a bullet</title>
  - Its content is indented under the toggle
  - Close the tag on this last line </toggle>

```md
- <toggle> <title>Toggle in a bullet</title>
  - Contents
  - Last line </toggle>
```

After a bullet toggle, later `-` items at the same level are **siblings** of the toggle
row, not children. To keep following notes in a healthy list, prefer a standalone toggle
when more bullets come next.

## Combined

Standalone highlight can wrap a bullet toggle:

<highlight>

- <toggle> <title>Highlighted toggle in a bullet</title>
  - Nest anything here </toggle>

</highlight>

```md
<highlight>

- <toggle> <title>Highlighted toggle in a bullet</title>
  - Contents </toggle>

</highlight>
```

## Blocks

> Block quote

---

```python
def hello(name):
    return f"hello, {name}"
```

````md
> Block quote

---

```python
code block
```
````

## Images and display math

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

```md
![Alt text](/image.png)

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$
```
