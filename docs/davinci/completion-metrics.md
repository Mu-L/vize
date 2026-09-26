# Davinci completion metrics — review input

Snapshot: 2026-09-26. Repository inventory base:
[`aac2e1bf8bf2796870ac5145067a981e6cacf588`](https://github.com/ubugeeei-prod/vize/tree/aac2e1bf8bf2796870ac5145067a981e6cacf588).
Measurements below name their own revisions; they do not describe an unselected
release candidate. P6-10 remains open: its P5-14 start gate and the finished-substrate
review have not passed. This is the collected input to that review.

## Target authority

[Charter #35](./README.md#decided-positions) requires improved compile throughput
and peak memory, halved keystroke-to-diagnostics p95, fact adoption beyond the
neutral-core majority, source maps on every backend, and matrices without orphans.
[Budgets](./plan/budgets.toml) own the pinned measurements and ratchets.
A passing regression ceiling alone does not establish an improvement target.
Unrecorded measurements remain unrecorded; no target is changed here.

## Reconciliation

| Metric                             | Pinned target or baseline                                                                                                                   | Recorded achievement and scope                                                                                                                                                                                                                                                                                                               | Review status / blocker                                                                                                                                                                                                                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Compile throughput                 | Improve the phase-0 baseline; compile envelope `329.2 ms`, cold median, five runs, 15k SFCs, Blacksmith 32 vCPU, 5% regression tolerance    | [Envelope definition](./plan/budgets.toml); the committed [tool report](../../tools/benchmarks/results/tool-benchmark-latest.json) instead measures 3,000 SFCs at `f9cc50ee2e2ff14cd120241cd87a0162446df65b` ([run 35072615669](https://github.com/ubugeeei-prod/vize/actions/runs/35072615669)), so it is not a replacement 15k measurement | **Unmeasured on the completed substrate.** P3-6 needs repeatable reference-runner native/retained comparisons and a pinned promotion threshold; the [benchmark record](./plan/phase-3-records/p3-6-benchmark.md) explains remaining comparisons. `wall_p50_ns = 0` entries remain report-only, not successes. |
| Compiler peak memory               | Improve peak memory; `[allocation_peak]` pins deterministic stage-window bytes while per-bench `rss_peak_bytes` remains report-only         | [Budget definitions](./plan/budgets.toml) distinguish live allocator bytes from process RSS; [Vapor allocation recovery](./plan/phase-3-records/p3-6-emission-allocations.md) records allocation calls, not a full compile peak-RSS result                                                                                                   | **Final improvement unmeasured.** Preserve the original windows and obtain a comparable compiler peak-memory result on the finished substrate. Resident RSS and allocation-call reductions cannot substitute for this metric.                                                                                 |
| Peak resident memory               | Improve the baseline; nine-file TS-44 baseline `292.3 MiB`, ceiling `337 MiB`                                                               | `288.8 MiB` maximum of three runs; same nine-file LSP/Corsa fixture and sampler, [R1 below](#r1--production-lsp-resource-measurement)                                                                                                                                                                                                        | **Nine-file ceiling met; broader completion unproven.** P5-11b still needs both largest corpus projects and its agreed comparable before/after evidence.                                                                                                                                                      |
| Keystroke → diagnostics p95        | Halve the P5-11a baseline `30.1 ms`; the existing regression ceiling is `46 ms`                                                             | `31.1 ms`, nearest-rank p95 of 60 exact-version TS 2322 edits, [R1](#r1--production-lsp-resource-measurement)                                                                                                                                                                                                                                | **Halving target missed in this fixture.** Half of the recorded baseline is `15.05 ms`; this arithmetic is the target, not an estimated result. P5-11b large-project measurements and latency remediation remain open.                                                                                        |
| Linter fact adoption               | Charter starting point `26/345`; neutral-core majority required                                                                             | Base [rule-parity inventory](./plan/rule-parity.md): 249 rules, 91 neutral-core candidates, 23 Croquis readers, 40 markup-facade rules                                                                                                                                                                                                       | **Majority not established.** Croquis reads and markup-facade membership are different from declared fact consumption; the old 345-rule denominator cannot be silently replaced. P4-3/P4-7/P4-15 and TS-35 need a reconciled fact-consumer numerator and neutral-core denominator.                            |
| Source maps                        | All three backends; static-template coverage ≥95%, rewritten identifiers / boundaries 100%, accuracy 100%; frozen legacy SFC floor retained | Committed [TS-31 report](./plan/ts31-sourcemap-coverage.json): DOM and Vapor `35/35`, `13/13`, `11/11`; SSR `35/35`, `11/11`, `11/11`; SFC recovery `11/11`, rewritten statements `19/19`, all exact                                                                                                                                         | **Recorded battery meets every pinned row.** This is the committed battery, not all authored tokens in the corpus. Run TS-31 again on the final candidate; new native shapes need their own exact mapping proofs. [P3-9 record](./plan/phase-3-records/p3-9.md).                                              |
| Consumption / rule-parity matrices | Every computed group has ≥1 consumer or an explicit gate; no orphan rule or undeclared access                                               | [Croquis shards](./plan/croquis-consumption.md), [rule matrix](./plan/rule-parity.md), [migration shards](./plan/consumer-migration-surfaces.md); rule registry reports `0 unregistered`, with six Musea rules explicitly outside SFC/JSX                                                                                                    | **Partial mechanical evidence.** TS-12 source staleness is enforced, but TS-34/35/46 still need final production demand-graph and adoption reconciliation. Croquis product-use totals include test code and cannot establish production fact coverage.                                                        |

## R1 — Production LSP resource measurement

The successful [TS-44 job 108388832282](https://github.com/ubugeeei-prod/vize/actions/runs/36236392245/job/108388832282)
ran at measurement head
`e1bee278790a2d78742d21f5000fb8c3b3932131`, containing the production
resident implementation revision `56a65d3d314975ea29aa66f4f0f8cd942d67b8d0`. It used the existing
`linux-x64-ci` preset, three fresh `ci-opt` servers, twenty edits each and
a sixty-second idle window. Server, Corsa and tsgo RSS were sampled together
every 50 ms. The workload is the nine-file TS-45 `real-vue` fixture.

| Metric                    |    Result | Unchanged ceiling |
| ------------------------- | --------: | ----------------: |
| Cold start, median        |    4.9 ms |              9 ms |
| First diagnostics, median | 1118.0 ms |           1398 ms |
| Keystroke p95             |   31.1 ms |             46 ms |
| Peak process-tree RSS     | 288.8 MiB |           337 MiB |
| Idle process-tree RSS     | 276.6 MiB |           316 MiB |
| Idle CPU, maximum         |     0.15% |                1% |
| Server binary size        |  46.7 MiB |            59 MiB |

[Committed raw samples](./plan/completion-metrics/r1-resource-linux-x64-ci.json)
preserve the measurement after artifact expiry. Their source is the
[`resource-linux-x64-ci` artifact](https://github.com/ubugeeei-prod/vize/actions/runs/36236392245/artifacts/10903579774)
(artifact ID `10903579774`). The original method and baseline
remain in [P5-11a](./plan/phase-5-records/p5-11a.md).

The same workflow's
[synthetic resident job](https://github.com/ubugeeei-prod/vize/actions/runs/36236392245/job/108388832528)
passed its 10k-input probe. Its
[`resident-resource-linux-x64-ci` artifact](https://github.com/ubugeeei-prod/vize/actions/runs/36236392245/artifacts/10903969071)
is separate evidence: fixture alpha inputs, isolated resident database, ten-second
idle, no LSP/Corsa. See [P5-4b progress](./plan/phase-5-records/p5-4b-progress.md).

An additional production 10k-open-SFC process-tree job in that run is a wider,
record-only measurement. No preset is pinned for that workload. It cannot borrow
the nine-file ceiling or establish the largest-project/halving acceptance.

## Review still required

- P5-14 must pass before the P6-10 finished-substrate review.
- Record comparable compile and large-project resource results, explaining each
  miss without changing the targets.
- Reconcile fact consumption with the historical adoption definition and current
  rule identities; preserve explicit gates for intentional non-consumers.
- Refresh source-map and matrix evidence at the final candidate SHA.
- Record the maintainer's review separately. No reviewer acceptance or v1 decision
  is recorded by this input package.

The [v1 evidence package](../release/davinci-v1-evidence.md) maps these inputs to
the release checklist and preserves its remaining blockers.
