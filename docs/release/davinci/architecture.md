# Davinci — Architecture

> [!NOTE]
> This is the design-phase architecture. Names of stages and crates are
> provisional (see [Open Questions](./open-questions.md#naming)). The decided
> positions it implements are recorded in the [charter](./README.md#decided-positions).

## What we take from MLIR, and what we refuse

**Taken as philosophy:**

- **Progressive lowering** — several IRs, each optimized for what its consumers
  ask of it, connected by explicit lowering passes. Never one tree that mutates
  itself into its own output.
- **Dialect coexistence** — do not force premature unification. A normalized core
  (`ui.if`, `ui.for`, `ui.element`) can carry framework-specific operations
  (`vue.custom_directive`, vue2 filters) alongside it, lowered later or passed
  through to a consumer that understands them.
- **Verification** — each stage has an invariant checker that runs between passes
  in debug builds and in fixtures, never in release hot paths.
- **Textual round-trip for testing** — every stage dumps to a stable, readable
  text format so fixtures and snapshots can pin any intermediate step, not just
  final output.

**Refused as machinery:** the uniform `Operation` structure, dynamic dialect
registries, and runtime-extensible type systems. In Rust those cost memory
locality, branch prediction, and type safety on every hot loop, and they fight
the workspace's clippy discipline. Each stage is a concrete typed enum.

## Stage model

```
S0  Source model      container + spans + arena
S1  Surface trees     lossless per-dialect syntax (what the author wrote)
S2  Semantic IR       normalized, input-neutral UI semantics (what it means)
S3  Reactivity IR     static/dynamic partition, effects (how it updates)
S4  Emission          structured emitters per target (what we produce)
```

### S0 — Source model

The container layer: SFC descriptor, block boundaries, one **span coordinate
system** (`Span { start: u32, end: u32 }`, byte offsets into the authored file),
and **one arena per compile**. The arena is `oxc_allocator` (bumpalo underneath),
shared by template structures and oxc JS ASTs so both live under the same
lifetime `'a`. Strings are `&'a str` slices of the source or arena-interned
atoms — no owned strings in nodes, which also deletes the manual-`Drop`
stack-overflow class entirely. Line/column exist only at diagnostic-rendering
time, derived from offsets.

### S1 — Surface trees (input dialects)

One lossless syntax tree per input dialect: Vue template, oxc program for
script/JSX, pug. Lossless means the formatter and lint autofixes can be written
against S1 without a private re-scan — this is what retires the `vize_glyph`
byte scanner and the `vize_musea` hand parser. Vue 2 is an S1/S2 dialect using
the existing `legacy` capability model (resolve once per file, feature-gated,
zero cost when off).

### S2 — Disegno, the semantic IR (the pivot; crate `vize_disegno`)

The normalized, input-neutral representation of UI semantics, and the **primary
consumer surface**: element/component/text/interpolation nodes, structured
control flow (`if`/`for` as regions, not directive attributes), normalized slots,
normalized bindings (`bind`/`on`/`model` semantics rather than `v-bind`/`v-on`
spellings), with semantic facts attached via side tables (the
[Semantic Engine](./semantic-engine.md)). JSX `<Show>`-style patterns, `v-if`,
and pug conditionals all normalize to the same ops. Framework-specific
constructs that must survive (custom directives, vue2 filters) ride along as
dialect ops.

**The neutral core is a fair abstraction, not Vue's AST renamed.** Vue lowers
into it exactly the way JSX or an external dialect does; whatever is genuinely
Vue-specific stays a `vue.*` dialect op instead of shaping the core. The litmus
test: a lint rule written against the neutral core runs unchanged on SFC and on
JSX — and on Svelte/Solid through the input-dialect contract — wherever the
underlying semantics exist. Today fails that test: Patina's SFC rule corpus is
rich (345 rule files) while JSX gets a migrated subset, and the JSX hot path
deliberately bypasses the JSX→Relief lowering (`MarkupDocument::from_jsx`)
because Relief is Vue-shaped. Lowering *into a Vue-shaped tree* is the wrong
fix; a genuinely neutral S2 is the right one.

S2 also crosses SFC block boundaries where semantics do: `v-bind()` in CSS
appears as S2 binding ops, so the linter, the reactivity lattice, and the
type-check projection see style-block references instead of leaving them a
descriptor-level blind spot.

Consumers: the linter (Patina's markup facade becomes a zero-copy view over S2,
and the rule engine targets the neutral core), virtual-language projection for
type checking, Musea, Doctor, and LSP features.

### Expression dialects

Because expression languages are themselves pluggable (decision 4 — MoonBit,
Elixir-hosted expressions), S2 does not hard-wire expressions to oxc:

```rust
enum ExprRef<'a> {
    /// Fast path: JS/TS parsed by oxc into the shared arena. In-tree default.
    Js(&'a oxc_ast::ast::Expression<'a>),
    /// Foreign expression dialects, feature-gated like `legacy`.
    Foreign(&'a ForeignExpr<'a>), // dialect id + source slice + span + side tables
}
```

Every expression dialect implements one capability contract, resolved per file,
never dyn-dispatched per node: enumerate referenced bindings (drives scope
analysis, patch flags, effect dependencies), classify static/const-ness, map
spans, and emit for a given target. For JS these are direct oxc AST walks — the
fast/slow byte-scanner split disappears because the parsed AST is simply kept.

Type checking generalizes the same way: canon's virtual TS becomes the JS
instance of a general **virtual host-language projection** — an S4 target that
emits checkable code plus span links for any expression dialect (virtual MoonBit
for MoonBit expressions, delegated to the host toolchain the way TS is delegated
to Corsa today). **Decided:** this projection duty is part of the
expression-dialect contract itself, not an optional extra — a dialect that
cannot emit a checkable projection with span links only qualifies for
boundary-typed (opaque) integration.

The projection's span-link data is designed for three consumers at once: the
Corsa/tsgo API surface (native project sessions), the existing
**content-mapper protocol** (`vize content-mapper`, the tsserver-plugin-style
host interface), and Maestro's editor features. One mapping model, three
transports — this is what retires the current canon/maestro mapping split.

### S3 — Impeto, the reactivity IR (crate `vize_impeto`)

Named for Leonardo's concept of impetus — how motion propagates. The
generalization of today's Vapor IR: flat, id-based operations
(`SetText`/`SetProp`/`InsertNode`/…), static template partition, effect grouping
by dependency set, and hoist/cache decisions as explicit operations rather than
codegen-time inference. The partition derives from the semantic engine's
[reactivity lattice](./semantic-engine.md#the-reactivity-lattice--one-analysis-every-backend),
computed once and serving all three backends. **Decided routing:** DOM and
Vapor lower through S3 — patch flags and effect grouping are both "reactivity
decisions" and belong in one place — while SSR, which has no update phase,
takes a thin S2→S4 path and reads the static partition as semantic-engine
facts. Phase 3 measurements retain veto power over this split.

### S4 — Emission (output targets)

A structured emitter layer replaces string-append codegen: targets build a span-
carrying document, and source maps fall out of emission for **every** target —
DOM, SSR, and Vapor alike — replacing the text-matching recovery in
`vize_atelier_sfc/src/source_map.rs`. Targets are: VDOM JS, Vapor JS, SSR JS,
virtual TS / virtual host-language projections, `.d.ts`, and non-JS host targets
(the Volt/Elixir pattern) through the same contract.

## Stages are contracts, passes are execution plans

The stage model is **logical**. S0–S4 define data contracts, dump formats, and
consumer surfaces; they do not mandate five traversals. Passes declare
themselves **fusable** (single-visit, local, synthesized-attribute style) or
**barrier** (needs whole-tree or fixpoint facts), and the pass manager fuses
adjacent fusable passes into one walk. Physical plans then differ per product:

- **`vize build` fuses aggressively.** Parsing can emit S2 directly — S1 is a
  *capability*, materialized only when a consumer needs losslessness (the
  formatter, lint autofix). Cheap semantic facts are computed as synthesized
  attributes during lowering; emission runs as the exit action of the final
  walk where the target allows. The budget is explicit: the fused compile path
  must not walk the tree more times than today's pipeline — which is already
  parse + transform + hoist + codegen plus 20+ per-expression re-parses, and
  for Vapor an additional discarded transform and re-lower. Multi-stage IR done
  right *reduces* traversals here; it does not add them.
- **`vize check`, lint, and the LSP materialize.** They query S2 and fact
  tables repeatedly and incrementally, so artifact caching (phase 5) dominates,
  not traversal count.

Region-structured control flow in S2 is what makes fusion tractable: today's
enter/exit sibling-mutation dance (merging `v-else` branches on the parent's
child list) forces the re-visits that a region-owning `ui.if` op never needs.

## Shared infrastructure (what stages have in common)

- **Pass manager** — each product (compile-dom, compile-vapor, compile-ssr,
  lint, typecheck-projection, format) is a declared pipeline of statically-known
  passes, each marked fusable or barrier as above. Debug builds interleave stage
  verifiers; `profile!` spans wrap each pass automatically. No registry of
  trait objects; pipelines are const data.
- **Folio dumps** — the textual format for every stage, named after the folios
  of Leonardo's manuscripts (the existing croquis "VIR" debug dump is absorbed
  as the croquis folio, with a deprecation alias in the inspector payload).
  Snapshot tests pin any stage; the Compiler Inspector and the
  [DevTool](./devtool.md) render the same dumps.
- **One diagnostics channel** — diagnostics carry a `Span`, a stage of origin,
  and structured parts; all rendering (CLI, LSP, JSON, corpus reports) consumes
  the same finished `Vec<Diagnostic>`. This structurally removes the
  two-independent-assembly-paths failure mode in canon.
- **Node ids + side tables** — cross-stage references and analysis results are
  `NodeId`-keyed tables, not fat nodes and not raw `*mut` traversal.
- **Stage artifact keys** — every stage output has a content-derived identity
  (Doctor's `cache_identity` pattern, promoted), at SFC-block granularity. This
  is the substrate #698 (block-level virtual TS reuse) and #699 (session reuse)
  are waiting for, and what lets Maestro stop re-parsing per request.
- **Two-tier incrementality (decided)** — resident processes (Maestro,
  `check-server`, watch modes) run stages as **salsa** queries keyed by the
  stage artifact identities; one-shot CLI runs (`build`, `fmt`, `lint`) use the
  fused non-salsa pipeline. Same stage contracts, two execution modes — the
  rust-analyzer/rustc precedent. The salsa tier carries explicit memory bounds
  (interning + LRU) so it never reproduces the "language server ate my RAM"
  failure mode.

## Extension contracts (decision 1)

Three narrow, published contracts; in-tree implementations are Vue-family only:

| Contract | Plugs in at | In-tree | External (examples) |
| -------- | ----------- | ------- | ------------------- |
| Input dialect | S1 parser + S1→S2 lowering | Vue 3, Vue 2 (`legacy`), SFC, JSX, pug | Svelte, Solid, Astro |
| Expression dialect | S2 `ExprRef` capability set | JS/TS (oxc) | MoonBit, Elixir-hosted |
| Output target | S3/S2 → S4 emitter | VDOM, Vapor, SSR, virtual TS, `.d.ts` | Volt (Elixir), other hosts |

Contract stability follows the `vize_marquette` precedent: versioned,
deterministic serialization at the boundary, compatibility classified as
additive vs breaking. **Decided linking model — two tiers:** first-party
dialects (Vue family, pug) are compiled in behind Rust traits and cargo
features (the `legacy` pattern: zero cost when off, no dynamic dispatch);
external dialects attach out-of-process over the serialized contract, which
sidesteps Rust ABI instability and keeps "in-tree is Vue-only" honest.

## Performance guardrails

Non-negotiable, inherited from "Be Fast Above All":

1. **No dyn dispatch in per-node hot loops.** Dialect and pass dispatch happen
   per file or per pipeline, never per node.
2. **One arena, zero re-parses.** An expression is parsed exactly once per
   compile; keeping the AST must be cheaper than today's parse-copy-reparse.
3. **Spans are two u32s.** No owned strings, no eagerly-computed line/column.
4. **Every phase holds the budget.** The end-to-end benchmark envelope
   (15k SFC ≈ 330ms compile) is a merge gate, and phase 0 adds the per-crate
   microbenches the pipeline currently lacks so regressions localize.
5. **Verification never ships.** Stage verifiers are debug/fixture-only.
6. **Traversal count is budgeted.** The fused compile path must not exceed the
   current pipeline's number of tree walks; phase-0 microbenches make fusion
   regressions localizable.
7. **Resource budgets, not just throughput budgets.** The anti-goals are named:
   the "rust-analyzer is too heavy" and "cargo build is too slow" failure
   modes. Resident processes carry CI-tracked ceilings for RSS, cold-start
   time, keystroke latency, and idle CPU (an idle server burns ~zero); one-shot
   commands carry cold-run wall/RSS budgets. Fast, stable, and economical are
   one requirement, not three.
8. **Distribution size is budgeted too.** Native binary, wasm blob, and npm
   package sizes are CI-tracked with ceilings. Feature gating (the `legacy`
   pattern) and the two-tier contract model (external dialects never compiled
   in) are what keep the default artifact lean.

## Portability: `no_std` core, WASI as a first-class target

Davinci-owned crates (`vize_davinci`, `vize_disegno`, `vize_impeto`) are
written `no_std + alloc` from birth: stage data, passes, and emitters depend on
the arena and core types only, with `std` gated to the edges (filesystem,
threads/rayon, process spawning, clocks). CI builds the core for
`wasm32-wasip2` alongside native targets. This is what "runs everywhere" means
concretely: browsers and the playground via wasm, edge runtimes, and embedding
inside non-JS hosts (an Elixir NIF, a MoonBit host) without dragging a
platform layer along. Existing dependencies (oxc, lightningcss) set the
practical boundary — where they require `std`, the seam is documented rather
than fought (see [Open Questions](./open-questions.md)).

## Observability: Folio, the DevTool, and the AI optimization loop

Three layers share one data model:

1. **Folio dumps** carry *what* each stage holds; every op records provenance
   (which pass produced it, from which source span).
2. **Source-level profiling** — `vize_carton::profiler` is extended so `profile!`
   spans attribute cost to pass × stage × file/block × source span, exported in
   a stable machine-readable schema (the `vize_doctor::ai_context` precedent:
   budgeted, vendor-neutral payloads).
3. **The [DevTool](./devtool.md)** renders both live: stage-by-stage lowering,
   pass-by-pass diffs, fact tables, the reactivity lattice, and per-pass flame
   views.

The same artifacts close the **AI optimization loop**: profiles and Folio
diffs are structured input an agent can consume, and the corpus + benchmark +
budget gates are the oracle that verifies any AI-proposed optimization. Human
or AI, the gate is the same — optimization becomes a loop that can run
unattended without lowering the bar.

## Fit with workspace culture

New crates start at the `experimental` stability tier and obey the existing
discipline: `vize_carton` string/collection types (clippy bans), the 350-line
source guard, fixtures-first change classes from
`docs/content/architecture/language-engineering-practices.md`, and snapshot
diffs as reviewed contracts — which the Folio dumps are designed to serve.
