# Davinci — Assurance Doctrine

> [!NOTE]
> The program creed, stated as engineering mechanisms. Recorded 2026-08-13 as
> charter #21. Every phase gate inherits this page.

## The creed

1. **Never fail.**
2. **Edge cases must not exist.**
3. **Every conceivable pattern is tested.**
4. **Tests are strict — nothing passes on partial matching.**

"Never" is not a wish; it is a translation table. A failure mode is either
**impossible by construction** (the type system cannot express it), or
**verified** (a checker rejects it before it ships), or **enumerated and
tested** (it is a case in a matrix with an exact oracle). A failure mode in
none of those three buckets is a design defect, not a bug.

## 1. Never fail — impossibility by construction

- **Illegal states are unrepresentable.** Typed stage enums with no `_` arms —
  adding a variant must break every pass that has to handle it. Ids, spans,
  and keys are newtypes; raw→canonical is a type-level transition; a
  non-canonical artifact cannot reach an optional pass or an emitter.
- **Totality.** Library code does not panic on any input. Malformed source is
  a *represented* state (`Unexpected`/`Missing` S1 nodes), so "broken input"
  is a normal value flowing through total functions, not an edge case.
  Fuzzing (existing `tests/fuzz` lanes, extended per stage) proves no-crash
  over arbitrary bytes; a fuzz crash fix is complete only with its
  deterministic regression case.
- **What can't be typed is verified.** Debug/CI stage verifiers between passes
  (local, artifact-only, Lean-kernel discipline); `render(S1) == source`
  bytes; incremental ≡ from-scratch over the corpus; the IVM oracle
  (incremental update ≡ full render); Folio `--full` round-trip injectivity.

## 2. Edge cases must not exist — elimination by enumeration

An "edge case" is an input region nobody enumerated. The countermeasure is
owning the input space:

- **Construct matrices.** Each dialect's surface constructs are a finite,
  documented set (elements × directives × modifiers × slots × control flow ×
  script binding kinds). New construct ⇒ new matrix row ⇒ the combination
  suites regenerate. A construct without a matrix row cannot merge.
- **Combinatorial coverage.** Pairwise at minimum, exhaustive where the
  product is small (directive × position × modifier). Generated fixtures, not
  hand-picked examples — hand-picked sets are where edge cases hide.
- **Property, metamorphic, differential.** Properties (idempotence,
  parse-preservation — Glyph's four corpus properties generalized to every
  surface); metamorphic SFC mutations with folio-equivalence oracles;
  differential oracles against reference behavior (Vue/vue-tsc parity, the
  Polonius-style naive rule evaluator for fact groups, the S3 reference
  interpreter).
- **The corpus is the floor, not the ceiling.** 134 real projects prove
  absence of regressions on code that exists; the matrices and properties
  cover code that doesn't exist yet.

## 3. Every conceivable pattern is tested — the tier ladder

| Tier | Unit | Oracle |
| ---- | ---- | ------ |
| Fixture | one construct, one stage | full normalized Folio snapshot (exact) |
| Pass | one pass via `davinci-opt` | full normalized Folio snapshot (exact) |
| Verifier | invalid artifact | exact diagnostic (code + span + full message) |
| Matrix | construct combinations | generated expected outputs, exact |
| Property | generated inputs | invariant holds — no exceptions list |
| Metamorphic | mutated SFC pairs | folio equality modulo declared normalization |
| Differential | vs reference implementation | exact agreement or explicit, reviewed waiver |
| Behavioral | compiled output, mounted | scripted interaction trace equality (sprout-style) |
| Corpus | 134 projects | byte-identical or waivered; ledger empty at phase exit |
| Editor | LSP scenarios | exact protocol-level expectations, multi-client |

Every phase's exit gate names which tiers it extends. A feature testable in a
tier but not tested there is untested.

## 4. Strict oracles — no partial matching

- **Exact equality only.** Assertions compare whole normalized artifacts:
  full Folio snapshots, byte-identical outputs, structural equality on typed
  values. **Banned in test code:** substring/`contains` assertions, regex
  loosening, partial JSON matching, prefix/suffix checks, count-only checks,
  and threshold assertions where exact values are computable. If output is
  nondeterministic, the fix is normalization in the printer (stable ids,
  sorted maps), never a looser assertion.
- **Targeted assertions supplement, never replace.** The rustc FileCheck
  practice is adopted *under* this rule: a pass test's oracle is the full
  normalized folio; targeted structural assertions may document the specific
  property the pass claims, in addition — an exact structural match on a named
  sub-object, never a substring.
- **Oracle truth.** An exact assertion of a wrong expected value is worse than
  none — it pins the bug as correct (this happened: a canon test normalized a
  virtual-path leak into its expected message and froze the leak). Expected
  values must be justified — against Vue/TypeScript reference behavior, a
  spec, or a documented decision — not merely recorded. Snapshot review asks
  "why is this output *right*?", not "did it change?".
- **Rebaseline discipline.** Snapshots are reviewed contracts
  (language-engineering-practices). A PR refreshing more than a handful of
  snapshots must explain every group of diffs; bulk-accept is prohibited.
- **Tests are themselves tested.** Mutation testing (`cargo-mutants`) runs on
  Davinci crates: a surviving mutant in a stage, pass, or verifier is a
  missing or lax test and blocks the phase gate. This is how "strict" is
  measured instead of asserted.
- **Assertion lint.** The banned-pattern list is enforced mechanically (test
  lint in CI), the same way `clippy.toml` bans `std::string::String` — not by
  review vigilance.

## Enforcement summary

Phase 0 adds: the assertion lint, the mutation-testing baseline, matrix
generators for the existing surface, and the normalized-printer rules that
make exact snapshots sustainable. Every later phase inherits: verifier +
matrix + property + corpus gates, empty waiver ledgers, mutation score held,
and the standing rule that a deleted failure class stays deleted — a
regression reopens the phase, not a ticket.
