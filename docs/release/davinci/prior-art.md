# Davinci — Prior Art & Imported Practices

> [!NOTE]
> Surveyed 2026-08-13 against current sources (links inline). Each entry states
> what the system does, what Davinci imports (with the concrete mapping), and
> what it deliberately does not. This page is the justification trail for
> practices referenced by the [architecture](./architecture.md) and
> [roadmap](./roadmap.md).

## rustc — MIR, Polonius, queries

**MIR / phase discipline.** MIR wins because it is the *minimal structure over
which the flagship analysis is naturally expressible*, with named phases each
carrying validated invariants (`-Zvalidate-mir`), and per-pass dump testing
that moved from full golden diffs to targeted FileCheck assertions
([mir-opt FileCheck](https://github.com/rust-lang/rust/pull/116810)).
*Import:* Impeto gets named phases (`built → partitioned → scheduled`) with a
cheap between-pass validator; Folio pass tests default to targeted assertions,
full-dump snapshots stay a small curated set. THIR's ephemeral-bridge pattern
licenses S2→S3 scratch structures that are never persisted stages.
*Anti-lesson:* MIR optimizations were chronically unsound because MIR's runtime
semantics were never pinned down first — the S3 op reference (what each effect
means under Vapor and VDOM interpretation) is written **before** fusable passes,
with Folio as its concrete syntax. rustc's `optimized_mir` "steal" coupling is
the named counter-example for keeping phase outputs immutable.

**Polonius.** The datalog formulation remains the borrow checker's *spec*; the
shipped implementation (nightly 2026-08) is a reformulation inside NLL because
materializing fact × CFG-point relations was fatally slow
([enabling polonius alpha](https://blog.rust-lang.org/2026/08/04/enabling-polonius-alpha-on-nightly/)).
*Import:* every fact group keeps a small declarative rule statement in
docs/tests with a naive evaluator as a **differential oracle in the corpus
harness**; implementations stay hand-written fixpoints. Design-review smell:
any fact keyed by (something × every expression position). Staged precision —
coarse location-insensitive fact first, precise analysis only where the coarse
one is inconclusive — is the template for expensive lattice analyses.

**Query system / incremental.** Red-green + fingerprint early-cutoff; *relative
spans* so position shifts don't invalidate ([#84373](https://github.com/rust-lang/rust/pull/84373));
stable `DefPathHash` vs dense per-session `DefId`; the
[1.52.1 incident](https://blog.rust-lang.org/2021/05/10/Rust-1.52.1/) (silent
fingerprint unsoundness for years because verification was off).
*Import:* block content keys hash **span-relative** structure (absolute
positions live in S0 side tables); stable content keys vs dense NodeIds as the
two-level naming; **incremental-vs-clean equivalence in CI from the first
salsa-backed release**. The two-tier execution split (fused CLI, salsa
resident) is exactly rustc/rust-analyzer precedent.

**salsa (0.28.x, 2026).** rust-analyzer's structure: inputs (file text, crate
graph), interned ids, **durability layers** (library inputs vs open buffers),
and **firewall queries** — small stable derived values that stop edit noise via
backdating. Its 2025 port data (memory ×4, cache priming 26s→112s before
tuning) is the warning about per-entity tracking.
*Import:* block content keys as the firewall query; durability =
`node_modules`/tsconfig high, buffers low; track at block granularity with
arena-packed stage values inside; deterministic ordering in every query result
(Folio-testable); explicit interning GC bounds.

## LLVM / MLIR

**Dialect design.** Lattner's retrospective: scaling before foundations settle
freezes accidental behavior into contracts
([What about MLIR?](https://www.modular.com/blog/democratizing-ai-compute-part-8-what-about-the-mlir-compiler-infrastructure));
the conversion framework's rollback machinery became the slowest part and is
being retired for one-shot lowering
([one-shot RFC](https://discourse.llvm.org/t/rfc-a-new-one-shot-dialect-conversion-driver/79083)).
*Import:* stage additions and cross-stage escape hatches require charter-level
review; lowerings are total functions that fail with diagnostics, **never
rollback**; per-stage canonical form is a one-page documented doctrine whose
regression test is the Folio snapshot itself. The moment S2 grows a variant
that exists only for one input syntax, we've started MLIR's dialect-overload
problem — that's the review question for every S2 change.

**Pass manager.** Five features imported nearly verbatim from
[MLIR's pass infrastructure](https://mlir.llvm.org/docs/PassManagement/):
textual pipeline syntax (`s2(hoist-static,region-merge),s2-to-s3(...)`) as the
keystone for single-pass testing; a single `PassObserver` trait (seven hooks)
carrying timing, Folio printing, budget enforcement, and remarks at zero cost
when detached — reporting **fusion grouping explicitly so timing never lies**;
`--folio-after-change` (hash-gated printing) turning "which pass broke this"
into reading; crash reproducers = last-good folio + pipeline string, replayable
via `vize repro`; machine-readable timing (JSON) so CI gates on the traversal
budget.

**`davinci-opt`.** MLIR's testing culture rests on `mlir-opt` + round-tripping
textual IR. *Import:* Folio must **parse, not just print**, for S2/S3; a
`davinci-opt` binary reads a folio, runs a named pipeline, prints a folio.
Without round-trip, every pass test drags the full upstream pipeline — the
exact coupling MLIR's guide warns against. A `#[derive(Folio)]` proc-macro
covers the mechanical print/parse/field-order trio; verifier logic and
lowerings stay hand-written (the ODS anti-lesson: don't build an op-DSL).

**Interfaces without dyn.** OpInterface's effect — generic passes over
capability-typed ops — is reproduced statically: capability traits
(`HasRegions`, `SpanCarrier`, `Reactive`) implemented as exhaustive matches on
closed stage enums, monomorphized generic walks. The one designated `dyn` seam
is S4 emitters (per-target trait objects, cheap and right). No `_` arms on
stage enums — adding a variant must break every pass that has to handle it.

**Analysis invalidation.** LLVM's new-PM model — lazy analyses from a manager,
passes return `PreservedAnalyses` *post-hoc*, named preservation sets, plus a
debug mode that recomputes "preserved" analyses and asserts equality (absence
of which caused years of stale-analysis bugs)
([new PM](https://blog.llvm.org/posts/2021-03-26-the-new-pass-manager/)).
*Import:* the fact engine's invalidation model, verbatim; a fused walk
preserves the intersection of members' preserved sets, computed at fusion time.

**Remarks.** LLVM's structured optimization remarks with source locations +
opt-viewer/opt-diff ([remarks](https://releases.llvm.org/13.0.0/docs/Remarks.html))
are the highest-leverage DevTool import: every decision pass emits
`{pass, kind: applied|missed, span, args}` with **structured args** (free-form
strings are unfilterable — their regret), keyed to authored SFC spans.
`remarks-diff` over the corpus catches optimization regressions without output
diffing; missed-remarks are a mined feature backlog.

**IR contract debt.** LLVM's three expensive regrets — redundant encodings
(pointee types: ~7 years to remove; typed GEP still migrating), underspecified
escape values (undef/poison), constructor-time folding (top infinite-loop
source) — were all known early and cheap to fix early
([nikic](https://www.npopov.com/2021/06/02/Design-issues-in-LLVM-IR.html)).
*Import as rules:* every S2/S3 field is either semantic or derivable-and-cached,
never both; any `Expr::Opaque` escape variant gets pessimal documented
semantics from day one; folding happens in exactly one designated pass per
stage. One **IR contract review milestone** before DevTool/caches depend on the
formats — the last cheap-fix window.

**folio-reduce.** llvm-reduce's design (dumb driver, sovereign interestingness
script, IR-aware reduction vocabulary) is feasible and nearly free for Davinci:
reduce the SFC via S1 subtree deletion (always re-printable), oracles composed
from diagnostics, remarks, Folio content, and budget violations — all
infrastructure that exists for other reasons
([llvm-reduce](https://llvm.org/docs/CommandGuide/llvm-reduce.html)).

## React Compiler (v1.0, 2025)

The closest prior art to the reactivity lattice — an existence proof that
reactivity is inferable from *unannotated* JS
([release](https://react.dev/blog/2025/10/07/react-compiler-1)).

*Import:*
- The **effect vocabulary** from its aliasing model
  ([MUTABILITY_ALIASING_MODEL](https://github.com/facebook/react/blob/main/compiler/packages/babel-plugin-react-compiler/src/Inference/MUTABILITY_ALIASING_MODEL.md))
  is the lattice's missing mutability half: `Freeze` ≈ props-stable, `Capture`
  into a watcher/closure propagates reactivity, `MutateGlobal`/`Impure` force
  unstable. Implemented as per-binding effect summaries over oxc ASTs in the
  semantic engine.
- **Range grouping = effect partitioning**: disjoint-set over overlapping
  mutable ranges ("values that mutate together") is the same algorithm for
  Vapor effect grouping and VDOM patch-flag regions.
- **Granular bailout**: their unit is the function; ours is the binding/block —
  unclassifiable constructs degrade to `unstable` with conservative codegen for
  that block only, never failing the SFC.
- **One analysis, two surfaces**: their eslint rules are compiler validation
  passes re-surfaced — the argument that lattice facts feed lint and codegen
  from one source.
- **Testing wholesale**: fixture-first snap workflow (golden emitted code +
  per-pass `--debug` dumps) plus a *sprout* equivalent — mount compiled Vapor
  and VDOM outputs against scripted prop/interaction sequences and diff
  observable behavior. This is the behavioral-equivalence tier the corpus
  currently lacks.

*Anti-lessons:* batch-only, nothing to learn on incrementality; don't run CFG
inference where template syntax already answers the question (reserve heavy
inference for setup-scope bindings); cap memoization granularity — tracking
overhead can exceed recomputation ("good enough" beats maximal).

## MoonBit

*Import:*
- **`.mbti` interface firewalls** ([virtual packages](https://www.moonbitlang.com/blog/virtual-package)):
  split every stage artifact key into *interface hash* (exported names, types,
  reactivity classes) vs *body hash*; dependents key on the interface hash so
  body-only edits never cascade. Interface facts are generated from S2 and
  diffed structurally — the mechanism that makes block granularity pay.
- **Fault-tolerant analysis**: semantic analysis proceeds past errors,
  producing facts for whatever is well-formed — required behavior for the
  resident tier.
- **MoonBit-as-expression-dialect, de-risked**: vendor a pinned `moonc.wasm`
  run in wasmtime over a virtual FS
  ([wasm toolchain](https://www.moonbitlang.com/blog/moonbit-wasm-toolchain)) —
  no user-installed toolchain, version pinned as part of the fact cache key.
  The projection is a generated `.mbti` binding environment + projected `.mbt`
  bodies, structurally identical to the virtual-TS/Corsa path.

*Anti-lessons:* MoonBit's speed is partly language design (acyclic DAG,
explicit interfaces) — Vue/JS graphs are cyclic, so interface firewalls need
conservative widening; no cross-module WPO chasing in S4 (open-world JS); no
documented stable moonc API — wrap the CLI surface behind a capability.

## Unison

The ceiling proof for content-addressed artifacts: hash-identified definitions
make parse/typecheck results **permanently** cacheable and renames metadata
([the big idea](https://www.unison-lang.org/docs/the-big-idea/)).
*Import as disciplines, not architecture:*
- **Identity excludes presentation** — content keys hash normalized structure
  with spans externalized; formatting edits produce identical keys; the normal
  form is versioned (schema version inside every key).
- **Honest inputs** — a fact group's key covers *all* inputs including ambient
  ones (tsconfig, moonc version, env); an undeclared input is a
  cache-corruption bug, not a perf bug. Unison's abilities are the typed
  version of our input manifests.
- **Hashes stay invisible** — humans see stable block ids and names;
  content keys are validity checks only, never user-facing.

*Anti-lesson:* Unison's pain comes from making the database the source of
truth. Davinci inverts it: source files are truth, every artifact is a
reconstructible cache — which is why salsa stays resident-tier only.

## Effekt

Honest verdict: mostly analogy, two real imports.
- **Lexical vs dynamic scoping as an analysis boundary**: watchers/computed/
  lifecycle bind lexically to setup scope — statically resolvable;
  `provide/inject` is the dynamically-scoped exception, which is *why* inject-
  derived bindings can never classify above `reactive` without whole-app facts.
  Encoded as a lattice rule, not a heuristic.
- **Escape = visible degradation**: second-class-by-default capabilities map to
  escape analysis as the lattice-demotion mechanism (a ref escaping setup via
  store/return/closure drops its class) — convergent with React Compiler's
  `Capture`/`CreateFunction` from the opposite direction, decent evidence the
  mechanism is right.

*Anti-lesson:* Effekt's own retreat from its three-paper IR pipeline
([evolution](https://effekt-lang.org/evolution)) argues S3 analyses stay boring
dataflow (abstract interpretation), not a typed effect calculus, however
tempting the lattice-as-effect-system framing is. Effect typing requires
annotated cooperative source we cannot demand; evidence-passing machinery has
zero transfer (no user-visible handlers in Vue).

## Recent literature (2022–2026)

**Region IRs validated — S2 as designed.** V8 abandoned sea-of-nodes for a CFG
IR in 2025 with compile time halved
([Land ahoy](https://v8.dev/blog/leaving-the-sea-of-nodes)): graph IRs pay off
only when operations are pure and reorderable, and JS is effect-dominated. UI
templates are effect-dominated *and* structured by construction, so
region-structured S2 is what the field converged to — and Davinci skips
RVSDG's expensive restructuring step because templates have no gotos
([RVSDG, TECS 2020](https://dl.acm.org/doi/10.1145/3391902)). One RVSDG
mechanism imported: **state edges** — S3 encodes DOM/effect ordering as
explicit dependencies, not implicit walk order, making partition and grouping
local graph queries. *Import now.*

**Rendering as incremental view maintenance — the S3 theory.**
[DBSP (VLDB 2023 best paper)](https://docs.feldera.com/vldb23.pdf): every
operator has an incremental form; linear operators incrementalize for free,
non-linear ones need memoization. Mapping: a keyed `v-for` is a linear
operator whose patch plan *is* the incremental circuit; non-linear mixes of
reactive sources are exactly where cache/memo ops belong. This derives patch
flags and SSR plans from **operator linearity** instead of ad-hoc rules, and
yields a mechanical oracle: *incremental update output ≡ from-scratch render*.
[React-tRace (2025)](https://arxiv.org/abs/2507.05234) shows the method — a
tiny executable reference semantics for S3, differentially tested against
optimized codegen. *IVM framing: import now; reference interpreter: prototype
later.*

**Incrementality boundaries — the two-tier split sharpened.**
[matklad's 2026 critique of query-based compilers](https://matklad.github.io/2026/02/25/against-query-based-compilers.html):
fine-grained queries are a tax imposed by language design; locality-friendly
languages should parse in parallel and sequence only *summaries*.
[CodeQL's incrementalization (FSE 2023)](https://arxiv.org/abs/2308.09660):
fully-incremental datalog cost ~70GB RAM; the winner was hybrid — batch the
non-recursive parts, incrementalize only recursion. Import: the **per-SFC
summary (props/emits/slots types, component refs) is the only cross-file salsa
key**; template-body edits never cross the file boundary unless the summary
changes; only recursive fact groups (graph reachability, route typing,
transitive slots) are incrementalized — block-local facts recompute from
content-keyed artifacts. *Import now.*

**Datalog engines.** [Ascent (CC 2022)](https://dl.acm.org/doi/abs/10.1145/3497776.3517779)
(compiled Rust macro datalog) is the only engine shape that fits — candidate
for the 2–3 genuinely recursive fact groups in the salsa tier, never the fused
path. [Glean](https://glean.software)'s schema discipline (typed, versioned,
demand-derived facts with provenance) confirms the fact-group design at scale.
*Ascent: prototype later; Glean's model: design reference now.*

**Equality saturation.** Davinci's optimization space (hoist/cache/group) is
small and mostly confluent — full eqsat solves phase-ordering problems we don't
have, and binder-heavy terms (`v-for` scopes) are where e-graphs still hurt
([slotted e-graphs, PLDI 2025](https://dl.acm.org/doi/10.1145/3729326)). The
transferable shape is Cranelift's aegraph discipline: **keep placement
alternatives explicit in S3 (hoisted/cached/inline/grouped) and defer the
choice to one cost-driven extraction point** instead of committing during the
walk. *Deferred-extraction: prototype later if greedy decisions pessimize.*

**Testing.** [MetaMut (ASPLOS 2024)](https://connglli.github.io/pdfs/metamut_asplos24.pdf) /
WhiteFox (OOPSLA 2024): Folio dumps make Davinci a metamorphic-testing
goldmine — semantics-preserving SFC mutations (attribute reorder, pass-through
wrappers, text-node splits) must yield S3 folios identical modulo ids; an
LLM-guided loop that reads an optimization pass and synthesizes exercising
templates layers onto the corpus harness cheaply. Alive2-style full SMT
translation validation is overkill; per-stage reference semantics +
differential folio checks are the tractable version. *Metamorphic folios:
import now; translation validation: prototype later.*

**WASM component model as the external-dialect ABI.**
[WAW @ POPL 2025](https://popl25.sigplan.org/details/waw-2025-papers/4/The-WebAssembly-Component-Model):
WIT-typed, versioned interfaces; practitioner benchmarks ~6× JSON-RPC
throughput; and the `wasm32-wasip2` core target (charter #18) means external
dialects can run out-of-process *or* in-process under wasmtime against the
same contract. Caveat: the canonical ABI copies at boundaries — interfaces
must be coarse-grained (whole block in, surface tree out), never per-node.
*Import now — this resolves the charter #15 transport question.*
