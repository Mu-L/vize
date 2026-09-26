use crate::croquis::{SfcCroquisOptions, analyze_sfc_descriptor_resolved};
use crate::{SfcParseOptions, parse_sfc};
use vize_croquis::types::TypeLookup;

fn analyze(source: &str, filename: &str) -> vize_croquis::Croquis {
    let descriptor = parse_sfc(source, SfcParseOptions::default()).unwrap();
    analyze_sfc_descriptor_resolved(
        &descriptor,
        None,
        SfcCroquisOptions::full(),
        false,
        false,
        filename,
    )
    .croquis
}

fn props(croquis: &vize_croquis::Croquis) -> Vec<(&str, bool, Option<&str>)> {
    croquis
        .macros
        .props()
        .iter()
        .map(|prop| (prop.name.as_str(), prop.required, prop.prop_type.as_deref()))
        .collect()
}

#[test]
fn actual_import_alias_expands_fields_with_their_foreign_type_scope() {
    let dir = tempfile::tempdir().unwrap();
    let api = dir.path().join("types.ts");
    let filename = dir.path().join("App.vue");
    let source = "<script setup lang='ts'>import type { Public as Alias } from './types'; type Helper = boolean; defineProps<Alias>()</script>";
    for body in ["string", "number"] {
        std::fs::write(
            &api,
            vize_carton::cstr!("type Helper = {body}; export type Public = {{ value: Helper }}"),
        )
        .unwrap();
        let croquis = analyze(source, filename.to_str().unwrap());
        assert_eq!(props(&croquis), vec![("value", true, Some("Helper"))]);
        assert_eq!(croquis.types.resolved_props_complete(), Some(true));
        let module = api.canonicalize().unwrap();
        assert_eq!(croquis.types.resolved_prop_module("value"), module.to_str());
        let world = croquis.types.resolved_world().unwrap();
        let TypeLookup::Found(helper) = world.resolve(module.to_str().unwrap(), "Helper") else {
            panic!("field type resolves in the foreign module")
        };
        assert_eq!(world.declaration(&helper).unwrap().body.as_str(), body);
        let TypeLookup::Found(root_helper) = world.resolve(&world.root_module, "Helper") else {
            panic!("root helper remains separate")
        };
        assert_eq!(world.declaration(&root_helper).unwrap().body, "boolean");
    }
}

#[test]
fn actual_imported_interface_inherits_foreign_names_and_not_root_collisions() {
    let dir = tempfile::tempdir().unwrap();
    let api = dir.path().join("types.ts");
    std::fs::write(&api, "interface Helper { external: number }; export interface Public extends Helper { own?: string }").unwrap();
    let source = "<script setup lang='ts'>import type { Public as Alias } from './types'; interface Helper { captured: boolean }; defineProps<Alias>()</script>";
    let filename = dir.path().join("App.vue");
    let croquis = analyze(source, filename.to_str().unwrap());
    assert_eq!(
        props(&croquis),
        vec![
            ("external", true, Some("number")),
            ("own", false, Some("string"))
        ]
    );
    assert_eq!(croquis.types.resolved_props_complete(), Some(true));
    let module = api.canonicalize().unwrap();
    assert_eq!(
        croquis.types.resolved_prop_module("external"),
        module.to_str()
    );
}

#[test]
fn unresolved_inheritance_keeps_known_fields_and_marks_the_catalog_incomplete() {
    let dir = tempfile::tempdir().unwrap();
    std::fs::write(dir.path().join("types.ts"), "import type { Missing } from './missing'; export interface Public extends Missing { known: string }").unwrap();
    let source = "<script setup lang='ts'>import type { Public as Alias } from './types'; interface Missing { guessed: boolean }; defineProps<Alias>()</script>";
    let filename = dir.path().join("App.vue");
    let croquis = analyze(source, filename.to_str().unwrap());
    assert_eq!(props(&croquis), vec![("known", true, Some("string"))]);
    assert_eq!(croquis.types.resolved_props_complete(), Some(false));
}

#[test]
fn generic_shape_binders_never_capture_a_same_named_type_declaration() {
    let dir = tempfile::tempdir().unwrap();
    std::fs::write(
        dir.path().join("types.ts"),
        "type T = { guessed: boolean }; export type Public<T> = T & { known: number }",
    )
    .unwrap();
    let source = "<script setup lang='ts'>import type { Public as Alias } from './types'; defineProps<Alias<{ actual: string }>>()</script>";
    let filename = dir.path().join("App.vue");
    let croquis = analyze(source, filename.to_str().unwrap());
    assert_eq!(props(&croquis), vec![("known", true, Some("number"))]);
    assert_eq!(croquis.types.resolved_props_complete(), Some(false));
}

