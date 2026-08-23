---
title: "Intro to Modular"
description: Personal notes on what secret sharing is and secret sharing schemes.
pubDate: 2026-06-16
tags: ["Technical Note", "Math"]
series: "Cryptography Notes"
part: 1
---

## The Modular Universe

- In the real world, integers is not an infinite set
    - $\text{len}(B) = \# \text{ bits to write } B \approx \log_2(B)$
    - Thus, there is a need for the modular universe
- $A\mod N$ = remainder when you do A / N
- $A \equiv B \mod B$ or $A \equiv_N B$ when $A \mod N = B \mod N$
    - $A$ is **congruent** to $B$ modulo $N$
    - $A \equiv_N B \iff N \text{ divides } A - B$ (just imagine A + remainder - remainder)
- Thus, the universe is $\mathbb{Z}$, where $\mathbb{Z}_N = \{0, 1, 2, … N - 1\}$

## Basic Operations

- **Addition:** $A +_N B = (A + B) \mod N = (A \mod N) +_N (B \mod N)$
    - $0$ is the (additive) identity: $\forall A, 0 +_N A = A +_N 0 = A$
- **Subtraction:** $-B$ is just $+(-B)$
    - Given $B \in \mathbb{Z}_N$, its additive inverse $-B$, is the element in $\mathbb{Z}_N$ st $\newline B +_N - B = 0$
    - $\forall A \in \mathbb{Z}_N, -A = N - A \implies \forall A \in \mathbb{Z}_N, \exists -A$
        - All elements in $\mathbb{Z}_N$ has an additive inverse
    - $A +_N B = A +_N B’ \implies B = B’$
- **Multiplication:**
    - $A \cdot_N B = (A \cdot B) \mod N = (A \mod N) \cdot_N (B \mod N)$
    - $I$ is the (multiplicative) identity: $\forall A, I \cdot_N A = A \cdot_N I = A$
- **Division:** $A/B = A \cdot \frac{1}{B} = A \cdot B^{-1}$
    - Given $B \in \mathbb{Z}_N$, its multiplicative inverse $B^{-1}$, is the element in $\mathbb{Z}_N$ st $\newline B \cdot_N B^{-1} = 1$
    - $A /_N B = A \cdot_N B^{-1}$
    - <highlight> $A^{-1} \in \mathbb{Z}_N$ exists if and only if $\gcd(A, N) = 1$
        - If $\gcd(a, b) = 1$, we say $a$ and $b$ are **relatively prime** </highlight>
    - Define multiplicative **group** $\mathbb{Z}^*_N,$ st $\mathbb{Z}^*_N = \{A \in \mathbb{Z}_N : \gcd(A, N) = 1 \}$
    - <highlight> Define Euler’s **totient** function $\varphi$, st $\varphi(N) = |\mathbb{Z}^*_N|$
        - For $P$ prime, $\varphi(P) = P - 1$ (every number until P is relatively prime)
        - For $P, Q$ distinct primes, $\varphi(PQ) = (P - 1)(Q - 1)$ </highlight>
    - $\forall A \in \mathbb{Z}^*_N, \exists A^{-1}$
    - $A \cdot_N B = A \cdot_N B’ \implies B = B’$
- **Notes:**
    - For any $N$, $\mathbb{Z}_N$ is a **ring**, and behaves nicely with respect to addition/subtraction
    - $\mathbb{Z}_N$ is a **field** iff $N$ is a prime. We can notate fields as $\mathbb{F}_N$, where $N$ must be a prime
    - <highlight> $\mathbb{Z}^*_N \neq \mathbb{Z}_N$ including when $N$ is prime, as $0 \in \mathbb{Z}_N$, and $0$ is not invertible </highlight>
    - $\mathbb{Z}^*_N$ behaves nicely with respect to multiplication/division

## Exponentiation

- $g \in \mathbb{Z}^*_N$ is a **generator** or **primitive root** of $\mathbb{Z}^*_N$ if $\forall A \in \mathbb{Z}^*_N, \exists k$ st $g^k = A$
- <highlight> **Euler’s Theorem:** $\forall A \in \mathbb{Z}^*_N, A^{\varphi(N)} = 1$
    - Equivalently, $\forall A \in \mathbb{Z}, N \in \mathbb{N}$ with $\gcd(A, N) = 1, \newline A^{\varphi(N)} \equiv 1 \mod N$ </highlight>
- When $N$ is a prime…
- <highlight> **Fermat’s Little Theorem:** Let $P$ be a prime. $\forall A \in \mathbb{Z}^*_P, A^{P-1} = 1$
    - Equivalently, $\forall A$ not divisible by $P$, $\newline A^{P - 1} \equiv 1 \mod P$ </highlight>
- Essentially, for elements $A \in \mathbb{Z}^*_N$, its exponents live in universe $\mathbb{Z}_{\varphi(N)}$
- Exercise:
    - $A \equiv C \mod N \iff \exists k, A = C + kN \newline \implies \forall B ≥ 0, A^B = (C + kN)^B = C^B + \text{smth divisible by } N \newline \implies A^B \equiv C^B \mod N$
    - $B$ can be reduced through $\mod \varphi(N)$

## Complexity of Basic Operations

- Addition, subtraction, and multiplication are poly-time
- Division of $A/_NB$ depends on $B^{-1}$, and thus $\gcd(B, N)$
- **Euclid’s Algorithm:**
    
    ```python
    # Note: gcd(A, B) = gcd(B, A) = gcd(B, A - qB) for some q
    def gcd(A, B):
        if B == 0: return A
        return gcd(B, A % B) 
    ```
    
    - This tells us whether or not an element has an inverse
- Is there an algorithm to find an element’s inverse?
    - Define $C$, where $C$ is a **miix** of $A$ and $B$ if $C = k \cdot A + l \cdot B$ for some $k, l \in \mathbb{Z}$
    - $C$ is a miix of $A$ and $B$ $\iff C$ is a multiple of $\gcd(A, B)$
        - Now suppose $C = 1 \cdot \gcd(A, B)$. By the bi-implication above, $\newline \exists k, l \in \mathbb{Z},  k \cdot A + l \cdot B = \gcd(A, B)$.
        - $\gcd(B, N) = 1 \implies \exists k, l \in \mathbb{Z}, 1 = k \cdot B + l \cdot N$
        - $B^{-1} = k \mod N$
- **Extended Euclid’s Algorithm:**
    
    ```python
    def gcdExtended(A, B):
        if B == 0: return (A, 1, 0)
        g, k, l = gcdExtended(B, A % B)
        return (g, l, k - (A // B) * l)
    ```
    

## Complexity of Exponentiation

- To optimize $A^E \mod N$, $\mod N$ every step, and split $E$ based on binary
    
    ```python
    def exp(A, E, N):
        ret = 1
        A %= N
        while E > 0: # Going through all bits of E, LSB -> MSB
            if E & 1: 
                ret = (ret * A) % N # ret = ret * A^{2i}
            A = (A * A) % N
            E >>= 1
        return ret
    ```