---
title: FHE Parser/Executor for Large Neural Networks using Lattigo
description: A parser and executor for CKKS neural network inference, built on Lattigo.
github: https://github.com/applexi/lattigo
tags:
  [
    "Technical Project",
    "Go",
    "Python",
    "FHE",
    "Cryptography",
    "Systems",
  ]
order: 3
draft: false
---

Fully-homomorphic encryption (FHE) is a cryptographic technique that allows for operations (such as addition, multiplication, etc.) on ciphertexts without decryption. This allows for data processing without learning any "secrets", which can be incredibly useful for things like secure machine learning inference. Two major downsides are memory usage (as ciphertexts in-use need to be stored), and efficiency (compiler + operation time).

The most common FHE scheme that allows for floating point computation (which is necessary for machine learning) is CKKS. However, with the way the floats are represented, operations can quickly accumulate noise. Thus we need "bootstrapping", an expensive operation that removes accumulated noise. In this case, when we optimally bootstrap is the interesting problem.

## What I built

My main contribution was a parser and executor built on the Lattigo FHE library in Go.
It parses a neural network's inference represented as an instruction file (a directed, acyclic graph of operations and values) and evaluates it, carrying both a plaintext and a ciphertext for every operation so results can be checked against the value they should have produced. The goal was all three of correct, memory-safe, and fast, on files running to tens of thousands of operations. I also helped build the end-to-end pipeline
and ran cost-modeling experiments in Python and Go to compare placement strategies.

## Memory optimizations

An initial proof-of-concept implementation I built held the plaintext and ciphertext of every operation
for the entire run, which crashed the server on large files. Two changes fixed it. A
reference-count array tracked how many later operations still needed each value, so
anything fully consumed could be dropped much earlier. Additionally, encoding became
lazy: a child is only encoded once its parent is reached, rather than encoding everything
up front and paying for values that aren't used until much later.

Rotations were the other memory problem. Each rotation carries an offset, and CKKS needs
a distinct rotation key per offset, so an instruction file with many distinct offsets
would result in an unreasonable number of keys. Decomposing each offset into a sum of powers of two
means the executor only ever keeps a logarithmic set of keys and composes the rest.

## Speed optimization

Composing rotations from powers of two fixed the key blowup but made rotation slower,
since each offset now meant several calls. Hoisted rotations recover most of that: given
one ciphertext and a list of offsets, the shared precomputation happens once instead of
per rotation. That alone was worth more than 10% over the previous version.

Across the work, average and peak memory usage dropped by 20% and runtime by 9%.
