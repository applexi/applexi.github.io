---
title: "Secret Sharing"
description: Personal notes on what secret sharing is and secret sharing schemes.
pubDate: 2026-06-24
tags: ["Technical Note", "Cryptography", "Secret Sharing"]
series: "Cryptography Notes"
---

## Background

- **Secret sharing scheme:** "A dealer distributes a secret $s$ between parties
  $P = \{P_1, \dots, P_n\}$ such that $s$ can only be reconstructed if a _qualified
  subset_ of these parties collaborates, while no other (_unqualified_) subset can learn
  any information about the secret"
- A set $\Gamma \subseteq 2^{\{1, \dots, n\}}$ is called a **monotone access structure**
  on $\{1, \dots, n\}$ if $A \in \Gamma \wedge B \supseteq A \implies B \in \Gamma$
  - **Qualified set:** $G \in \Gamma$, **non-qualified set:** $N \notin \Gamma$
  - $\Gamma$ is essentially the set of qualified sets/parties that can reconstruct $s$
  - "Monotone": any superset of a qualified set is also a qualified set
  - Example: $2/3$ for $\{1, 2, 3\} \implies \Gamma = \{\{1, 2\}, \{2, 3\}, \{1, 3\}, \{1, 2, 3\}\}$
- This directly correlates with a **threshold scheme**, where a set is qualified if it
  consists of at least $k$ parties for some fixed $k \leq n$
  - Basically, $\Gamma = \{G \subseteq \{1, \dots, n\} : |G| \geq k\}$
  - $(k, n)$: notation for a $k$ threshold, $n$ total parties scheme, or "$k$-of-$n$
    scheme"
  - Example: $\{1, 2, 3\}, k = 2 \implies \Gamma = \{\{1, 2\}, \{2, 3\}, \{1, 3\}, \{1, 2, 3\}\}$
- A **secret sharing scheme** for a set $S$ of secrets and a
  $\Gamma \subseteq 2^{\{1, \dots, n\}}$ is a tuple of PPT algorithms
  $(\text{share}, \text{reconstruct})$ such that:
  - $\text{share}$: on input $s \in S$, outputs shares
    $\sigma_1, \dots, \sigma_n \in \{0, 1\}^*$
  - $\text{reconstruct}$: on input $\{(i, \sigma_i) : i \in G\}$, outputs $s' \in S$ or
    $\perp$ (failure)
- $[x]$: notation for a **sharing** of the value $x$

### Security properties

**Completeness.** There exists a function $\text{negl}$ such that for all $s \in S$ and
all $G \in \Gamma$:

$$
\Pr\left[s = s' : \begin{array}{l}
(\sigma_1, \dots, \sigma_n) \sample \text{share}(s) \\
s' \sample \text{reconstruct}(\{(i, \sigma_i) : i \in G\})
\end{array}\right] \geq 1 - \text{negl}(\lambda)
$$

- For every qualified set, $\text{reconstruct}$ recovers $s$
- Perfectly complete: $\text{negl}(\lambda) = 0$

**Privacy.** For every PPT algorithm $\text{A}$ there exists a function $\text{negl}$
such that for all $N \notin \Gamma$:

$$
\Pr\left[s = s' : \begin{array}{l}
(\sigma_1, \dots, \sigma_n) \sample \text{share}(s) \\
s' \sample \text{A}(\{(i, \sigma_i) : i \in N\})
\end{array}\right] \leq \frac{1}{q} + \text{negl}(\lambda)
$$

- Any unqualified set of shares does not reveal anything about $s$
- Perfectly private: $\text{negl}(\lambda) = 0$, otherwise computationally private

## Perfectly private secret sharing

### Additive secret sharing

<highlight>

Additive secret sharing is an $(n, n)$ scheme, so $\Gamma = \{\{1, \dots, n\}\}$.

- $\text{share}$: on input $s \in S := \mathbb{Z}_q$, choose
  $a_1, \dots, a_{n-1} \sample \mathbb{Z}_q$ and define
  $a_n := s - \sum_{i=1}^{n-1} a_i,$ outputs $\sigma_i := a_i$ for $i = 1, \dots, n$
