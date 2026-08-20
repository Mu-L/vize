# Phase 2 — Task records

> [!NOTE]
> What each landed phase-2 task actually measured, decided and left open, one
> file per task. The **contracts** are in [phase-2-tasks.md](./phase-2-tasks.md)
> and the phase-level record — the re-cut, the phase-1 carry-ins, the TODO
> index and the exit gate — is in [phase-2.md](./phase-2.md).
>
> Records are separate files for the reason the contracts split from the phase
> file: the repository's 350-line source-length budget
> (`tools/moon/cmd/source_file_lengths --max-lines 350`), which plan files are
> not exempt from. A record grows with its task, and 22 of them cannot share a
> page.

| task                                  | landed     | what it decided                                                                                                                                                   |
| ------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [P2-1](./phase-2-records/p2-1.md)     | 2026-08-19 | `NonZeroU32` node ids; sparse-only side table with the densification trigger written down; owned `'static` diagnostics                                            |
| [P2-2](./phase-2-records/p2-2.md)     | 2026-08-19 | const-data pipelines; both pass-manager laws enforced as compile errors, both proven by compiling a violation                                                     |
| [P2-3](./phase-2-records/p2-3.md)     | 2026-08-19 | the fused-group reporting law; static dispatch so the un-observed path has no check at all                                                                        |
| [P2-5b](./phase-2-records/p2-5b.md)   | 2026-08-20 | the retained-`None` decision: an `Opaque` escape variant with five pessimal laws from day one; widening deferred to P2-9's number                                 |
| [P2-6](./phase-2-records/p2-6.md)     | 2026-08-20 | local checks in one page-order walk; rigor per `PassKind`; liveness via the P1-11 stamp with `check_live` as the P2-5b seam; TS-18's 15 exact-diagnostic fixtures |
| [P2-7](./phase-2-records/p2-7.md)     | 2026-08-20 | `vize_sinopia` driven by armature's tokenizer; the three-clause hole policy; byte fidelity by cursor-partition construction                                       |
| [P2-12a](./phase-2-records/p2-12a.md) | 2026-08-19 | the pre-S2 traversal baseline, the phase-2 target, and the plan finding that corpus `--check` is not evaluable                                                    |
| [P2-13](./phase-2-records/p2-13.md)   | 2026-08-20 | the ICE policy: repro.folio + exact-equality replay via `vize repro`; dump flags real on `davinci-opt`, pinned-empty on the build path                            |
| [P2-14](./phase-2-records/p2-14.md)   | 2026-08-20 | three accepted `std` edges; TS-24 as required `clippy-and-test` steps (the check.yml ratchet); oxc measured not-`no_std`                                          |
