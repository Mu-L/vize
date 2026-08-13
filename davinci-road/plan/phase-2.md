# Phase 2 — Disegno and the Pass Manager (provisional decomposition)

> [!WARNING]
> Provisional: task cuts here will be re-reviewed when phase 1 lands. IDs are
> stable; scopes may split.

## TODO index

- [ ] P2-1 `vize_davinci` core crate (no_std: Span, NodeId, side tables, diagnostics channel)
- [ ] P2-2 Pass manager (const pipelines; fusable/barrier; mandatory/optional; raw→canonical machinery)
- [ ] P2-3 `PassObserver` (timing JSON, folio printing, budget enforcement, fusion-group reporting)
- [ ] P2-4 `#[derive(Folio)]` + normalization printer/parser; `davinci-opt` runs pipelines
- [ ] P2-5 `vize_disegno` S2 type family (ops, regions, `ExprRef` incl. `Foreign` type, `ui.model` contract op)
- [ ] P2-6 S2 verifier v1 (local checks only; runs between passes in debug/CI)
- [ ] P2-7 S1 Vue surface tree (lossless; `Unexpected`/`Missing` nodes; `render==source` verifier)
- [ ] P2-8 S1→S2 Vue lowering (hygiene scope-tags for synthesized identifiers)
- [ ] P2-9 Core transforms as S2 passes (if/for regions, slots, text/interp normalization)
- [ ] P2-10 Style `v-bind()` as S2 ops (charter #13)
- [ ] P2-11 DOM backend lowers from S2 behind in-phase flag; codegen nodes leave the surface AST
- [ ] P2-12 Fused build path (parse→S2 capability; S1 materialization on demand) + walk-count instrumentation
- [ ] P2-13 `--folio-after-change`, crash reproducer (`vize repro`), pass timing in CI
- [ ] P2-14 wasm32-wasip2 + no_std CI lanes for new crates
- [ ] P2-15 Metamorphic suite v1 over S2 folios
- [ ] P2-16 JSX lowering re-targets S2 (parity with existing atelier_jsx behavior)
- [ ] P2-17 IR contract review milestone (redundancy/folding/escape-variant checklist) — review point
- [ ] P2-18 Spolvero feed v1: observer → folio directory; inspector renders S1/S2 pages
- [ ] P2-19 DevTool protocol spike (charter open question)
- [ ] P2-20 Phase exit: DOM parity, traversal budget ≤ baseline, old DOM lane deleted

Key acceptance themes (full criteria written at task pickup): corpus DOM
byte-parity throughout; every new crate `no_std + alloc` with node-size
asserts and folio round-trip from birth; traversal-count measured against the
P0 baseline; verifier + metamorphic suites green before the old lane deletes.
