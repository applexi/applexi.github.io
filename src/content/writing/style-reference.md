---
title: Style reference
description: Every prose element this site can render, in one place, as a draft.
pubDate: 2026-08-22
tags: ["Technical Note"]
draft: true
---

This note exists to show what the pieces look like. It stays a draft, so it shows up in
`npm run dev` and never ships to the published site.

## Code blocks

A fenced block picks up syntax highlighting from the language after the backticks. Both
themes are baked in, so this follows light and dark mode without a flash:

```go
func (e *Executor) rotate(ct *rlwe.Ciphertext, offset int) *rlwe.Ciphertext {
    // Decompose the offset into powers of two so one key per bit is enough.
    for shift := 0; offset != 0; shift++ {
        if offset&1 == 1 {
            ct = e.eval.RotateNew(ct, 1<<shift)
        }
        offset >>= 1
    }
    return ct
}
```

Python, to compare:

```python
def additive_shares(secret: int, n: int, q: int) -> list[int]:
    shares = [secrets.randbelow(q) for _ in range(n - 1)]
    shares.append((secret - sum(shares)) % q)
    return shares
```

Long lines wrap instead of scrolling sideways, which matters on a phone:

```bash
nitro-cli run-enclave --eif-path enclave.eif --memory 4096 --cpu-count 2 --enclave-cid 16 --debug-mode
```

A block with no language gets the same surface without any coloring, which suits output
and pseudocode:

```text
Start building the Enclave Image...
Enclave Image successfully created.
```

Inline code like `/dev/nsm` or `--cpu-count` sits on that same surface, a shade off the
page background.

## Headings and text

### A third-level heading

Body text runs to a comfortable measure. **Bold** sits just under heading weight so it
never competes with the heading above it, _italic_ is here, and [links carry color
instead of an underline](https://docs.aws.amazon.com/enclaves/).

- A list item
- Another one, long enough to wrap so you can see where the second line sits relative to
  the marker above it
  - A nested item
    - And one deeper

1. Ordered lists work too
2. Second step
3. Third step

> A blockquote, for when someone else said it better.

## Math

Inline math like $h(\text{prev} \mathbin\| \text{data})$ flows with the text. Display math
gets its own line:

$$
a_n = s - \sum_{i=1}^{n-1} a_i \pmod q
$$

## Tables

| Element    | Written as      | Notes                   |
| ---------- | --------------- | ----------------------- |
| Code block | three backticks | language optional       |
| Fold       | `<toggle>`      | compiles to `<details>` |
| Highlight  | `<highlight>`   | tinted surface          |

## Folds and highlights

<toggle>
<title>A fold, collapsed until you click it</title>

Anything works in here — lists, code, math:

```rust
let attestation = nsm::get_attestation_doc(&request)?;
```

</toggle>

<highlight>

A highlighted block. Nothing changes but the background, which makes it useful for a
conclusion or a warning you don't want skimmed past.

</highlight>

Highlights work on bullets too, marker included:

- an ordinary bullet
- <highlight>a highlighted bullet</highlight>