#[test]
fn generic_field_projection_keeps_authored_types_identical_to_the_legacy_context() {
    let dir = tempfile::tempdir().unwrap();
    std::fs::write(
        dir.path().join("types.ts"),
        "export type Public<T> = { value: T }",
    )
    .unwrap();
    let filename = dir.path().join("App.vue");
    let script = "import type { Public } from './types'; defineProps<Public<string>>()";
    let mut legacy = crate::script::ScriptCompileContext::new(script);
    legacy.collect_imported_types_from_path(script, filename.to_str().unwrap(), true);
    legacy.analyze();
    let legacy_props = legacy.resolve_type_props("Public<string>");
    let legacy_projection: Vec<_> = legacy_props
        .iter()
        .map(|prop| (prop.name.as_str(), prop.required, prop.prop_type.as_deref()))
        .collect();
    assert_eq!(legacy_projection, vec![("value", true, Some("T"))]);
    let source = vize_carton::cstr!("<script setup lang='ts'>{script}</script>");
    let croquis = analyze(&source, filename.to_str().unwrap());
    assert_eq!(props(&croquis), legacy_projection);
    assert_eq!(croquis.types.resolved_props_complete(), Some(true));
}

#[test]
fn scoped_numeric_property_names_use_the_cooked_key_and_inline_catalog_is_complete() {
    let ctx = crate::script::ScriptCompileContext::new(
        "defineProps<{ 0x2a: string; normal?: boolean }>()",
    );
    let world = ctx.resolve_type_world("App.vue", None);
    let properties = world.resolve_properties("{ 0x2a: string; normal?: boolean }");
    let projection: Vec<_> = properties
        .properties
        .iter()
        .map(|prop| {
            (
                prop.name.as_str(),
                !prop.optional,
                prop.prop_type.as_deref(),
            )
        })
        .collect();
    assert_eq!(
        projection,
        vec![
            ("42", true, Some("string")),
            ("normal", false, Some("boolean"))
        ]
    );
    assert!(properties.complete);
}

#[test]
fn scoped_numeric_keys_follow_javascript_exponent_thresholds() {
    let ctx = crate::script::ScriptCompileContext::new(
        "defineProps<{ 0x2a: string; 1.50: string; 1e20: string; 1e21: string; 1e-6: string; 1e-7: string; 0: string }>()",
    );
    let world = ctx.resolve_type_world("App.vue", None);
    let properties = world.resolve_properties("{ 0x2a: string; 1.50: string; 1e20: string; 1e21: string; 1e-6: string; 1e-7: string; 0: string }");
    let names: Vec<_> = properties
        .properties
        .iter()
        .map(|prop| prop.name.as_str())
        .collect();
    assert_eq!(
        names,
        vec![
            "42",
            "1.5",
            "100000000000000000000",
            "1e+21",
            "0.000001",
            "1e-7",
            "0"
        ]
    );
    assert!(properties.complete);
    let croquis = analyze(
        "<script setup lang='ts'>withDefaults(defineProps<{ 0x2a?: number; 1.50?: number; 1e20?: number; 1e21?: number; 1e-6?: number; 1e-7?: number; 0?: number }>(), { 0x2a: 1, 1.50: 2, 1e20: 3, 1e21: 4, 1e-6: 5, 1e-7: 6, 0: 7 })</script>",
        "App.vue",
    );
    let actual: Vec<_> = croquis
        .macros
        .props()
        .iter()
        .map(|prop| {
            (
                prop.name.as_str(),
                prop.required,
                prop.prop_type.as_deref(),
                prop.default_value.as_deref(),
            )
        })
        .collect();
    assert_eq!(
        actual,
        vec![
            ("42", false, Some("number"), Some("1")),
            ("1.5", false, Some("number"), Some("2")),
            ("100000000000000000000", false, Some("number"), Some("3")),
            ("1e+21", false, Some("number"), Some("4")),
            ("0.000001", false, Some("number"), Some("5")),
            ("1e-7", false, Some("number"), Some("6")),
            ("0", false, Some("number"), Some("7"))
        ]
    );
}
