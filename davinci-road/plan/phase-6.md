# Phase 6 — Extension Contracts GA (provisional decomposition)

> [!WARNING]
> Provisional; re-cut at phase-5 exit.

## TODO index

- [ ] P6-1 WIT worlds for the three contracts (input dialect, expression dialect, output target) with the capability handshake (protocol version + feature strings) and a **written compatibility policy** (Swift-macro lesson)
- [ ] P6-2 Prebuilt, versioned extension SDK artifacts from day one (the Swift build-time-crisis countermeasure); coarse-grained interfaces only (canonical-ABI copy cost)
- [ ] P6-3 In-process wasmtime hosting lane (feature-gated per charter #39) sharing the out-of-process contract
- [ ] P6-4 MoonBit expression dialect (charter #28): pinned `moonc.wasm` in wasmtime over a virtual FS; generated `.mbti` binding environment; projected `.mbt` bodies; span-mapped diagnostics; moonc version in fact cache keys
- [ ] P6-5 `ExprRef` abstraction validation report from P6-4 — budgeted review time for abstraction fixes discovered by the second implementation
- [ ] P6-6 Volt (Elixir) non-JS host target exercise against the output-target contract
- [ ] P6-7 JS plugin SDK GA (charter #29, all four families): batched napi execution, per-plugin cost attribution, content-keyed caching; validated by real-world custom rules
- [ ] P6-8 Contract versioning: marquette-style canonical serialization + additive/breaking classification; semver policy documented
- [ ] P6-9 External-consumer validation: at least one third party builds against a tagged release without patching vize internals
- [ ] P6-10 Davinci completion metrics review (charter #35): pinned numbers vs achieved, published in the go/no-go input
- [ ] P6-11 v1 alpha go/no-go input package (charter #24): parity matrices, budgets, ledgers, conformance results
- [ ] P6-12 Communications decision revisit (charter #45) — review point
- [ ] P6-13 Phase exit: contracts documented + externally validated; JS rule cached and cost-attributed in production use; completion metrics reconciled

Key acceptance themes: the contracts are only "GA" when a stranger has built
against them; MoonBit is the proof for expressions, Volt for targets,
user-land JS rules for the plugin tier.
