# P3-6 - Checked Teleport generation (2026-09-26)

The native payload retains `ComponentKind::Teleport`; the shared generator
selects `VaporTeleport` without resolving it as an application component.
Admission accepts an authored `Teleport` with a required `to`, optional
`disabled`/`defer`, and ordinary implicit default content. Each prop uses the
existing retained expression contract. Scoped/named slot carriers, models,
spread props, component events, unknown props, and other built-ins remain
explicit retained-lane selections.

## Evidence

- Four sources with static/reactive targets, deferred mounting, conditionals,
  or keyed loop content produce byte-identical native/retained code under both
  prefix settings. A payload mutation changes the generated target while the
  source supplied to generation is a decoy.
- Three code/source-map snapshots compare every decoded segment with the
  retained lane for static, reactive, and indexed targets.
- TS-33 compares exact DOM trees, events, and node identities against the pinned
  official compiler and runtime. Reference, indexed, and conditional targets
  move a button between deferred in-app destinations. `disabled` returns the
  same button to its original location, then re-enabling moves it back.
- External destinations exercise ordinary non-deferred mounting, target
  changes, disabled state, event continuity, and unmount. Both external targets
  must contain no nodes after unmount, including backend anchor comments.
- Four Teleport sources under both prefix settings satisfy the dedicated
  zero-walk/expression-reparse floor. Existing allocation ceilings stay intact.

These witnesses do not close P3-6 or prove the remaining built-in contracts.
