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

## Documents

| Document | Contents |
| -------- | -------- |
| [Motivation](./motivation.md) | Current-state fault lines with file-path evidence, and the existing assets Davinci builds on |
| [Architecture](./architecture.md) | The stage model (S0–S4), shared infrastructure, dialect and target contracts, performance guardrails |
| [Roadmap](./roadmap.md) | Phases, exit gates, and risks |
| [Open Questions](./open-questions.md) | Active design discussions not yet decided |

## Relationship to the mission

`ubugeeei-redundancy.md` requires: performance as a product requirement, Vue
toolchain scope, "clear data ownership, explicit phases, narrow contracts,
deterministic behavior, testable outputs", and VoidZero assets as infrastructure.
Davinci is the structural answer to the third requirement — explicit phases and
narrow contracts *are* the multi-stage IR — while decision 1 preserves the second
and the performance gates in the roadmap enforce the first.
