# Davinci — Roadmap

> [!WARNING]
> Phases are ordered, not scheduled. No calendar commitments. A phase is done
> when its exit gate passes, and every phase merges to `main` continuously —
> there is no long-lived Davinci branch (decision 3: strangler with corpus
> gates).

## Standing gates (every phase)

- **Corpus parity** — the 134-project corpus (`tools/fixtures/tool-matrix-report.mjs`)
  passes with no new failures for every surface the phase touches. Output changes
  are byte-identical unless a waiver documents why the new output is correct;
  waiver ledgers start and end each phase empty.
- **Benchmark budget** — end-to-end benches hold or improve; from phase 1 on,
  the phase-0 microbenches must localize any regression before merge.
- **No behavior change without a fixture** — per the language-engineering change
  classes; Codex dumps become the fixture format as stages come online.

## Phase 0 — Instrumentation and groundwork

The rearchitecture cannot start blind. No behavior changes in this phase.

- Criterion microbenches for the template pipeline: `vize_armature`,
  `vize_croquis`, `vize_atelier_core`, `_dom`, `_vapor`, `_ssr` (today: none).
- Committed corpus baseline snapshot to diff every later phase against.
- Committed **Croquis consumption matrix** (which analysis products have which
  consumers — the [Semantic Engine](./semantic-engine.md#the-problem-measured)
  table becomes a tracked artifact) and a **rule-parity matrix** (which Patina
  rules run on SFC vs JSX today).
- `Span { u32, u32 }` type and the `SourceLocation` diet plan (deprecation path
  for per-node owned `source` strings and dead line/column fields).
- Codex dump harness skeleton (stage-dump → insta snapshot workflow) and the
  rename/absorption plan for the existing croquis "VIR" debug dump.
- Naming review for stages and crates ([Open Questions](./open-questions.md#naming)).

**Exit gate:** benches in CI with recorded baselines; corpus baseline committed;
zero behavior diffs.

## Phase 1 — One arena, real expressions

The highest-leverage single change; everything later depends on it.

- Unify on `oxc_allocator` so template structures and oxc JS ASTs share one
  lifetime; `vize_carton` re-exports accordingly.
- `JsExpression` becomes a real, retained oxc AST parsed **once**; delete the
  parse-copy-reparse round trips (20+ sites) and the fast/slow scanner split.
- Identifier prefixing (`_ctx.`, `$setup.`) moves from string rewriting to AST
  transformation.
- Node strings become `&'a str` / arena atoms; per-node owned strings and the
  manual `Drop` impls go away. The performance-doc interning claim becomes true.

**Exit gate:** corpus compile parity (byte-identical or waivered); compile bench
holds or improves — this phase should be a measurable win, not a wash.

## Phase 2 — S2 semantic IR and the pass manager

- Introduce the S2 typed dialect and the pass manager (const pipelines, debug
  verifiers, `profile!` per pass, **fusable/barrier pass declarations with
  fusion of adjacent single-visit passes**).
- Port the core transform lane: structured control flow replaces in-place
  directive rewriting; the codegen-node universe separates from the surface AST;
  raw `*mut` traversal is replaced by id-based traversal.
- The **DOM backend** is the first strangler target: it lowers from S2 while SSR
  and Vapor still run the old lane.

**Exit gate:** DOM corpus parity; Codex dumps for S1/S2 in fixtures; bench
budget; **fused compile-path traversal count measured at ≤ the pre-Davinci
pipeline's**.

## Phase 3 — S3 reactivity IR and backend convergence

- Generalize the Vapor IR into S3; Vapor lowers S2→S3 with full semantic
  context — deleting the run-then-discard double transform and the duplicated
  directive transforms. Vapor becomes the first consumer of the
  [reactivity lattice](./semantic-engine.md#the-reactivity-lattice--one-analysis-every-backend)
  and effect facts (`EffectGraph` finally reaches a backend); VDOM patch flags
  and SSR static planning derive from the same facts.
- SSR moves onto the shared lowering (through S3 or a thin S2 path — resolve
  [S3 scope](./open-questions.md#s3-scope) here with measurements).
- Structured emitters (S4) replace string-append codegen; **SSR and Vapor gain
  source maps**; SFC-level text-matching map recovery retires.

**Exit gate:** Vapor + SSR corpus parity; source-map coverage measured across all
three backends; Vapor compile bench improves (it stops paying for VDOM).

## Phase 4 — Consumer convergence

- **One virtual-language projection** on S2 replaces the two virtual-TS
  generators (canon + maestro) and unifies their source-map models; diagnostic
  assembly becomes a single post-pass over finished diagnostics.
- Patina's markup facade re-bases as a zero-copy S2 view, and the **rule engine
  re-targets the neutral core through the semantic-engine query API** — one
  rule corpus for SFC and JSX, with per-rule opt-outs only where semantics
  genuinely diverge. Reserved Svelte/Astro variants map to the input-dialect
  contract. Consumers stop reading `Croquis` fields directly; facts become
  demand-driven.
- Glyph formats from lossless S1 (byte scanner retires; pug arrives as an S1
  dialect); Musea's art parser moves onto S0/S1.

**Exit gate:** `vize check` corpus parity; corpus lint-agreement; Glyph's four
corpus properties (idempotence, parse-preservation, lint-agreement, pug) hold
with an empty waiver ledger; the rule-parity matrix shows SFC/JSX convergence
(neutral-core rules run on both); **every computed fact group has ≥1 consumer
or is demand-gated off**.

## Phase 5 — Incrementality substrate

- Stage artifact keys (block-granular, `cache_identity`-style) become the shared
  cache identity; #698 (block-level virtual TS reuse) and #699 (Corsa session
  reuse) land on top.
- Maestro request paths consume cached S1/S2 artifacts instead of re-running
  `parse_sfc` per request (63 sites today); keystroke cost becomes proportional
  to the edited block.

**Exit gate:** measured LSP latency budgets (keystroke → diagnostics, hover,
completion) on large corpus projects; cache-hit accounting in perf tests.

## Phase 6 — Extension contracts GA

- Publish the three contracts (input dialect, expression dialect, output target)
  with marquette-style versioning and compatibility classification.
- One reference foreign consumer validates each boundary: a MoonBit expression-
  dialect prototype (feature-gated or out-of-tree) and a non-JS host target
  exercise with Volt.

**Exit gate:** contracts documented with semver policy; at least one external
consumer builds against a tagged release without patching vize internals.

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| Parity drift discovered late | Corpus gate per phase, not per program; waiver ledger must be empty at phase exit |
| Perf regression hides in end-to-end noise | Phase-0 microbenches localize; budgets are merge gates, not dashboards |
| Strangler stalls mid-way (two lanes forever) | Each phase deletes the code it replaces at exit; deletion is part of the gate |
| Scope creep toward in-tree multi-framework | Decision 1 recorded; external dialects validate contracts, never merge |
| Bus factor | These documents + Codex dumps keep every stage inspectable; aligns with `ubugeeei-redundancy.md` |
