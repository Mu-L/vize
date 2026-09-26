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
