# Davinci — Next-Generation Compiler Infrastructure

> [!WARNING]
> Davinci is a **rearchitecture program in its design phase**. Nothing on these pages
> is implemented, scheduled, or promised. These documents exist so the intended shape
> of the next-generation infrastructure is written down and reviewable before any
> code moves. Every decision recorded here may be revisited.

Davinci is the project name — and the name of the resulting infrastructure — for
rearchitecting Vize's compiler core around a **multi-stage IR**, in the spirit of
MLIR: many inputs, many outputs, one shared, progressively-lowered representation
in the middle, with no performance regression at any step.

- **Inputs (planned surface)** — Vue 3 SFC, Vue 2 (existing `legacy` dialect),
  JSX/TSX, alternate template languages (pug), and foreign expression languages
  (MoonBit and others) through a published dialect contract.
- **Outputs (planned surface)** — VDOM / Vapor / SSR JavaScript, virtual TypeScript
  for type checking, `.d.ts`, lint-facing semantic views, formatter-facing surface
  trees, and non-JS host targets (the Volt/Elixir pattern) through a published
  target contract.

## Why now

The current pipeline has one shared parse AST (`vize_relief`) and no shared IR
after it. The costs are concrete and measured, not hypothetical: template
expressions are re-parsed by oxc dozens of times per compile into throwaway
arenas, the Vapor backend runs the entire VDOM transform and then discards it,
three independent parsers read the same `.vue` text, and two independent virtual
TypeScript generators disagree about source mapping. The full evidence list, with
file paths, is in [Motivation](./motivation.md).

Davinci is therefore **also a performance project**. The rearchitecture removes
work the current design forces us to repeat, so "Be Fast Above All"
(`ubugeeei-redundancy.md`) is an argument for it, not against it.

## Decided positions

Recorded 2026-08-13 after design review. Revisit requires a written entry in
[Open Questions](./open-questions.md) explaining what changed.

