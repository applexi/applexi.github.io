---
title: "MARAGE: Multi-Agent RAG Hallucination Mitigation"
description: A multi-agent pipeline that grounds its reviewer agent in a local medical corpus.
github: https://github.com/applexi/MultiAgent-Hallucination
paper: /marage.pdf
tags: ["Technical Project", "Python", "Machine Learning", "LLMs", "RAG"]
order: 2
draft: false
---

Multi-agent pipelines reduce hallucination by passing a response through successive
reviewer agents, but the pipeline we started from ([Gosmar and Dahl](https://arxiv.org/abs/2501.13946)) only ever consult what the model already knows. That caps them at catching errors the model recognizes as
errors. MARAGE replaces the second-stage reviewer with a retrieval-augmented agent grounded in an outside corpus.

![The MARAGE pipeline: a frontend agent's response is routed by a medical classifier,
either through a query builder and top-k MedRAG retrieval to a grounded second reviewer,
or straight to the original second reviewer; both paths converge at a third reviewer and
a KPI evaluator.](../../assets/marage-pipeline.jpg)

_Retrieval failure has its own path: the second reviewer is told the corpus came back
empty, rather than being left to guess._

A zero-temperature classifier first decides whether a prompt is medical. If it is, a
query builder strips it down to a few keyword phrases and queries a FAISS index over
roughly 126k passages from the [MedRAG](https://arxiv.org/abs/2402.13178) textbook
corpus, and the reviewer rewrites the response constrained to what came back. If nothing clears the similarity threshold, the prompt falls through to a reviewer primed to express uncertainty, as failing to retrieve anything is itself a signal that the question may be about something that doesn't exist. Non-medical prompts follow the original reviewer path untouched.

We evaluated on 500 prompts generated to induce hallucination, half medical, using an
LLM-judged score for factuality and helpfulness plus a hand-labeled subset for ground
truth. Retrieval improved the Agent 1 to Agent 2 correction step from 10.85% to 13.11%,
and on the hand-labeled set it cut the hallucination rate from 46% to 34% and raised
factuality from 0.54 to 0.66 without costing helpfulness. The gains concentrate exactly
where the change was made, which is the result we wanted. Routing accuracy turned out to
matter as much as retrieval quality: prompts sent down the wrong path did measurably
worse than if they'd been left alone.

Two things went differently than planned. The pipeline we meant to build on was unoptimized (little to no parallelization) and its headline metric had no working implementation (the cited repository in the paper did not follow the published metric), so we reimplemented it from scratch with checkpointing, parallel execution, and replaced the metric with a rubric we could defend. We also intended to retrieve by crawling
authoritative medical sources live, the way [Tran et al.'s verification
pipeline](https://doi.org/10.1145/3709020.3734832) does, until rate limiting made that
impossible at 500 prompts; the local FAISS index was the pivot.

Everything ran on a CPU-only Mac through Ollama with a 3B-parameter model, about three
hours end to end. That constraint is also the main limitation: a small evaluator model
makes the automatic metric noisy, which is why we also included hand-labeled results.

Built with Stephanie Yang and Jiacheng Wang for CMU's Fall 2025 Generative AI course
(10-423/623).

<!--
Worth adding if you want to go deeper:
- Which parts of the system were yours specifically
- The five prompt-generation techniques, and an example of each
- What a fine-tuned routing classifier would need to beat
-->
