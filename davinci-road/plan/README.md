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
| [phase-0.md](./phase-0.md) | Instrumentation and groundwork | **Drafted, full detail** — ready to execute |
| [phase-1.md](./phase-1.md) | One arena, real expressions | **Drafted, full detail** — dependency chain explicit |
| [phase-2.md](./phase-2.md) | Disegno and the pass manager | Drafted, provisional — re-cut at P1 exit |
| [phase-3.md](./phase-3.md) | Impeto and backend convergence | Drafted, provisional — re-cut at P2 exit |
| [phase-4.md](./phase-4.md) | Consumer convergence | Drafted, provisional — re-cut at P3 exit |
| [phase-5.md](./phase-5.md) | Incrementality substrate | Drafted, provisional — re-cut at P4 exit |
| [phase-6.md](./phase-6.md) | Extension contracts GA | Drafted, provisional — re-cut at P5 exit |
| [continuous.md](./continuous.md) | Cross-phase workstreams (Spolvero, AI loop, corpus, assurance, formal) | Drafted — items trigger on their substrate |

P0 and P1 carry full per-task acceptance criteria. P2–P6 are enumerated to
maximum known detail but marked **provisional**: each is re-cut when its
predecessor exits, so measured reality — not today's guesses — sets the final
task boundaries. Every phase file keeps a checkbox TODO index at the top;
checking a box happens in the PR that satisfies the task's acceptance
criteria, never before.
