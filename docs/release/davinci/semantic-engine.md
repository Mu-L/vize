# Davinci — Semantic Engine

> [!NOTE]
> This page records the analyzer pillar of Davinci: one semantic fact base that
> every consumer — Vapor **and** VDOM **and** SSR compilation, lint, type
> checking, LSP, Doctor — reads through the same query surface. The ambition is
> explicit: the strongest static analyzer available for Vue code.

## The problem, measured

Croquis already computes a remarkable amount of semantics (~25 tracker products
on `crates/vize_croquis/src/croquis.rs`). Almost nobody consumes it. Verified
2026-08-13:

| Croquis product | External consumers today |
| --------------- | ------------------------ |
| `EffectGraph` | **Doctor only** (`crates/vize/src/commands/doctor/analysis.rs`). The Vapor backend — the natural consumer of fine-grained effect information — never sees it. |
| `RaceConditionTracker` | **None.** Computed, never read outside croquis. |
| `ProvideInjectTracker` | **None.** Computed, never read outside croquis. |
| `unused_bindings` | WASM analyze surface + one legacy CLI test. Not the linter. |
| `CroquisSemanticSnapshot` / `Summary` | Inspector payload only (`vize_curator`). |
| `component_usages`, `undefined_refs`, `bindings` | Real consumers (canon: 58 files; maestro IDE features; 1 patina rule). This is the healthy subset. |

Consumer-side breadth is just as lopsided:

- **Patina**: 26 of 345 rule files reference croquis (~8%). The rest re-derive
  facts locally or go without; type-aware rules bypass croquis entirely and
  spawn Corsa sessions.
- **Vapor**: imports exactly one helper (`builtins::is_global_allowed`). The
  transform lane's `TransformContext::analysis()` returns `Option<&Croquis>`,
  and the Vapor path passes `None` — the backend that most needs reactivity
  analysis consumes none of it.
- **Canon**: the deepest consumer, but it reads struct fields directly, so every
  new analysis grows the `Croquis` struct and every consumer pays for all of it
  (the `SfcCroquisOptions::{full, for_lint, for_compile, for_declaration}`
  presets are a coarse patch over eager computation).

The shape of the failure: analyses are **eagerly computed struct fields**, so
adding one taxes every caller, which pushes consumers to hand-roll locally,
which strands the central analyses without consumers.

## Design: facts, demand, one query surface

The semantic engine is the S2 side-table layer of the
[architecture](./architecture.md), promoted to a product:

1. **Facts, not fields.** Each analysis is a fact group keyed by
   `NodeId`/`SymbolId`/block artifact key — not a field on a god struct.
   Croquis's trackers become the population passes.
2. **Demand-driven.** Consumers declare the fact groups they need; nothing else
   is computed. Cheap facts (binding classification, static-ness) are
   synthesized attributes fused into lowering (see
   [stage fusion](./architecture.md#stages-are-contracts-passes-are-execution-plans));
   fixpoint analyses (effect graph, cross-file) run only when demanded, cached
   under stage artifact keys (phase 5).
3. **One typed query API.** Patina rules, canon projections, maestro features,
   Doctor, and backend lowerings all read the same interface. Corsa-derived type
   facts join the same surface, so "type-aware" stops being a separate world.
   `vize_croquis_cf` becomes the project-level fact store on the same API.
4. **A fact with no consumer is gated off, not computed.** The consumption
   matrix above becomes a tracked artifact; orphans are either productized or
   demand-gated to zero cost.

## The reactivity lattice — one analysis, every backend

The centerpiece fact group classifies every binding and expression on a
reactivity lattice (static constant → props-stable → reactive → unstable),
with effect dependency sets on top. **The same facts serve Vapor and
non-Vapor alike:**

| Consumer | Reads the lattice as |
| -------- | -------------------- |
| VDOM backend | Patch flags, static hoisting, cache decisions |
| Vapor backend | Effect grouping, direct-DOM operation planning |
| SSR backend | Static string partition |
| Patina | Reactivity rules: lost reactivity on destructure, never-reactive computed, unnecessary `ref` |
| Canon projection | Tighter virtual-code types (ref unwrapping, stability) |
| LSP | Reactivity overlay (already prototyped in `vize_vitrine`'s wasm surface) |

Today the VDOM path infers patch flags at codegen time, Vapor re-derives its
own dynamic info during lowering, and the effect graph sits unread. One
classification pass, lowered three ways, is both faster and strictly more
consistent.

## Analyses that make it "the strongest"

The moat is the combination no existing tool has: reactivity semantics ×
cross-file graph × native type information, on one base.

- **Cross-file provide/inject pairing** — `inject` with no reachable provider,
  type-mismatched injection keys. (`ProvideInjectTracker` finally earns its
  keep; eslint-plugin-vue cannot see across files, vue-tsc cannot see Vue
  semantics.)
- **Component contract checking** — props/emits/slots usage vs declaration
  across the project (`component_usages` generalized project-wide).
- **Reactivity flow** — where reactivity is lost, effects that never fire,
  writes no effect observes. (`EffectGraph`, `RaceConditionTracker`
  productized as async-setup race rules.)
- **Whole-project dead code** — unused bindings, unreferenced components,
  unreachable template branches under `v-if` constant conditions.
- **Mode advisories** — Vapor-readiness of a component (which constructs would
  block or degrade Vapor compilation), derived from the same lattice, serving
  migration between non-Vapor and Vapor.

Each lands as ordinary Patina rules / Doctor findings / Canon diagnostics —
the engine is infrastructure, the products stay where users already look.