- $\text{reconstruct}$: on input $[\sigma] = (\sigma_1, \dots, \sigma_n)$, output
  $s' = \sum_{i=1}^{n} \sigma_i$ in $\mathbb{Z}_q$

</highlight>

For all $q$ and all $n$, additive secret sharing is perfectly complete and perfectly
private.

- **Time complexity**: $\text{share}$ is $O(n)$, and $\text{reconstruct}$ is $O(n)$
  - $\text{share}$: generates $n - 1$ randoms $\to O(n)$, $n$ additions/subtractions
    $\to O(n)$
  - $\text{reconstruct}$: $n - 1$ additions $\to O(n)$
- **Space complexity**: $n$ parties, each share $\lceil \log_2 q \rceil$
- Additive secret sharing is **additively homomorphic**, as in $[x + y] = [x] + [y]$, or
  $\text{Enc}(x + y) = \text{Enc}(x) + \text{Enc}(y)$

### Replicated secret sharing

<highlight>

RSS is a $(k, n)$ sharing scheme based on additive secret sharing.

- $\text{share}$: on input $s \in S := \mathbb{Z}_q$, let
  $\mathcal{A} = \{A \subseteq \{1, \dots, n\} : |A| = k - 1\}$, choose
  $a_A \sample \mathbb{Z}_q$ for all but one $A \in \mathcal{A}$ and define that last one
  so that $s = \sum_{A \in \mathcal{A}} a_A$, outputs
  $\sigma_i := \{a_A : i \notin A\}$ for $i = 1, \dots, n$
- $\text{reconstruct}$: on input any $k$ shares $(\sigma_{i_1}, \dots, \sigma_{i_k})$,
  for all $A \in \mathcal{A}$ choose any $j \in \{i_1, \dots, i_k\}$ such that
  $j \notin A$, and let $\hat{a}_A := a_A \in \sigma_j$, output
  $s' := \sum_{A \in \mathcal{A}} \hat{a}_A$ in $\mathbb{Z}_q$

</highlight>

For all $q$, all $n$, and all $k \leq n$, RSS is perfectly complete and perfectly
private.

- **Time complexity**: $\text{share}$ is $O(\binom{n}{k-1}(n - k + 1))$,
  $\text{reconstruct}$ is $O(\binom{n}{k-1})$
  - $\text{share}$: $|\mathcal{A}| = \binom{n}{k-1} \implies \binom{n}{k-1}$ $a_A$'s,
    with $|A| = k - 1$. From the output line, we see that each $a_A$ is given to
    $n - (k - 1)$ parties
- **Space complexity**: $n$ parties, each party stores
  $O(\binom{n-1}{k-1} \lceil \log_2 q \rceil)$

### Shamir secret sharing

<highlight>

Shamir secret sharing is a $(k, n)$ sharing scheme based on polynomials.

- $\text{share}$: on input $s \in S := \mathbb{Z}_q$, choose
  $a_1, \dots, a_{k-1} \sample \mathbb{Z}_q$ such that $a_{k-1} \neq 0$, define
  $f(x) := a_{k-1}x^{k-1} + \dots + a_1x + s$, output $\sigma_i := f(i)$ for
  $i = 1, \dots, n$
- $\text{reconstruct}$: on input at least $k$ points $(i, \sigma_i)$, run Lagrange
  interpolation to get polynomial $g(x)$ of degree $k - 1$ in $\mathbb{F}_q[x]$, output
  $s' = g(0)$

</highlight>

- Observation: $q > n$ is a necessity here as points must be distinct, and we must work
  with fields for invertibility
- Observation: in a field, a polynomial of degree $k - 1$ is uniquely determined by $k$
  values, while knowing at most $k - 1$ values does not reveal any information about the
  slope (other than those $k - 1$ values)

For every prime $q > n$ and all $k \leq n$, Shamir is perfectly complete and
perfectly private.

- **Time complexity**: $\text{share}$ is $O(nk)$, $\text{reconstruct}$ is $O(k^2)$
  - $\text{share}$: from Horner's rule, each $f(i)$ evaluation costs $O(k - 1)$
  - $\text{reconstruct}$: Lagrange interpolation
- **Space complexity**: $n$ parties, each party stores $O(1)$
