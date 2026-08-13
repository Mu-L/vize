# Davinci — Compiler DevTool

> [!NOTE]
> Design-phase vision for the observability surface of Davinci: a devtool that
> makes the language-processing flow visible at fine grain, for humans debugging
> the compiler, users debugging their components, and AI agents optimizing both.

## What it shows

The pipeline as a navigable object, not a black box:

- **Stage ladder** — the same source viewed as S1 surface tree, S2 Disegno, S3
  Impeto, and S4 output, side by side, with span-linked highlighting: select a
  template expression and see it in every stage and in the emitted JS /
  virtual TS.
- **Pass timeline** — every pass that ran, in order, with per-pass Folio diffs
  ("what did `hoist_static` actually change?"), timing from the profiler, and
  fusion boundaries made visible (which passes ran fused in one walk).
- **Provenance** — every S2/S3 op records which pass produced it from which
  source span; the inverse index answers "why does the output contain this?"
- **Fact browser** — the semantic engine's fact groups for the current file and
  project: bindings on the reactivity lattice, effect dependency sets, the
  cross-file component graph, route/app-level facts, complexity scores.
- **Decision explanations** — LLVM-remark-style notes with source locations:
  why an element was not hoisted, why a patch flag was chosen, why an effect
  was grouped, why Vapor bailed on a construct.
- **Flame view** — profiler spans (pass × stage × block) rendered as flame
  graphs, diffable between two runs (the AI optimization loop's visual twin).

## Data layer

No private protocol: the DevTool renders artifacts that already exist for
testing and AI — **Folio dumps** (with provenance), the **profiler export**,
**diagnostics**, and **fact tables**. Anything the DevTool can show, a
snapshot test can pin and an agent can consume. That equivalence is the design
constraint that keeps the tool honest.

## Surfaces

- **Playground / browser** — the existing Compiler Inspector
  (`vize_curator::inspector`, `vize inspector`, the playground UI) grows into
  the full DevTool; the wasm build (`vize_vitrine`) already runs the compiler
  in-browser.
- **Local server** — `vize devtool` serves the same UI against a real project,
  editor-agnostic (works next to Neovim as well as VS Code).
- **TUI** — a `vize_fresco`-based terminal view for the pass timeline and
  diagnostics workspace, following `vize doctor`'s TUI precedent.
- **Agent format** — `--format agent` output (existing inspector precedent,
  `vize_doctor::ai_context` budgeting) for AI consumption.

## Naming

**Decided: Spolvero** (charter round, 2026-08-13) — the pounced transfer of a
disegno onto the wall. The DevTool shows how the Disegno got transferred into
what runs: the name and the mechanism are the same statement. Transport and
protocol details remain open ([Open Questions](./open-questions.md)).
