# Phase 1 — One Arena, Real Expressions

> [!NOTE]
> The highest-leverage phase: expressions parsed once, strings out of nodes,
> one lifetime. Exit requires a measurable performance **win**, not parity.
> Dependency chain is real here — order matters.

## TODO index

- [ ] P1-1 Arena unification in carton
- [ ] P1-2 Allocator plumbing through armature/atelier
- [ ] P1-3 `SourceLocation` diet: retire per-node `source` strings
- [ ] P1-4 `SourceLocation` diet: retire dead line/column
- [ ] P1-5 Retained expressions: parse-once storage
- [ ] P1-6 Consumer migration wave A (croquis identifier/scope helpers)
- [ ] P1-7 Consumer migration wave B (atelier patch-flag, v-for, transforms)
- [ ] P1-8 Delete the fast/slow scanner split
- [ ] P1-9 Identifier prefixing as AST transform
- [ ] P1-10 Node strings → `&'a str` / arena atoms; delete manual `Drop`s
- [ ] P1-11 Arena reuse across files (batch pool)
- [ ] P1-12 Performance-doc truth pass
- [ ] P1-13 Phase exit: budgets pinned, old paths deleted

## P1-1 — Arena unification in carton

**Deliverable:** `vize_carton::Allocator` becomes `oxc_allocator::Allocator`
(re-export or newtype), with `Box`/`Vec` aliases mapped and a compatibility
audit of bumpalo-API differences (documented, shimmed where trivial).
**Acceptance:** workspace compiles and all tests pass with the unified arena;
P0 benches hold within noise; node-size asserts unchanged.
**Deps:** P0-4, P0-9.

## P1-2 — Allocator plumbing

**Deliverable:** `&'a Allocator` threaded through `vize_armature` parse entry
points and the atelier lanes so template structures and (future) oxc ASTs can
share `'a`. No representation changes yet.
**Acceptance:** corpus baseline diff empty; benches hold.
**Deps:** P1-1.

## P1-3 — Retire per-node `source` strings

**Deliverable:** `SourceLocation.source` removed; all consumers (P0-9
inventory) read via `Span` + source text lookup. Error/diagnostic rendering
switches to span-derived excerpts.
**Acceptance:** corpus byte parity (compiler + diagnostics text identical);
node-size asserts shrink and are re-pinned; alloc counts drop in P0-2 benches.
**Deps:** P1-2, P0-9.

## P1-4 — Retire dead line/column

**Deliverable:** `Position` reduced to offset (line/column derived at
diagnostic-render and source-map `finish()` time only, where it already
re-derives).
**Acceptance:** corpus parity including source maps; node-size asserts
re-pinned smaller.
**Deps:** P1-3.

## P1-5 — Retained expressions: parse-once storage

**Deliverable:** `JsExpression` becomes a retained `&'a oxc_ast::Expression<'a>`
parsed exactly once (at template parse or first semantic touch — decide by
bench), stored on `SimpleExpressionNode`. A profiler counter
(`davinci.expr.parses`) asserts the per-compile parse count.
**Acceptance:** counter == number of distinct expressions on fixture ladder;
corpus parity; benches hold or improve (retention must beat reparse already).
**Deps:** P1-2.

## P1-6 — Consumer migration wave A (croquis)

**Deliverable:** croquis input layer (charter #37) reads retained ASTs:
identifier enumeration, scope resolution helpers, `v-for` parsing — the
`identifiers/{fast,slow}.rs` call sites route through the retained AST behind
a differential check (old vs new results compared in CI for one release).
**Acceptance:** differential check green over the corpus; reparse counter
drops accordingly; croquis benches improve.
**Deps:** P1-5.

## P1-7 — Consumer migration wave B (atelier)

**Deliverable:** `patch_flag.rs`, `v_for` helpers, `transform_expression`
inputs, and the remaining ~20 reparse sites (P0-9 inventory drives the
checklist) consume retained ASTs.
**Acceptance:** `davinci.expr.parses` reaches its floor (== distinct
expressions, zero re-parses) on the corpus; parity holds.
**Deps:** P1-5 (parallel with P1-6).

## P1-8 — Delete the fast/slow scanner split

**Deliverable:** the byte-scanner fast path and oxc slow path are replaced by
retained-AST walks; the scanner code is deleted (charter: deletion is part of
the gate).
**Acceptance:** grep zero for the scanner modules; corpus parity; croquis
benches hold or improve (if the scanner was load-bearing for speed, the walk
must match it — measured, not assumed).
**Deps:** P1-6, P1-7.

## P1-9 — Identifier prefixing as AST transform

**Deliverable:** `_ctx.`/`$setup.` prefixing implemented as an AST-level
transform over retained expressions with span-preserving emission, replacing
string rewriting (`transform_expression/{prefix,rewrite,nesting}.rs`).
**Acceptance:** corpus byte parity on all three backends (prefixing output is
highly visible — this is the riskiest parity task in the phase; its waiver
budget is zero); source-map assertions for rewritten identifiers added.
**Deps:** P1-7.

## P1-10 — Node strings to `&'a str` / atoms; delete manual `Drop`s

**Deliverable:** node name/tag/content fields become source slices or
arena-interned atoms (interner lands in carton); per-node `CompactString`s
retired; `ensure_sufficient_stack` `Drop` impls deleted (arena drop is free).
**Acceptance:** grep zero for manual `Drop` on node types; alloc counts drop
measurably (pin the number); deep-nesting stress fixture passes without the
stack guard; corpus parity.
**Deps:** P1-3.

## P1-11 — Arena reuse across files

**Deliverable:** batch CLI compiles reuse pooled allocators
(`Allocator::reset`) instead of fresh arenas per file.
**Acceptance:** peak RSS on the corpus batch drops (pin the number); no
cross-file data escapes (miri/asan lane on the pool).
**Deps:** P1-10.

## P1-12 — Performance-doc truth pass

**Deliverable:** `docs/content/architecture/performance.md` updated so every
claim (interning, arenas, allocation behavior) is true of the shipped code,
with numbers from the phase's benches.
**Acceptance:** review point — maintainer signs off claims against measurements.
**Deps:** P1-10, P1-11.

## P1-13 — Phase exit

**Acceptance (all machine-checkable, then delete-and-close):**
- [ ] Corpus compile parity: byte-identical, waiver ledger empty
- [ ] `davinci.expr.parses` == distinct expressions (zero reparse) in CI
- [ ] Compile bench improvement ≥ target pinned at phase start from P0 baselines
- [ ] Alloc count / peak RSS improvements pinned as new ratchet baselines
- [ ] Scanner split, string-rewrite prefixing, manual `Drop`s: deleted (grep zero)
- [ ] In-phase fallback flags removed (charter #26)
