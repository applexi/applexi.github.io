---
title: k-of-n Replicated Secret Sharing
description: A configurable k-of-n replicated secret-sharing MPC framework in Rust, with PRNG-optimized multiplication and MSB extraction.
github: https://github.com/applexi/k-of-n-rss-mpc
tags: ["Technical Project", "Rust", "MPC", "Secret Sharing", "Cryptography"]
order: 2
draft: false
---

A configurable k-of-n replicated secret-sharing (RSS) multi-party computation (MPC) framework I built to further my own understanding. By "k-of-n", I mean that secrets can be securely shared and operated upon through n parties, such that no k - 1 set of parties learns any information about the secrets.

The repository contains the following:

- Creation/deletion of arithmetic (u16) secrets stored as variables
- MPC addition + multiplication (optimized with simulated pseudorandom number generation (PRNG))
- MPC MSB bit extraction via bit adders (optimized with local computation)

Built as part of my work at Tools for Humanity.

<!--
Worth adding if you want to go deeper:
- The exact threat model, and how the PRNG setup is distributed
- Round complexity for multiplication and MSB, and how it compares to the naive version
- Benchmarks, if you have them
-->
