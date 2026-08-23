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

## Lists

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
- [ ] Task
```

## Highlight

<highlight>

**Standalone highlight.** It can contain $x \in \mathbb{R}$ and `code`.

</highlight>

- <highlight>**Highlight in a bullet.** Keep the tags on the same list item.</highlight>

```md
<highlight>

**Standalone highlight.**

</highlight>

- <highlight>**Highlight in a bullet.**</highlight>
```

## Toggle

<toggle>
<title>Standalone toggle</title>

- Any Markdown content
- Including nested lists

</toggle>

- <toggle> <title>Toggle in a bullet</title>
  - Its content is indented under the toggle
  - The triangle replaces the bullet
  </toggle>

```md
<toggle>
<title>Standalone toggle</title>

- Contents

</toggle>

- <toggle> <title>Toggle in a bullet</title>
  - Contents
  </toggle>
```

## Combined

<highlight>

- <toggle> <title>Highlighted toggle in a bullet</title>
  - Nest anything here
  </toggle>

</highlight>

```md
<highlight>

- <toggle> <title>Highlighted toggle in a bullet</title>
  - Contents
  </toggle>

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
