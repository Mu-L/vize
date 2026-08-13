# Davinci — Open Questions

> [!NOTE]
> Active design discussions. Each entry gets a decision record (moved to the
> [charter](./README.md#decided-positions)) or is dropped with a note. Decided
> entries are never silently deleted.

## Naming

The program is **Davinci**. Stage and crate names are open. Constraints: the
workspace uses art terminology with documented rationale
(`docs/content/architecture/overview.md#naming-convention`), and "VIR" is
already taken by the croquis debug dump (playground, CLI, docs all surface it).

Candidates on the table:

- **S2 semantic IR: "Disegno"** — in Renaissance art theory, disegno is the
  underlying design that precedes execution; central to Leonardo's practice.
  Fits "the pivot representation" precisely.
- **Textual dumps: "Codex"** — Leonardo's notebooks (Codex Atlanticus). A codex
  page is exactly what a stage dump is: the working state, made inspectable.
- **S3 reactivity IR** — no strong candidate yet ("Moto", from Leonardo's motion
  studies, has been floated).
- Whether new crates are `vize_davinci_*`, per-stage names (`vize_disegno`), or
  extensions of existing crates, phase by phase.

## S3 scope

Do DOM and SSR lower through S3, or take a thinner S2→S4 path? The shared
static/dynamic partition analysis clearly belongs at the S2→S3 boundary, but
forcing SSR's string-plan through effect-oriented ops may add lowering cost for
no output benefit. **Resolve empirically in phase 3** with microbenches; the
architecture doc deliberately leaves both lanes open.

## Incrementality: hand-rolled keys vs a query system

Phase 5 builds on content-derived stage keys (Doctor's `cache_identity`
pattern). A salsa-style query system would subsume this but imports a large
dependency and an inversion of control that fights "Be Fast Above All" and the
narrow-contract culture. Current lean: hand-rolled keys with dependency edges
recorded explicitly; design stage identities so a query layer could be adopted
later without re-keying. Revisit after phase 5 latency numbers exist.

## Foreign expression type checking depth

For JS, type checking delegates to Corsa via virtual TS. For a foreign
expression dialect (MoonBit), the projection contract can emit virtual host-
language code — but how deep does the toolchain go? Options range from
span-mapped delegation (as with Corsa) to expressions-as-opaque-values with
boundary types only. Needs a concrete prototype (phase 6) before deciding; the
contract should not promise more than delegation initially.

## Pug fidelity level

Glyph's corpus already asserts pug semantics properties, but today pug flows
through as text. Does the S1 pug dialect cover formatting only, or full template
compilation (pug → S2)? Full compilation makes pug a first-class input; the
corpus has real pug usage to measure against. Decide when phase 4 reaches Glyph.

## SFC style coordination in S2

`v-bind()` in CSS creates bindings that cross the template/style block boundary.
Today `vize_atelier_sfc` coordinates this at the descriptor level. Should style
bindings appear as S2 ops (visible to lint/typecheck projections) or stay a
descriptor-level concern? Leaning toward S2 visibility — the linter and the
projection both want to see them — but this widens S2's scope beyond markup.

## Existing "VIR" dump

Rename, absorb, or freeze? The croquis VIR dump is explicitly documented as
display-only, but it is wired into the playground inspector and PR workflows.
Plan needed in phase 0: likely absorb it as the Croquis-side Codex page and
keep a deprecation alias in the inspector payload.

## Contract versioning mechanics

Marquette's canonical-serialization + additive/breaking classification is the
precedent, but dialect contracts carry Rust traits and type layouts, not just
serialized data. How much of the contract is ABI (Rust, semver-checked like
`vize_relief`'s `_legacy` underscore trick) vs data (serialized, marquette-
style)? Affects how external dialects link: compiled-in features vs separate
processes. Needs an answer before phase 6, informed by how Volt actually links.