| # | Decision | Position |
| - | -------- | -------- |
| 1 | Framework scope | Dialect boundaries are designed as **public extension contracts**; in-tree implementations stay **Vue-family only** (v2, v3, SFC, JSX, pug). Svelte/Solid/host-language integrations live outside this repository, plugging into the contracts. Keeps `ubugeeei-redundancy.md` scope intact. |
| 2 | IR representation | **Typed dialects** — each stage is a concrete Rust enum with its own type family. What is shared across stages is *infrastructure* (spans, node ids, pass manager, diagnostics, textual dumps), never a uniform dynamic `Operation` structure. MLIR is borrowed as philosophy, not machinery. |
| 3 | Migration strategy | **Strangler with corpus gates.** New foundation crates are introduced and existing surfaces move over one at a time. Every phase must pass the 134-project real-project corpus parity checks and hold the end-to-end benchmark budget before it merges. No long-lived parallel pipeline, no big-bang switch. |
| 4 | "non-JS" meaning | All three readings are in scope as extension points: alternate template languages at the surface stage, non-JS host ecosystems at the container/emit stages, and **foreign expression languages (e.g. MoonBit) inside templates** at the semantic stage. The last one shapes the expression representation: see [Architecture](./architecture.md#expression-dialects). |
| 5 | Semantic engine | Analyses become **demand-driven facts behind one query API** — the [Semantic Engine](./semantic-engine.md) — read by every consumer: Vapor **and** VDOM **and** SSR compilation, lint, type checking, LSP, Doctor. A fact group with no consumer is demand-gated off, not computed. Croquis's trackers become the population passes. |
| 6 | Stages vs passes | **Stages are contracts, passes are execution plans.** The pass manager fuses single-visit passes; the compile path's traversal count must not exceed the pre-Davinci pipeline's. Materialization is per-product: `build` fuses, lint/check/LSP materialize and cache. |
| 7 | Fair-abstraction S2 | The S2 neutral core is **not Vue-shaped**; Vue lowers into it like any dialect. The lint rule engine targets the neutral core so one rule corpus serves SFC and JSX at parity — and transfers to Svelte/Solid through the input-dialect contract. |
| 8 | Fact API | **Static demand declarations** with a debug-build detector for undeclared access. Consumers declare fact groups as const data; runs compute exactly the demanded union. |
| 9 | S3 routing | **DOM and Vapor lower through S3 Impeto; SSR takes a thin S2→S4 path** reading the static partition as facts. Phase 3 measurements keep veto power. |
| 10 | Incrementality | **salsa, resident tier only**: Maestro / check-server / watch run stages as salsa queries with explicit memory bounds; one-shot CLI stays on the fused non-salsa pipeline (rust-analyzer/rustc two-tier precedent). Stage artifact keys are the shared identity. |
| 11 | Naming | S2 = **Disegno** (`vize_disegno`), S3 = **Impeto** (`vize_impeto`), shared infra = **vize_davinci**, textual dumps = **Folio** (Codex was rejected for its AI-product name collision). The croquis "VIR" dump is absorbed as the croquis folio with a deprecation alias. Croquis survives as the semantic engine's name. |
| 12 | pug | **First-class S1 dialect** — compile, lint, format, and type-check all flow through the same lanes. |
| 13 | Style bindings | `v-bind()` in CSS is **visible as S2 ops** — lint, the reactivity lattice, and projections see style-block references. |
| 14 | Foreign-expression type checking | The **virtual host-language projection (emit + span links) is part of the expression-dialect contract**; dialects that cannot provide it get boundary-typed integration only. Projection data serves the tsgo/Corsa API, the content-mapper protocol, and Maestro from one mapping model. |
| 15 | Contract linking | **Two tiers**: first-party dialects compiled in behind traits + cargo features (zero-cost `legacy` pattern); external dialects over the serialized contract, transported via the **WASM component model (WIT)** with coarse-grained interfaces — hostable out-of-process or in-process under wasmtime. |
| 16 | DevTool | A **compiler DevTool is a first-class product** ([devtool.md](./devtool.md)): stage ladder, pass timeline with Folio diffs, provenance, fact browser, decision remarks, flame views — rendered from the same artifacts tests and AI consume. |
| 17 | Deep analysis products | The semantic engine ships **complexity metrics over real template CFGs (crossing file boundaries via the component graph)**, **app-level facts** (Vue Router typed params, `definePageMeta`, route trees), and **HTML conformance including cross-component content-model checks**. |
| 18 | Portability | Davinci-owned crates are **`no_std + alloc` from birth**; `wasm32-wasip2` is a CI target. `std` is gated to the edges (fs, threads, process). |
| 19 | Performance & footprint | Beyond throughput: **CI-tracked ceilings for RSS, cold start, keystroke latency, idle CPU, and distribution size** (native / wasm / npm). The named anti-goals: rust-analyzer-style heaviness, cargo-style slowness. |
| 20 | Editor neutrality | **Strict LSP conformance** — full function on Neovim, Helix, Zed, Emacs, not just VS Code; conformance and multi-client smoke tests gate the LSP phase. |
| 21 | Assurance creed | **Never fail; edge cases must not exist; every conceivable pattern is tested; tests are strict — nothing passes on partial matching.** Translated into mechanism in [assurance.md](./assurance.md): impossibility by construction, elimination by enumeration (construct matrices, property/metamorphic/differential tiers), exact-equality-only oracles with a mechanically enforced banned-assertion list, oracle-truth review, and mutation testing as the measure of strictness. |

## Documents

| Document | Contents |
| -------- | -------- |
| [Motivation](./motivation.md) | Current-state fault lines with file-path evidence, and the existing assets Davinci builds on |
| [Architecture](./architecture.md) | The stage model (S0–S4), stage fusion, shared infrastructure, dialect and target contracts, performance guardrails |
| [Semantic Engine](./semantic-engine.md) | The analyzer pillar: measured Croquis underuse, the fact/query design, the reactivity lattice serving Vapor and non-Vapor alike, app-level facts, complexity and HTML-conformance products |
| [DevTool](./devtool.md) | The observability surface: stage ladder, pass timeline, provenance, fact browser, decision remarks, flame views |
| [Assurance](./assurance.md) | The quality doctrine: impossibility by construction, input-space enumeration, the test tier ladder, strict oracles, mutation-tested tests |
| [Roadmap](./roadmap.md) | Phases, exit gates, and risks |
| [Prior Art](./prior-art.md) | Practices imported from rustc/MIR/Polonius/salsa, LLVM/MLIR, Swift (SwiftSyntax/SIL/macros), GHC (Core Lint/interface files), OCaml Flambda2, Lean 4, React Compiler, MoonBit, Unison, Effekt, and recent PL research — with anti-lessons |
| [Open Questions](./open-questions.md) | Active design discussions not yet decided |

## Relationship to the mission

`ubugeeei-redundancy.md` requires: performance as a product requirement, Vue
toolchain scope, "clear data ownership, explicit phases, narrow contracts,
deterministic behavior, testable outputs", and VoidZero assets as infrastructure.
Davinci is the structural answer to the third requirement — explicit phases and
narrow contracts *are* the multi-stage IR — while decision 1 preserves the second
and the performance gates in the roadmap enforce the first.
