# The Davinci `no_std` boundary

> [!NOTE]
> The P2-14 audit: which crates the `no_std` claim covers, which dependency
> edges are accepted as `std`, and what the required wasm32-wasip2 lanes
> (TS-24) actually prove. **The maintainer approves the boundary** — this doc
> is the artifact under review; growing or shrinking it is a review point, not
> an edit.

## The claim, stated precisely

The claim covers **exactly two crates**: `vize_davinci` and `vize_disegno`.
Both are `#![no_std]` + `extern crate alloc` from birth (P2-1, P2-5a), so
their own source names only `core`, `alloc`, and their dependencies' public
paths — a direct `std::` use stops compiling. That attribute is the `no_std`
half of the claim; the TS-24 lane is the half that keeps it meaningful on a
32-bit target.

What the claim is **not**:

- It is not a std-less _link_. wasm32-wasip2 ships a full `std`, and the two
  crates' dependency closure still links it through the accepted edges below.
  A std-less target (or a `panic_handler`-providing embedded build) is nobody's
  requirement today and is explicitly out of scope (the P2-14 non-goal).
- It does not cover `vize_carton`, which "defines and bridges std types"
  by charter (its own `lib.rs` says so) and is `std` on purpose.
- It does not cover the `davinci-opt` **bin target** of `vize_davinci`
  (`src/bin/davinci-opt.rs`): a host tool that reads files and exits with
  codes, `std` by design. `cargo build --target wasm32-wasip2` compiles it
  too — it builds because wasip2 has `std`, not because it is `no_std`.

## Accepted `std` edges

| edge                                   | nature                   | why it is accepted                                                                                                                                                                                                 |
| -------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `vize_davinci` → `vize_davinci_derive` | proc-macro, host-only    | Runs at build time, never linked into any target. Generated code names only `::core` and `vize_davinci` support paths, so it compiles inside the `no_std` crate (measured at P2-4; record § "The host `std` edge") |
| `vize_davinci` → `vize_carton`         | library dependency       | The single library `std` edge. Carton is the arena/string/interner substrate and bridges `std` types by charter; both crates consume it through re-exports (`vize_carton::{Box, Vec, String, FxHashMap}`)          |
| `vize_disegno` → `vize_carton`         | library dependency       | Same edge, same acceptance                                                                                                                                                                                         |
| `davinci-opt` bin target               | host CLI in the same pkg | `std::{fs, io, env, process}` by design; the round-trip driver TS-16/TS-17 run. The **lib** target is where the claim lives                                                                                        |

One re-export deserves its own line: `vize_carton::FxHashMap` is
`rustc_hash::FxHashMap`, which aliases **`std::collections::HashMap`** with
the Fx hasher. The folio map sections (`crates/vize_davinci/src/folio/page.rs`)
hold that type without naming `std`, which is exactly how a `no_std` crate is
allowed to lean on a `std` dependency — the type crosses the boundary, the
path does not. Anyone auditing "does `vize_davinci` use `std`?" by grepping
for `std::` must know the honest answer is "not by path; yes by type,
through the accepted carton edge."

## The dependency ledger

`cargo tree -p vize_davinci -p vize_disegno --edges normal` has exactly four
first-degree edges: the three library edges above plus
`vize_disegno` → `vize_davinci`. Every third-party crate reaches the two
crates through `vize_carton`. Dispositions for carton's direct dependencies,
from each crate's own `src/lib.rs` marker at the locked version:

