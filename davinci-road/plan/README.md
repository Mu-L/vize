# Davinci — Implementation Plan

> [!NOTE]
> PR-granular decomposition of the [roadmap](../roadmap.md) phases, written
> for the agent-implements / maintainer-reviews regime (charter #25). One file
> per phase. This page defines the task format; the phase files are the plan.

## Task format

Every task is one reviewable PR (or an explicitly-marked small series) and
carries:

- **ID** — `P<phase>-<n>`, stable once assigned; referenced in PR titles as
  `davinci(P0-3): …`.
- **Deliverable** — what exists after merge, stated as an artifact, never as
  activity.
- **Acceptance criteria** — machine-checkable conditions (commands that pass,
  artifacts that exist, budgets that hold). A criterion a CI job cannot
  evaluate is a smell; prose criteria appear only as explicitly-marked
  review points.
- **Deps** — task IDs that must land first. Tasks without dependency edges
  between them are parallelizable by different agents.
- **Non-goals** — the nearest scope creep, named.

Rules of engagement, inherited from the charter: behavior changes need
fixtures before code (#21); every PR holds the standing gates that exist at
its merge time; a task that discovers its own scope was wrong updates the
plan file in the same PR (the plan is code).

## Phase files

| File | Phase | Status |
| ---- | ----- | ------ |
| [phase-0.md](./phase-0.md) | Instrumentation and groundwork | Drafted |
| phase-1.md | One arena, real expressions | Pending phase-0 format review |
| phase-2.md | Disegno and the pass manager | Sketch after phase-1 |
| phase-3.md+ | Impeto, consumers, incrementality, contracts | Sketched in the roadmap; detailed as their predecessors near exit |

Later phases are deliberately not decomposed yet: decomposing P3 before P1's
measurements exist would fabricate detail. Each phase file is drafted while
its predecessor is in flight.
