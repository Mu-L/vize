#![expect(
    clippy::disallowed_types,
    reason = "tests construct shared immutable editor source snapshots"
)]

use super::super::ScriptCompileContext;
use crate::croquis::{SfcCroquisOptions, analyze_sfc_descriptor_resolved_with_sources};
use crate::script::TypeSourceSnapshot;
use crate::{SfcParseOptions, parse_sfc};
use std::sync::Arc;
use vize_croquis::types::{ResolvedTypeWorld, TypeLookup};

fn body(world: &ResolvedTypeWorld, name: &str) -> vize_carton::String {
    let TypeLookup::Found(id) = world.resolve(&world.root_module, name) else {
        panic!("public imported type must resolve")
    };
    world.declaration(&id).unwrap().body.clone()
}

#[test]
fn unsaved_external_props_names_and_public_emit_expose_aliases_override_saved_text() {
    let dir = tempfile::tempdir().unwrap();
    let api = dir.path().join("api.ts");
    std::fs::write(&api, "export interface Props { saved: string }; export type Public = { label: string }; export type Events = { change: [Public] }").unwrap();
    let source = "<script setup lang='ts'>import type { Props, Public, Events } from './api'; defineProps<Props>(); defineEmits<Events>(); const item: Public = {} as Public; defineExpose({ item })</script>";
    let descriptor = parse_sfc(source, SfcParseOptions::default()).unwrap();
    let filename = dir.path().join("App.vue");
    let before_sources = TypeSourceSnapshot::new([(
        api.clone(),
        Arc::<str>::from(
            "export interface Props { unsaved: number }; export type Public = { label: number }; export type Events = { change: [Public] }; type Private = string",
        ),
    )]);
    let before = analyze_sfc_descriptor_resolved_with_sources(
        &descriptor,
        None,
        SfcCroquisOptions::full(),
        false,
        false,
        filename.to_str().unwrap(),
        &before_sources,
    );
    let props: Vec<_> = before
        .croquis
        .macros
        .props()
        .iter()
        .map(|prop| (prop.name.as_str(), prop.required, prop.prop_type.as_deref()))
        .collect();
    assert_eq!(props, vec![("unsaved", true, Some("number"))]);
    let world = before.croquis.types.resolved_world().unwrap();
    assert_eq!(body(world, "Public"), "{ label: number }");
    assert_eq!(body(world, "Events"), "{ change: [Public] }");
    let after_sources = TypeSourceSnapshot::new([(
        api.clone(),
        Arc::<str>::from(
            "export interface Props { renamed: boolean }; export type Public = { label: boolean }; export type Events = { change: [Public] }; type Private = number",
        ),
    )]);
    let after = analyze_sfc_descriptor_resolved_with_sources(
        &descriptor,
        None,
        SfcCroquisOptions::full(),
        false,
        false,
        filename.to_str().unwrap(),
        &after_sources,
    );
    let props: Vec<_> = after
        .croquis
        .macros
        .props()
        .iter()
        .map(|prop| (prop.name.as_str(), prop.required, prop.prop_type.as_deref()))
        .collect();
    assert_eq!(props, vec![("renamed", true, Some("boolean"))]);
    assert_eq!(
        body(after.croquis.types.resolved_world().unwrap(), "Public"),
        "{ label: boolean }"
    );
    assert_eq!(
        std::fs::read_to_string(&api).unwrap(),
        "export interface Props { saved: string }; export type Public = { label: string }; export type Events = { change: [Public] }"
    );
    let closed = analyze_sfc_descriptor_resolved_with_sources(
        &descriptor,
        None,
        SfcCroquisOptions::full(),
        false,
        false,
        filename.to_str().unwrap(),
        &TypeSourceSnapshot::default(),
    );
    let props: Vec<_> = closed
        .croquis
        .macros
        .props()
        .iter()
        .map(|prop| (prop.name.as_str(), prop.required, prop.prop_type.as_deref()))
        .collect();
    assert_eq!(props, vec![("saved", true, Some("string"))]);
}

#[test]
fn one_publication_keeps_world_and_compatibility_props_on_the_same_disk_snapshot() {
    let dir = tempfile::tempdir().unwrap();
    let api = dir.path().join("api.ts");
    let filename = dir.path().join("App.vue");
    let source = "import type { Props } from './api'; defineProps<Props>()";
    std::fs::write(&api, "export interface Props { first: string }").unwrap();
    let snapshot = TypeSourceSnapshot::default();
    let mut ctx = ScriptCompileContext::new(source);
    let world =
        ctx.resolve_type_world_with_sources(filename.to_str().unwrap(), None, false, &snapshot);
    std::fs::write(&api, "export interface Props { later: number }").unwrap();
    ctx.collect_imported_types_from_path_with_sources(
        source,
        filename.to_str().unwrap(),
        true,
        &snapshot,
    );
    ctx.analyze();
    let props = ctx.resolve_type_props("Props");
    let props: Vec<_> = props
        .iter()
        .map(|prop| (prop.name.as_str(), prop.required, prop.prop_type.as_deref()))
        .collect();
    assert_eq!(props, vec![("first", true, Some("string"))]);
    assert_eq!(body(&world, "Props"), "{ first: string }");
    let fresh = TypeSourceSnapshot::default();
    let fresh_world =
        ctx.resolve_type_world_with_sources(filename.to_str().unwrap(), None, false, &fresh);
    assert_eq!(body(&fresh_world, "Props"), "{ later: number }");
}

#[test]
fn unsaved_new_module_and_unsaved_barrel_alias_resolve_without_creating_disk_files() {
    let dir = tempfile::tempdir().unwrap();
    let source = "import type { Props } from './barrel'; defineProps<Props>()";
    let sources = TypeSourceSnapshot::new([
        (
            dir.path().join("barrel.ts"),
            Arc::<str>::from("export type { Props } from './api'"),
        ),
        (
            dir.path().join("api.ts"),
            Arc::<str>::from(
                "export interface Props { value: Public }; export type Public = { label: number }",
            ),
        ),
    ]);
    let filename = dir.path().join("App.vue");
    let mut ctx = ScriptCompileContext::new(source);
    ctx.collect_imported_types_from_path_with_sources(
        source,
        filename.to_str().unwrap(),
        true,
        &sources,
    );
    ctx.analyze();
    let props = ctx.resolve_type_props("Props");
    let props: Vec<_> = props
        .iter()
        .map(|prop| (prop.name.as_str(), prop.required, prop.prop_type.as_deref()))
        .collect();
    assert_eq!(props, vec![("value", true, Some("Public"))]);
    let world =
        ctx.resolve_type_world_with_sources(filename.to_str().unwrap(), None, false, &sources);
    let TypeLookup::Found(props) = world.resolve(&world.root_module, "Props") else {
        panic!("unsaved barrel resolves")
    };
    let TypeLookup::Found(public) = world.resolve(&props.module, "Public") else {
        panic!("external alias resolves in its own module")
    };
    assert_eq!(
        world.declaration(&public).unwrap().body,
        "{ label: number }"
    );
}
