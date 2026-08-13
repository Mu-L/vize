# Phase 5 — Incrementality Substrate (provisional decomposition)

> [!WARNING]
> Provisional; re-cut at phase-4 exit.

## TODO index

- [ ] P5-1 Stage artifact keys: block-granular, span-relative, normalized-structure hashes with schema versions (Unison discipline); two-platform key-equality CI oracle (Lake incident)
- [ ] P5-2 Per-SFC summary: per-declaration fingerprints + consumers record used declarations (GHC `.hi` rule); body/code-shape elision **by type construction**
- [ ] P5-3 Global summary for orphan-equivalent facts (app-level provide/inject, global components, dialect-wide directives)
- [ ] P5-4 salsa DB, resident tier only (charter #10): inputs, block-key firewall queries, durability layers (`node_modules`/tsconfig high, buffers low), interning GC + memory bounds
- [ ] P5-5 Lean-style snapshot tree **under** salsa: joints at header/block/S2-region; adoption rule (old syntax ≡ new ⇒ adopt); cascade-cancellation tokens through stage tasks
- [ ] P5-6 Maestro request paths onto cached artifacts — the 63 `parse_sfc` sites, in waves, with keystroke-cost perf tests per wave
- [ ] P5-7 #698: block-level virtual-projection reuse on stage keys
- [ ] P5-8 #699: Corsa session reuse keyed by project identity
- [ ] P5-9 Incremental ≡ from-scratch equivalence in CI over the corpus, from the first salsa-backed release (rustc 1.52.1 lesson)
- [ ] P5-10 Fault-tolerant analysis: facts computed for well-formed regions of broken files; LSP features stay live on parse errors (Lean `PartialTermInfo` pattern)
- [ ] P5-11 Resource budgets enforced: RSS ceiling presets + LRU at cap (charter #44), cold-start, idle-CPU ~0, keystroke p95 targets (charter #35 numbers pinned here)
- [ ] P5-12 LSP conformance + multi-client smoke suite: Neovim headless, Helix, Zed alongside VS Code (charter #20)
- [ ] P5-13 JS plugin caching integration (plugin results under content keys with plugin-version salt)
- [ ] P5-14 Phase exit: latency/RSS/idle budgets green on large corpus projects; equivalence green; conformance suite green; cache-hit accounting in perf tests

Key acceptance themes: predictability over adaptivity (no heuristic cache
sizing); every cache has an explicit invalidation reason (doctor
`cache_identity` heritage); "language server ate my RAM" is a named, tested
anti-goal.
