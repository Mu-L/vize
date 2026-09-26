# P6-4b — Typed MoonBit environments and expression-world exchange

This slice implements an explicit typed producer boundary. P6-4b remains
open until S2's real scope producer supplies these signatures automatically,
the unified projection integration covers the full matrix, and the required
maintainer reviews are recorded.

## Contract

`vize:contracts@0.1.3` adds `typed-expression-dialect`. The existing input,
expression and output worlds keep their record fields and function signatures.
The new world requires `typed-environment@1` beside the existing facts and
projection pages. Its bindings carry the producer's name, kind and MoonBit
signature. Expressions carry their authored bytes, exact span, typed demand
and scope-local bindings. A local shadows a block binding only inside its own
expression; a sibling's local cannot become an exact reference.

The compiled-in `MoonBitTypedGuest` implements this same world. The component
host also carries it in process and out of process, under the existing fuel
and memory limits. The SDK's transport probe observes changed signatures and
local scopes; it retains the existing analysis-page goldens byte for byte.

## Generated environment

Each expression's supplied signatures generate a plain function signature in
`environment.mbti`, and named parameters in its virtual template body. The
native host runs `moonc build-interface`, imports the resulting `.mi`, and
type-checks a call passing those parameters before checking the authored
expression. The script implementation is absent from this typed projection.
Every expression is copied verbatim and linked through the existing unified
projection-page model. Unsupported or missing signatures are refused; the
checker diagnoses unknown types without inventing replacements.

The pinned compiler `0.10.7+bc794d341` refuses non-abstract type declarations
and top-level values in `build-interface` with diagnostic 4157. Consequently
this slice carries typed props, refs, closures/composables, prelude containers
and producer-supplied local scopes. Imported/custom type declarations still
need a reviewed declaration/import producer. The existing script projection
remains available for its broader authored MoonBit examples.

## Checker identity

The bounded cache includes the generated `.mbti` bytes in addition to the
package, virtual file, complete projection and actual compiler version. The
native host hashes the ordered relative names and complete contents of every
core `.mi` at each lookup. A changed dependency in the same directory therefore
invalidates reuse. Scratch paths never identify a result. SHA-256 is provided
by the workspace-pinned `sha2`, enabled only in the `moonc` host feature.
The 32-entry and 4 MiB limits include environment and dependency identity;
failed interface compilation, transport failures and inconsistent versions
are never cached. Dependencies changing during a checker call also refuse
the answer. Relative-name/content tests prove relocation keeps identity while
content and interface-name changes invalidate it.

## Evidence

- Toolchain-free exact `.mbti`, `.mbt`, fact and projection-page fixtures:
  twelve expressions spanning props, refs, composables, six typed demands,
  scope shadowing, closure pessimism and Unicode.
- Pinned native checks: the clean matrix has no diagnostic; field, condition,
  argument-name, handler, statement, composable-call and out-of-scope errors
  map to authored expression spans with committed compiler JSON and results.
- Compiler answers change when only a producer's signature changes.
- Missing signatures, injected scaffolding, imported signatures, duplicate
  bindings/ids and non-exact authored spans are refused explicitly.
- Cache tests keep the virtual source fixed while changing only `.mbti` or
  dependency contents, and cover an oversized interface's uncached answers.
- Frozen 0.1.2 SDK sources and WIT build actual input and expression components.
  Their historical imports/exports are checked, and both worlds exchange exact
  existing pages with the 0.1.3 host in Wasmtime and the sidecar. The old default
  SDK export macro is exercised; archived source hashes are pinned separately.
- The release-surface policy classifies the new world as additive; the
  original MoonBit script fixtures and original WIT page payloads remain
  unchanged. The canonical immutable release JSON is explicitly outside the
  authored-source line ratchet; exact canonical-byte tests remain mandatory
  and a scope test keeps neighboring authored files under the 350-line limit.

## Reproduction

- `cargo test -p vize_dialect_moonbit --features moonc` with the pinned
  `MOON_HOME` (TS-49 / Davinci MoonBit Actions).
- `cargo test -p vize_extension_host --features extension-host --test wit_golden_typed_expression`
  (TS-48 / Davinci Contracts Actions).
- `cargo test -p vize_extension_host --features extension-host --test wit_legacy`
  (compiled 0.1.2 compatibility / Davinci Contracts Actions).
- `cargo test -p vize_extension_host --test contract_surface`.

These are repository-owned typed-producer and transport fixtures. They do not
stand in for independent third-party validation, an automatic S2 signature
producer or the maintainer's hosting acceptance.
