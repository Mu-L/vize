# Phase 4 — Consumer Convergence (provisional decomposition)

> [!WARNING]
> Provisional; re-cut at phase-3 exit. The widest phase — expect task splits.

## TODO index

- [ ] P4-1 Fact engine query API: static demand declarations + debug undeclared-access detector (charter #8); `FactManager` with post-hoc `Preserved` sets; stratification makes demand cycles unrepresentable
- [ ] P4-2 Fact-group α/β split (serialized entry form vs in-memory index, Lean-extension style) — the α form becomes the per-SFC summary contract
- [ ] P4-3 Croquis tracker migration waves (each with declarative rule spec + naive differential evaluator): bindings → reactivity → component_usages → undefined_refs → unused → EffectGraph → ProvideInject → RaceCondition
- [ ] P4-4 Orphan productize-or-gate decisions per corpus evidence (charter #5): provide/inject pairing rules, async-race rules, or demand-gated off
- [ ] P4-5 **One virtual-language projection** on S2 replaces canon + maestro generators; single mapping model serves tsgo API, content-mapper, LSP; diagnostics become a single post-pass
- [ ] P4-6 Witness-carrying diagnostics SDK + precision tiers (`exact/sound/complete/heuristic`) + severity policy (error ⇒ proven only) (charter #21)
- [ ] P4-7 Patina markup facade re-based as zero-copy S2 view; rule engine onto fact demands
- [ ] P4-8 Rule migration waves for 345 rule files, driven by the rule-parity matrix; per-wave corpus lint-agreement gates; SFC/JSX convergence tracked
- [ ] P4-9 Complexity fact group + rules (template CFG, cross-file attribution) growing out of curator
- [ ] P4-10 App-level fact providers: Vue Router typed params, `definePageMeta`, route trees (maestro `ecosystem` generalized); provider contract shape decided here
- [ ] P4-11 HTML conformance facts: content model per file + **composed cross-component checks** via the render-tree facts
- [ ] P4-12 Glyph reimplementation on S1 with blank-slate style discussion → style spec → fixtures (charter #41); four corpus properties as invariant gates; churn report
- [ ] P4-13 Musea art parser onto S0/S1
- [ ] P4-14 rustc/Elm-grade diagnostic rendering + witness-derived "why" + i18n across all diagnostics (charter #42)
- [ ] P4-15 Seeded-defect recall expanded to the full in-domain defect-class matrix; suppression telemetry over the whole corpus; FP/FN ledgers zeroed
- [ ] P4-16 JS plugin SDK spike (charter #29 scope; API-shape open question resolved here)
- [ ] P4-17 Phase exit: check parity; lint agreement; Glyph properties; every fact group ≥1 consumer or gated; rule-parity convergence; two virtual-TS generators deleted

Key acceptance themes: the 26/345 fact-adoption number is the metric this
phase exists to move; canon's dual diagnostic paths and maestro's parallel
mapping model are deletions, not migrations.