| dependency        | marker at locked version                | disposition                                                                                         |
| ----------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `bitflags` 2.13   | `cfg_attr(not(any(std, test)), no_std)` | `no_std + alloc` capable                                                                            |
| `compact_str` 0.9 | `#![no_std]`                            | `no_std + alloc` capable (carton's `String` alias)                                                  |
| `once_cell` 1.21  | `cfg_attr(not(std), no_std)`            | capable behind its feature seam                                                                     |
| `oxc_allocator`   | none (rev `fc702c1f`)                   | **`std`** — see the oxc note below                                                                  |
| `oxc_syntax`      | none (rev `fc702c1f`)                   | **`std`**, and pulls `oxc_span`/`oxc_str`/`oxc_estree`/`oxc-miette`, none of which declare `no_std` |
| `phf` 0.13        | `cfg_attr(not(std), no_std)`            | capable (the interner's well-known table)                                                           |
| `pklrust` 0.9     | none                                    | **`std`** — msgpack/serde_json plumbing                                                             |
| `rustc-hash` 2.1  | `#![no_std]`                            | core is capable; the `FxHashMap` **type** needs its `std` feature (enabled here) — see above        |
| `serde` 1.0       | `cfg_attr(not(std), no_std)`            | capable behind its feature seam                                                                     |
| `serde_json` 1.0  | `#![no_std]`                            | capable behind its `alloc` seam                                                                     |
| `smallvec` 1.15   | `#![no_std]`                            | capable                                                                                             |
| `stacker` 0.1     | none                                    | **`std` by nature** — stack growth over `libc`/`psm`                                                |
| `which` 8.0       | none                                    | **`std` by nature** (filesystem), and already `cfg`'d out of every `wasm32` target in carton        |
| `xxhash-rust` 0.8 | `#![no_std]`                            | capable                                                                                             |

Named by the plan but **not in the two crates' closure**:

- `lightningcss` 1.0.0-alpha.72 — no marker, `std`; it lives on the CSS side
  (`vize_atelier_sfc` and friends) and never reaches these crates.
- `rayon` 1.12 — `std` by nature (threads); not in the closure.
- `salsa` — the plan lists it as a resident-tier `std` dependency, but it is
  **not in `Cargo.lock` at all today** (0 occurrences). Nothing to accept yet;
  when the resident tier adopts it, it joins the `std`-bound list without
  touching this boundary.

**The oxc note.** The plan's audit step reads as if the oxc crates "genuinely
support `no_std + alloc`". Measured at the pinned rev `fc702c1f`: **none of
the six oxc crates in the closure carry a `no_std` marker** (`oxc_allocator`,
`oxc_syntax`, `oxc_span`, `oxc_str`, `oxc_estree`, `oxc_data_structures`).
They compile for wasm32-wasip2 — which is all the lane requires — but a future
std-less target would need upstream `no_std` work or carton isolating them.
This is the audit correcting the plan's expectation, not a defect in either.

## Feature seams

Neither `vize_davinci` nor `vize_disegno` has a `[features]` section, so the
lane's `--no-default-features` build is **vacuous today** — measured directly:
the second lane build is a no-op rebuild of the first (0.13s, no recompiled
crates), because feature resolution produces the identical graph.

The audit's answer to "what seam should the crates grow": **none yet.** A
`std` feature would invert the design (the crates are unconditionally
`no_std`; there is no optional `std` half to gate), and a speculative seam is
the decorative flag the contract warns about. The flag stays in the lane
anyway, deliberately: the day either crate grows its first real seam (the
plausible candidates are a serde/folio-IO convenience or a P2-3-style
observer feature), the feature-off build is already required, and nobody has
to remember to add it.

## What the 32-bit lane exercises

wasm32-wasip2 is the phase's only 32-bit required target, so it is what makes
the `#[cfg(target_pointer_width = "64")]` guards prove their purpose
(phase-2.md provisional-review point 7):

- **Guarded asserts — compiled out on this lane, and that is the point.**
  `vize_davinci`: `PassDesc == 32` (`src/pass.rs:136`), `Diagnostic == 88` and
  `DiagnosticPart == 40` (`src/diagnostic.rs:193-196`). `vize_disegno`: the
  fifteen node-size asserts across `src/op.rs:149` and
  `src/op/{element,text,control,slot,model,vue}.rs`. All are 64-bit footprints
  of pointer-bearing structs; at 4-byte pointers the figures are simply wrong,
  so an **unguarded** pointer-dependent assert breaks this lane by
  construction. The lane is the standing proof the guards are load-bearing.
- **Deliberately unguarded asserts — evaluated on this lane.**
  `NodeId == 4` and `Option<NodeId> == 4` (`vize_davinci/src/id.rs:39-40`)
  carry no guard because they hold a `u32` and no pointer; the niche property
  is target-independent, and the 32-bit lane checking it is, per the comment
  at the assert site, "the property most worth checking there".

## The lanes

TS-24 rides `.github/workflows/check.yml` as two builds in one step of the
**`clippy-and-test`** job (step "Davinci no_std portability lanes (TS-24)"):

```sh
cargo build -p vize_davinci -p vize_disegno --target wasm32-wasip2
cargo build -p vize_davinci -p vize_disegno --target wasm32-wasip2 --no-default-features
```

- **Required**: `clippy-and-test` is unconditional and sits in `test-report`'s
  `needs:` list — the required status check
  (`tools/github/require-needs-success.mjs`). Placement, target install, and
  the exact commands are pinned by
  `tests/tooling/davinci-portability-lane.test.ts`, which also pins the
  `#![no_std]`/`extern crate alloc` attributes on both crates.
- **Not a standalone job**: check.yml is over the 350-line ratchet
  (`tools/moon/cmd/source_file_lengths`), which forbids the file growing; the
  step extension landed net-zero. The full-CLI lane stays `std` and is simply
  the rest of the same job (clippy + `cargo test --workspace`).
- **The target install is the machine recipe**: `dtolnay/rust-toolchain`'s
  `targets: wasm32-wasip2` input, i.e. rustup's own `rust-std` component.

Growing the claim to a new crate means: the attribute pair in its `lib.rs`,
`-p <crate>` in both lane commands, its edges in this ledger, and the pin
test's crate list — then maintainer review of the new boundary.

## Local reproduction

The nix flake's Rust carries only `wasm32-unknown-unknown`; no rustup is
involved locally, so `targets:` has no local equivalent. The P2-4/P2-14
workaround: unpack the upstream `rust-std-1.95.0-wasm32-wasip2` component
built for the same rustc commit as the flake's toolchain (`59807616e`), lay
it over a sysroot whose other entries symlink the nix toolchain, and point
rustc at it:

```sh
RUSTFLAGS="--sysroot <overlay>" cargo build -p vize_davinci -p vize_disegno \
  --target wasm32-wasip2
```

This is measurement-grade only (it is what "green" was verified with before
CI ran the lane); CI must never need it, which is what the pin test's
`targets:` assertion holds.

## Docs truth

Per the P1-12 precedent, `docs/content/**` carried no `no_std` claim before
this audit (grep empty at landing). With the boundary approved, the claim may
be made in docs for exactly the two crates — phrased as this doc phrases it:
`no_std` source over accepted `std` edges, not a std-less artifact.
