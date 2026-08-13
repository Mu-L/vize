# Phase 3 — Impeto and Backend Convergence (provisional decomposition)

> [!WARNING]
> Provisional; re-cut at phase-2 exit.

## TODO index

- [ ] P3-1 `vize_impeto` crate: flat id ops, explicit state edges, named phases (`built → partitioned → scheduled`) + between-pass validator
- [ ] P3-2 Reactivity lattice fact group v1 (React-Compiler effect vocabulary; escape-analysis demotion; three-valued verdicts)
- [ ] P3-3 S2→S3 lowering with the shared static/dynamic partition analysis
- [ ] P3-4 Lean executable reference semantics for S3 (charter #36) + differential runner in CI
- [ ] P3-5 Impeto op reference doc (what each effect means under Vapor and VDOM interpretation) — written **before** optional passes land (MIR anti-lesson)
- [ ] P3-6 Vapor backend on S3, upstream `@vue/runtime-vapor` APIs (charter #38), behind in-phase flag — deletes run-then-discard + duplicated directive transforms
- [ ] P3-7 VDOM patch flags derived from lattice facts (replaces codegen-time inference)
- [ ] P3-8 SSR thin S2→S4 path reading partition facts (charter #9)
- [ ] P3-9 S4 structured emitter + unified SourceMapBuilder; **SSR and Vapor source maps**; SFC text-matching map recovery deleted
- [ ] P3-10 Try-measure-commit extraction with per-component budgets (Flambda2 model); optimization tiers as budget constants
- [ ] P3-11 IVM oracle (incremental ≡ from-scratch on reference semantics) + metamorphic S3 suite
- [ ] P3-12 Behavioral (sprout-style) runner: mount compiled Vapor + VDOM against scripted interactions, **including IME composition scripts for `ui.model` realizations** (charter #40)
- [ ] P3-13 Optimization remarks (applied/missed, structured args) + corpus remarks-diff job
- [ ] P3-14 `folio-reduce` (SFC reduction via S1 subtree deletion; oracle scripts over diagnostics/remarks/folios)
- [ ] P3-15 Lattice/effect-grouping/IVM-linearity theorems in Lean (as they stabilize)
- [ ] P3-16 Phase exit: Vapor behavioral + SSR byte parity; source-map coverage metric; Vapor bench win; old lanes deleted

Key acceptance themes: Vapor gates are behavioral (charter #23 experimental
tier) while SSR stays byte-parity; `EffectGraph` finally consumed by a
backend; remarks-diff clean across the corpus at exit.
