# P5-4b production exposure producer

Croquis now populates `MacroTracker.exposes()` from the retained OXC program of
script setup. The pass runs after all declarations have been collected, without
parsing script text again. This supplies the public-instance portion of the
production AlphaPages exporter; it does not close the full resident acceptance.

## Contract

- `ExposeDefinition` keeps its existing public fields, `name` and `expose_type`.
- `expose_bindings()` records the public name, resolved local binding, and exact
  declaration identifier span. Consumers match both name and span against the
  authoritative `Reactivity` source rows and their lattice verdicts.
- Local macro shadowing is resolved lexically, including later declarations.
  Nested function calls do not declare the component's public instance.
- Static string keys and property aliases are supported. Duplicate names use
  the last value. A non-computed `__proto__` initializer changes the object's
  prototype and is not an exposed own property.
- Spreads, dynamic keys, unknown arguments, type-only declarations, unsupported
  call positions, and duplicate macro calls mark `expose_is_complete()` false.
  An unknown override removes claims about properties written before it.
- Authored annotations preserve literal whitespace. Fully annotated function
  signatures omit bodies and default-value expressions. Inferred types,
  accessors, and const assertions remain unknown. Named annotations are written
  types, not resolved TypeScript interfaces; consumers must retain that limit.

## Evidence

Five producer tests cover UTF-8 declaration spans, aliases and unresolved
references, actual Drawer-to-lattice integration, final-property precedence,
unknown overrides, macro shadowing, typed signatures, and body-edit stability.
The Croquis library suite passes 379 tests. CI verifies workspace integration.
