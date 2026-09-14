---
title: "AFLNet+: Richer State Feedback for Protocol Fuzzing"
description: Extending AFLNet so protocol states come from full server responses, not just numeric response codes.
github: https://github.com/applexi/aflnet_plus
paper: /aflnet-plus.pdf
tags: ["Technical Project", "C", "Fuzzing", "Security", "Systems"]
order: 2
draft: false
---

[AFLNet](https://thuanpv.github.io/publications/AFLNet_ICST20.pdf) is a greybox fuzzer for
network servers: it mutates recorded client–server message sequences and steers with both code
coverage and an inferred protocol state machine. Its states are just the numeric response code
(`200`, `550`, …), which collapses distinct server behaviors into one abstract state. In LightFTP,
for example, `550` can mean an unavailable file, denied permissions, resource exhaustion, an
aborted transfer, or a conflicting action.

![AFLNet architecture: captured traffic is parsed into a sequence corpus; a target state and
sequence are chosen, the middle of the sequence is mutated, and the result is sent to the
server under test; responses update the learned state machine that feeds the next
round.](../../assets/aflnet-architecture.jpg)

_AFLNet’s loop. Captured `.pcap` traffic is parsed into a seed corpus. Each round picks a
target state $s$ and a sequence $M$, mutates the middle segment that keeps the server in $s$,
and sends the result to the server. Responses (e.g. `200 OK`) update the inferred state
machine, which then guides the next target-state choice._

AFLNet+ keeps AFLNet largely unchanged and only redefines state: the full response text is
hashed and appended to the numeric code. The tradeoff under test is finer state precision
versus scheduler dilution and overhead.

## Evaluation

LightFTP in [ProFuzzBench](https://github.com/prosyslab/profuzzbench), comparing AFLnwe,
AFLNet, and AFLNet+. Four parallel fuzzers per configuration for eight hours, same seeds and
harness; metrics averaged across runs.

| Metric | AFLNet | AFLNet+ | AFLNwe |
| --- | ---: | ---: | ---: |
| cycles_done | 199.50 | 206.00 | 115.50 |
| execs_done | 296257.75 | 293697.00 | 1489667.25 |
| execs_per_sec | 10.05 | 9.77 | 51.92 |
| paths_total | 479.75 | 468.25 | 69.25 |
| paths_found | 477.75 | 466.25 | 67.25 |
| paths_favored | 44.50 | 62.75 | 42.25 |
| max_depth | 8.75 | 7.50 | 7.25 |
| stability | 52.38 | 62.34 | 77.39 |
| statement_cvg | 63.98 | 63.52 | 35.80 |
| branch_cvg | 44.27 | 43.62 | 20.70 |
| state_cvg | 23.00 | 67.75 | 0 |

| Metric | AFLNet | AFLNet+ | Diff | % Change |
| --- | ---: | ---: | ---: | ---: |
| cycles_done | 199.50 | 206.00 | +6.50 | +3.3% |
| execs_done | 296257.75 | 293697.00 | −2560.75 | −0.9% |
| execs_per_sec | 10.05 | 9.77 | −0.28 | −2.8% |
| paths_total | 479.75 | 468.25 | −11.50 | −2.4% |
| paths_found | 477.75 | 466.25 | −11.50 | −2.4% |
| paths_favored | 44.50 | 62.75 | +18.25 | +41.0% |
| max_depth | 8.75 | 7.50 | −1.25 | −14.3% |
| stability | 52.38 | 62.34 | +9.97 | +19.0% |
| statement_cvg | 63.98 | 63.52 | −0.45 | −0.7% |
| branch_cvg | 44.27 | 43.62 | −0.65 | −1.5% |
| state_cvg | 23.00 | 67.75 | +44.75 | +194.6% |

Against AFLnwe, both AFLNet variants trade throughput for far more paths and code coverage, as
in the original AFLNet paper. Against AFLNet, the richer state model mainly lifts state coverage
(~3×), favored paths (+41%), and stability (+19%), with near-flat exec throughput and only small
dips in statement/branch coverage and max depth consistent with spreading effort across a finer
state space rather than losing exploration ability.

Course project for CMU's Fall 2025 Program Analysis course (17-665).
