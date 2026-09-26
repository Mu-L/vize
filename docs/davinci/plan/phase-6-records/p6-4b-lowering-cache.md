# P6-4b — Direct foreign lowering and checker reuse

P6-4b remains open. This slice removes two prototype gaps; it does not claim
the typed environment, expression-world exchange or full TS-49 acceptance.

## Lowering

`lower_source_block_with_foreign_expressions` selects the first-party dialect
once for a source block. Authored expressions, handlers, arguments and
same-name shorthand become `ExprRef::Foreign` before projection. Missing
structural positions and merged display text retain their typed escape
contracts. The Vue version capability set remains an independent choice.

The dialect's generic capability adapter supplies simple scope names. It is
bound at entry as one monomorphized function pointer, without a trait object
or a per-node registry lookup; this shares the existing structural walk.
Exact whole identifiers become authored scope bindings. Patterns retain their
scope tag without guessing names. The core does not inspect foreign facts or
add a second language scanner.

The MoonBit projector reuses the lowered payload. Compound display parts keep
their S1 source slices and file-absolute spans. Both committed SFC projections,
capability answers and compiler diagnostic recordings remain byte-identical.
The foreign-lowering test independently pins twelve expression positions,
their language and authored spans, plus page-order loop and slot scope names.

## Checker cache

`CachedMoonc` wraps the toolchain boundary. Its exact key contains `moonc`'s
version, package, virtual file name and complete projected source. Changing
any one independently forces a checker call. Errors and answers with an
inconsistent toolchain version are refused without caching.

The cache is bounded to 32 entries and 4 MiB of input/output text. It evicts
oldest entries before either budget is exceeded; an individually oversized
answer is returned without caching. Tests observe checker call counts for
reuse, each invalidation, retries, entry eviction and the byte limit.

## Reproduction

- `cargo test -p vize_dialect_moonbit --features moonc`
- `cargo clippy -p vize_dialect_moonbit -p vize_s1_to_s2 --all-targets --features vize_dialect_moonbit/moonc -- -D warnings`
- Davinci MoonBit Actions installs the compiler at `.moonbit-version` and runs
  the live compiler fixtures. Default Check runs the toolchain-free suites.

## Remaining acceptance

- Produce a typed `.mbti` environment from S2 scope facts instead of copying
  the authored script as the environment.
- Carry this environment and the analysis through P6-1b's coarse-grained
  expression world and the unified projection model.
- Expand the exact end-to-end matrix over props, refs and composables.
- Complete the `ExprRef` validation report and the required maintainer review.

The expression-world binding record currently carries a name and kind, with
no type signature. A typed environment needs an explicit contract extension
or a reviewed producer that supplies those signatures; the dialect must not
invent them from binding names.
