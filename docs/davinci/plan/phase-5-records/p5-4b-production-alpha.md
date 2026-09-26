# P5-4b — Production alpha publication and imported-component consumers

Contract: [P5-4b](../phase-5-tasks.md#p5-4b--summary-firewalls-durability-and-memory-bounds).

## Production path

Maestro's imported-component completion, hover and required-prop diagnostics
read component metadata through the existing shared component cache. That
consumer now requests the resident interface, exports the current descriptor's
resolved Croquis facts, publishes them outside Salsa queries, and decodes the
prop/slot contracts served by `sfc_summary`. There is one export per changed
source, filename or project configuration. Equal metadata reuses the existing
shared snapshot after a body edit. Template facts and slot outlets share one
parsed template tree.

The document manager retains each provider's `SummaryInput`. A source edit and
fresh alpha publication happen before its consumer read. Type-checker config
reloads and watched dependency notifications invalidate every provider; each
is refreshed before its next read. The TypeScript configuration stamp has HIGH
durability. Source buffers and alpha updates retain LOW durability. Filename
changes participate in the source stamp because they affect resolution.
Rejected parses or exports return no interface for that revision. Closing a
document releases its alpha entries and replaces the memo with an empty surface;
reopening exports again. No tracked query mutates Salsa inputs.

## Versioned production contracts

`Croquis::ALPHA_CONTRACT_SCHEMA` and `croquis::alpha::ALPHA_CONTRACT_SCHEMA` are
version 1. Every production contract requires `schema: 1`; typed deserialization
rejects missing, wrong and noninteger versions. This version describes the
Croquis JSON payload inside the generic AlphaPages contract strings. It does not
change the generic summary/facet folio versions or accept a bare type spelling
as a production JSON contract.

| Facet      | Canonical production contract                                                                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Signature  | component identity, declared name, generic parameters, component/API shape, exact macro type arguments, exposed names/types/completeness, reachable type environment |
| Prop       | authored name, nullable type, nullable required flag, exact nullable default expression, nullable model modifier type, reachable type environment                    |
| Emit       | authored name and nullable payload type, including model update events, reachable type environment                                                                   |
| Slot       | declared/outlet name and nullable props type, reachable type environment                                                                                             |
| Reactivity | public name, nullable type, authoritative kind/class/verdict/effects, reachable type environment                                                                     |
| Component  | resolved module specifier and exported identity, independent of a local alias                                                                                        |

JSON field order and declaration order are deterministic. Contract names retain
their original spelling; a folio-unsafe identity is encoded injectively. Type
literal whitespace and default expressions are preserved exactly. Null means
the analyzer has no fact. Private state, declaration offsets, function bodies
and template expression text never enter the payload. Template-only outlet
props remain unknown. Explicit exposed aliases resolve to their actual local
binding before reading the authoritative reactivity facts.

Reachable type declarations participate in their own consumer's fingerprint,
so editing a public type alias changes the used prop/emit/slot/public-instance
contract. Unused private aliases do not participate. The payload records
resolution completeness; unresolved or inferred types are not claimed exact.
Macro type arguments remain in the signature conservatively until extraction
can prove completeness, so some interface edits also invalidate the signature.

## Verification gates

- Croquis exporter tests cover all six facets, literal spaces, alias identity,
  defaults/models/generics/unknowns, body/offset edits and strict versions.
- Resident production tests pin one export per revision, unchanged declaration
  fingerprints after body edits, prop-only changes, lazy config refresh,
  rejected revisions, close and rename.
- Maestro compares full prop and slot metadata values against the previous
  direct Croquis projection across script setup, Options API and legacy options.
  Alpha declarations give completion entries stable name order; type, required,
  default and slot-prop values stay equal. A body edit reuses the same shared
  metadata snapshot; a prop edit replaces it. The actual `component_surface`
  Salsa consumer executes 1/0/0/1 times for first read, body edit, unchanged
  read and prop edit; corresponding reuse counts are 0/1/1/0.
- TS-42 uses this production exporter over the three hydrated corpus projects
  and both committed fixture directories, comparing every interface with the
  clean projection. Body edits use the SFC parser's template span. Controlled
  interface scripts use OXC type-member spans and validate the edited program.
  Prop, emit and exposed-type edits keep unrelated declaration fingerprints.
  The incremental workflow runs the corpus gate explicitly.

## Remaining acceptance

P5-4b remains open until the full production LSP/Corsa process-tree scale probe
and its recorded resource preset pass. The existing isolated 10k-file probe
uses synthetic alpha pages. Its RSS result and the nine-file production LSP
baseline are separate evidence; neither proves the full production 10k session.
This slice does not claim all Maestro requests consume semantic alpha pages:
the production consumer wired here is imported-component metadata.
