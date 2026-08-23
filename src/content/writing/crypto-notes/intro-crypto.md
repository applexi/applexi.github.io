---
title: "Intro to Cryptography"
description: Personal notes on basic cryptography.
pubDate: 2026-06-16
tags: ["Technical Note", "Cryptography"]
series: "Cryptography Notes"
part: 2
---

We know that from Intro to Modulus, exponentiation in modulo universe is “easy”, while root and log are “harder”. Thus, exp is a “one way function”. 

## Private Key Cryptography

- Setting:
    - Party $A$ wants to send a message $M$ secretly to party $B$
    - Let $A$ have a private key $K_A$, and $B$ have a private key $K_B$
    - Let $A$ pass encrypted message $C = \text{Enc}(M, K_A)$ to $B$, where $M = \text{Dec}(C, K_B)$
- Worst case:
    - Adversary Aprille knows everything except $K_A, K_B, M$
    - This includes $C, \text{Enc}, \text{Dec}$
- One-time pad setting:
    - <highlight> **One-time pad:**
        - $M$ = message, $K$ = key, $C$ = encrypted message
        - $\text{Enc}(M, K) = M \oplus K = C$
        - $\text{Dec}(C, K) = C \oplus K = M \oplus K \oplus K = M$ </highlight>
    - For any $M$, if $K$ is truly random and $\text{len}(K) ≥ \text{len}(M)$, $C$ is truly random
    - Thus, Aprille doesn’t know anything about $M$ from $C$
    - ⚠️ If you encrypt $M_1$ and $M_2$ with $K$, $C_1 = M_1 \oplus K, C_2 = M_2 \oplus K \newline \implies C_1 \oplus C_2 = M_1 \oplus K \oplus M_2 \oplus K = M_1 \oplus M_2$

## Secret Key Sharing

- Diffie-Hellman key exchange setting:
    - <highlight> **Diffie-Hellman (DH) key exchange:**
        - Let $P$ be prime, $\implies \exists B \in \mathbb{Z}^*_P$ where $B$ is a generator of $\mathbb{Z}^*_P$
            - $\mathbb{Z}^*_P = \{B^0, B^1, …, B^{P-2}\}$
        - Alice picks $P, B, \text{ random } E_1 \in \mathbb{Z}_{\varphi(P)}$ and sends $P, B, B^{E_1}$ to Bob
        - Bob picks $\text{random } E_2 \in \mathbb{Z}_{\varphi(P)}$ and sends $B^{E_2}$ to Alice
        - Alice computes $(B^{E_2})^{E_1} = B^{E_1E_2}$
        - Bob computes $(B^{E_1})^{E_2} = B^{E_1E_2}$ </highlight>
    - Aprille sees $P, B, B^{E_1}, B^{E_2}$ and wants to compute $B^{E_1E_2}$
        - If can find $E_1, E_2$, this is trivial
    - ⚠️ This depends on the hardness of log, or the **discrete logarithm problem**

## Public Key Cryptography

- Setting:
    - Party $A$ wants to send a message $M$ secretly to party $B$
    - Let there be a public key $K_{\text{pub}}$, and $B$ have a private key $K_{\text{priv}}$
    - Let $A$ pass encrypted message $C = \text{Enc}(M, K_{\text{pub}})$ to $B$, where $\newline M = \text{Dec}(C, K_\text{priv})$
- RSA crypto system:
    - <highlight> **RSA:**
        - Assume $M \in \mathbb{Z}^*_N$, $E \in \mathbb{Z}^*_{\varphi(N)}$, and $N = PQ$ for two distinct primes $P, Q$
        - Let $K_\text{pub} = (N, E)$ and $K_\text{priv} = E^{-1}$
        - $\text{Enc}(M, E, N) = M^E \mod N = C$
        - $\text{Dec}(C, K_\text{priv}, N) = C^{E^{-1}} \mod N= M$ </highlight>
    - Aprille sees $C, N, E$ and wants to compute $E^{-1}$
        - If can find $\varphi(N)$, this is trivial
    - ⚠️ This depends on the hardness of factoring $N$

<!-- ## Cryptography Proofs

- Maybe probability and/or other information like P v NP and PPT algorithm definition?
- Information theory

## Notes

- Generating random time complexity: depends on # of parties that are trustworthy
- Assume adversaries can see simultaneously parties’ contents
- semi-honest model (how many parties can we tolerate?) -->