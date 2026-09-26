<!-- GENERATED FILE — do not edit by hand.
     Regenerate: rust-script tools/commands/davinci/croquis-consumers.rs --write
     Verify:     rust-script tools/commands/davinci/croquis-consumers.rs --check -->

# Croquis consumption: `vize_atelier_sfc`

One shard of the [Croquis consumption matrix](../croquis-consumption.md): every fact the matrix records about `crates/vize_atelier_sfc/src`. The method and the product set live on that page.

## Resolved product sites

| product                     | kind  | module    | files | sites |
| --------------------------- | ----- | --------- | ----: | ----: |
| `BindingMetadata`           | type  | `croquis` |    12 |    31 |
| `Croquis`                   | type  | `croquis` |     7 |    17 |
| `Drawer`                    | type  | `drawer`  |     2 |     7 |
| `DrawerOptions`             | type  | `drawer`  |     1 |     5 |
| `ScopeKind`                 | type  | `scope`   |     1 |     2 |
| `Croquis.binding_spans`     | field | `croquis` |     1 |     1 |
| `Croquis.bindings`          | field | `croquis` |     6 |    16 |
| `Croquis.import_statements` | field | `croquis` |     1 |     2 |
| `Croquis.macros`            | field | `croquis` |     4 |    12 |
| `Croquis.scopes`            | field | `croquis` |     1 |     2 |
| `Croquis.types`             | field | `croquis` |     2 |     4 |

## Non-product `vize_croquis` imports

| item                                      | files | sites |
| ----------------------------------------- | ----: | ----: |
| `BindingType`                             |    17 |   131 |
| `BlockLocation`                           |     5 |     7 |
| `DEFINE_EMITS`                            |     1 |     2 |
| `DEFINE_EXPOSE`                           |     1 |     1 |
| `DEFINE_MODEL`                            |     1 |     1 |
| `DEFINE_OPTIONS`                          |     1 |     1 |
| `DEFINE_PROPS`                            |     1 |     1 |
| `DEFINE_SLOTS`                            |     1 |     1 |
| `EmitDefinition`                          |     1 |     1 |
| `ModelDefinition`                         |     1 |     1 |
| `PadOption`                               |     1 |     1 |
| `PropDefinition`                          |     2 |     4 |
| `ResolvedTypeWorld`                       |     1 |     3 |
| `ScriptParseResult`                       |     1 |     1 |
| `ScriptParserOptions`                     |     1 |     1 |
| `SfcCustomBlock`                          |     2 |     2 |
| `SfcDescriptor`                           |    16 |    38 |
| `SfcError`                                |    21 |    60 |
| `SfcParseOptions`                         |    14 |   116 |
| `SfcScriptBlock`                          |     2 |     2 |
| `SfcStyleBlock`                           |     5 |     7 |
| `SfcTemplateBlock`                        |     6 |     7 |
| `TypeDeclaration`                         |     1 |     3 |
| `TypeDeclarationKind`                     |     1 |     2 |
| `TypeExportBinding`                       |     2 |     8 |
| `TypeImport`                              |     1 |     1 |
| `TypeLookup`                              |     1 |    13 |
| `TypeModule`                              |     2 |     7 |
| `TypeModuleReference`                     |     2 |     3 |
| `UnknownTypeReason`                       |     1 |     1 |
| `WITH_DEFAULTS`                           |     1 |     1 |
| `analyze_script_setup_program`            |     1 |     1 |
| `artifact_macro_names`                    |     1 |     1 |
| `extract_and_transform_v_bind`            |     1 |     1 |
| `extract_and_transform_v_bind_with_scope` |     1 |     1 |
| `find_matching_paren`                     |     1 |     1 |
| `is_builtin_component`                    |     1 |     1 |
| `is_builtin_macro`                        |     2 |     2 |
| `is_global_allowed`                       |     1 |     1 |
| `is_runtime_erased_macro`                 |     1 |     1 |
| `macro_artifact_kind`                     |     1 |     3 |
| `parse_script_setup`                      |     1 |     2 |
| `parse_script_with_options_and_jsx`       |     1 |     1 |
| `parse_sfc`                               |     1 |     1 |
| `prod_scoped_v_bind_name`                 |     1 |     1 |
| `runtime_erased_macro_names`              |     3 |     5 |
| `scoped_v_bind_name`                      |     1 |     1 |

## Naive grep disagreements (resolved/grep)

| product             | resolved | grep |
| ------------------- | -------: | ---: |
| `BindingMetadata`   |       31 |   51 |
| `BlockKind`         |        0 |   10 |
| `Croquis`           |       17 |   43 |
| `Drawer`            |        7 |    9 |
| `DrawerOptions`     |        5 |    6 |
| `ReactivityTracker` |        0 |    1 |
| `Scope`             |        0 |    6 |
| `ScopeKind`         |        2 |    3 |
| `Span`              |        0 |    9 |
| `Symbol`            |        0 |    5 |
| `SymbolFlags`       |        0 |    5 |
| `Croquis.bindings`  |       16 |  229 |
| `Croquis.hoists`    |        0 |    2 |
| `Croquis.macros`    |       12 |  107 |
| `Croquis.types`     |        4 |   16 |
