---
title: "Intro to Polynomials"
description: Personal notes on polynomials.
pubDate: 2026-06-17
tags: ["Technical Note", "Math"]
series: "Cryptography Notes"
part: 3
---

## Introduction

- We define a **polynomial** over variable $x$ of degree $d$ as: $P(x) = c_dx^d + … + c_1x + c_0$
- Notice that the $d+1$ coefficients $<c_d, c_{d-1}, …, c_0>$ completely describes $P(x)$
- Operations on polynomials:
    - $R(x) = P(x) + Q(x) \implies \text{deg}(R(x)) \leq \max(\deg(P(x)), \deg(Q(x)))$
    - $R(x) = P(x) \times Q(x) \implies \deg(S(x)) = \deg(P(x)) + \deg((Q(x))$
    - $R(x) = P(x)/Q(x)$ may not result in a polynomial
    - **Evaluation:** Given $P(x)$ and value $a$, $ P(a) := c_d \cdot a^d + … + c_1 \cdot a + c_0$
        - Naive evaluation takes $O(d^2)$ time, but Horner’s Rule improves this to $O(d)$
- Horner’s Rule:
    
    ```python
    # Inputs: vector of coefficients c and value a
    def horners(c, a):
        d = len(c) - 1 # degree d
        p = c[d]
        for i in range(d - 1, -1, -1):
            p = p * a + c[i]
        return p
    ```
    
- Value $a$ is a **root** of polynomial $P(x)$ if $P(a) = 0$
- Any non-zero polynomial of degree at most $d$ has at most $d$ roots
    - Example: degree 1 (line) crosses x-axis at most once $(x = -c_0/c_1$ for $c_1x + c_0)$
    - Contrapositive: If a polynomial of degree at most $d$ has more than $d$ roots, then it is the zero polynomial

- <highlight> Given $d + 1$ pairs $(a_0, b_0), (a_1, b_1), …, (a_d, b_d)$ *where the $a_i$’s are distinct*, there **exists one unique** polynomial $P(x)$ of degree at most $d$, st $P(a_i) = b_i, \forall i = 0, …, d$
    - <toggle> <title> Given $d + 1$ pairs, there is **at most** **one** $P(x)$ of degree at most $d$ </title>
        - AFSOC there is more than one polynomial $P(x)$ and $Q(x)$ of degree at most $d$ st $P(a_i) = Q(a_i) = b_i, \forall i = 0, …, d$
        - Let polynomial $R(x) = P(x) - Q(x)$, where $\deg(R(x)) ≤ d$ by operations above
        - $\implies \forall i = 0, …, d, R(a_i) = P(a_i) - Q(a_i) = 0$
        - $\implies R(x)$ has $d + 1$ roots $\implies R(x)$ is the zero polynomial
        - $\implies 0 = P(x) - Q(x) \implies P(x) = Q(x) \implies$ contradiction! </toggle>
        - Given $d + 1$ pairs *where the $a_i$’s are distinct,* there **exists** a $P(x)$ of degree at most $d$
            - Case all $b_i$’s are 0: $\newline \implies P(x)$ has $d + 1$ roots, and is zero polynomial, which is not possible
            - Case $\exists i \in {0, …, d}$ st $b_i \neq 0$:
                - Do Lagrange Interpolation on pairs
                - Since $R(x)$ is a degree $d$ polynomial, $P(x)$ is at most a degree $d$ polynomial
                - Since $\forall j \neq i, R_j(a_i) = 0 \implies$ $P(a_i) = b_iR_i(a_i) = b_i$
 </highlight>
 
- **Lagrange Interpolation:**
    - For a pair $(a_i, b_i), \forall i = 0, …, d$:
        - Let $R_i(x) = \frac{(x - a_0)…(x - a_{i - 1})(x - a_{i + 1})…(x - a_d)}{(a_i - a_0)…(a_i - a_{i - 1})(a_i - a_{i + 1})…(a_i - a_d)}$
    - Output $P(x) = b_0R_0(x) + b_1R_1(x) + … + b_dR_d(x)$

<!-- - TODO: Complexity for constructing degree $d$ polynomial?
    - Right now, $R_i(x)$ is $O(d^2)$… is there a better way?
- TODO: Prove that knowing $d - 1$ values of a degree $d$ polynomial $P(x)$ does not give any information on the polynomial besides those $d - 1$ points -->