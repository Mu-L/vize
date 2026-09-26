use super::super::ScriptCompileContext;
use crate::croquis::{
    SfcCroquisOptions, analyze_sfc_descriptor_resolved, analyze_sfc_descriptor_with_context,
};
use crate::{SfcParseOptions, parse_sfc};
use vize_croquis::types::TypeLookup;

#[test]
fn nested_imports_keep_scope_exports_and_generic_metadata() {
    let dir = tempfile::tempdir().unwrap();
    std::fs::write(dir.path().join("public.ts"), "import type { Actual as Local } from './actual'; export type Props = { value: Local<string> }; export type { Actual as Item } from './actual'").unwrap();
    std::fs::write(dir.path().join("actual.ts"), "type Hidden = { label: string }; export type Actual<T extends Hidden = Hidden> = { item: T }").unwrap();
    std::fs::write(
        dir.path().join("unrelated.ts"),
        "export type Actual = { wrong: number }",
    )
    .unwrap();
    let source = "import type { Props } from './public'; import type { Actual } from './unrelated'; defineProps<Props>()";
    let world = ScriptCompileContext::new(source)
        .resolve_type_world(dir.path().join("App.vue").to_str().unwrap(), None);
    let TypeLookup::Found(props) = world.resolve(&world.root_module, "Props") else {
        panic!("props import resolves")
    };
    let TypeLookup::Found(actual) = world.resolve(&props.module, "Local") else {
        panic!("nested alias resolves")
    };
    assert_eq!(
        actual.module.as_str(),
        dir.path()
            .join("actual.ts")
            .canonicalize()
            .unwrap()
            .to_str()
            .unwrap()
    );
    assert_eq!(actual.name, "Actual");
    assert_eq!(
        world
            .declaration(&actual)
            .unwrap()
            .type_parameters
            .as_deref(),
        Some("<T extends Hidden = Hidden>")
    );
    let TypeLookup::Found(hidden) = world.resolve(&actual.module, "Hidden") else {
        panic!("private lexical declaration resolves")
    };
    assert_eq!(
        world.declaration(&hidden).unwrap().body,
        "{ label: string }"
    );
    assert!(matches!(
        world.resolve(&world.root_module, "Local"),
        TypeLookup::Unknown(_)
    ));
}

#[test]
fn direct_import_types_and_external_edits_refresh_without_flat_alias_changes() {
    let dir = tempfile::tempdir().unwrap();
    let api = dir.path().join("api.ts");
    std::fs::write(
        &api,
        "export type Public = { label: string }; type Private = string",
    )
    .unwrap();
    let source = "type Props = { value: import('./api').Public }; defineProps<Props>()";
    let filename = dir.path().join("App.vue");
    let ctx = ScriptCompileContext::new(source);
    let before = ctx.resolve_type_world(filename.to_str().unwrap(), None);
    let TypeLookup::Found(id) = before.resolve_import(&before.root_module, "./api", "Public")
    else {
        panic!("direct type import resolves")
    };
    std::fs::write(
        &api,
        "export type Public = { label: number }; type Private = boolean",
    )
    .unwrap();
    let after = ctx.resolve_type_world(filename.to_str().unwrap(), None);
    assert_eq!(
        after.resolve_import(&after.root_module, "./api", "Public"),
        TypeLookup::Found(id.clone())
    );
    assert_ne!(
        before.declaration(&id).unwrap().body,
        after.declaration(&id).unwrap().body
    );
}

#[test]
fn expose_only_sfc_receives_the_world_before_the_props_early_return() {
    let dir = tempfile::tempdir().unwrap();
    std::fs::write(
        dir.path().join("api.ts"),
        "export type Public = { label: string }",
    )
    .unwrap();
    let source = "<script setup lang='ts'>import type { Public } from './api'; const item: Public = { label: 'ok' }; defineExpose({ item })</script>";
    let descriptor = parse_sfc(source, SfcParseOptions::default()).unwrap();
    let analysis = analyze_sfc_descriptor_resolved(
        &descriptor,
        None,
        SfcCroquisOptions::full(),
        false,
        false,
        dir.path().join("App.vue").to_str().unwrap(),
    );
    let world = analysis
        .croquis
        .types
        .resolved_world()
        .expect("expose surface needs imported world");
    assert!(matches!(
        world.resolve(&world.root_module, "Public"),
        TypeLookup::Found(_)
    ));
    let legacy = analyze_sfc_descriptor_with_context(&descriptor, None, SfcCroquisOptions::full());
    assert_eq!(
        analysis.croquis.semantic_snapshot(),
        legacy.croquis.semantic_snapshot()
    );
    assert!(analysis.croquis.macros.props().is_empty());
}

#[test]
fn resolved_world_does_not_mutate_legacy_type_maps() {
    let dir = tempfile::tempdir().unwrap();
    std::fs::write(
        dir.path().join("api.ts"),
        "export interface Props { value: string }",
    )
    .unwrap();
    let source = "import type { Props } from './api'; defineProps<Props>()";
    let mut ctx = ScriptCompileContext::new(source);
    ctx.collect_imported_types_from_path(
        source,
        dir.path().join("App.vue").to_str().unwrap(),
        true,
    );
    ctx.analyze();
    let interfaces = ctx.interfaces.clone();
    let aliases = ctx.type_aliases.clone();
    let bindings = ctx.bindings.bindings.clone();
    let _ = ctx.resolve_type_world(dir.path().join("App.vue").to_str().unwrap(), None);
    assert_eq!(ctx.interfaces, interfaces);
    assert_eq!(ctx.type_aliases, aliases);
    assert_eq!(ctx.bindings.bindings, bindings);
}

#[test]
fn namespace_heritage_and_exported_namespaces_follow_their_real_modules() {
    let dir = tempfile::tempdir().unwrap();
    std::fs::write(
        dir.path().join("base.ts"),
        "export interface Base { value: string }",
    )
    .unwrap();
    std::fs::write(
        dir.path().join("barrel.ts"),
        "import type * as NS from './base'; export type { NS as Api }",
    )
    .unwrap();
    let source = "import type { Api as NS } from './barrel'; interface Public extends NS.Base { count: number }; defineProps<Public>()";
    let world = ScriptCompileContext::new(source)
        .resolve_type_world(dir.path().join("App.vue").to_str().unwrap(), None);
    let TypeLookup::Found(base) = world.resolve(&world.root_module, "NS.Base") else {
        panic!("namespace heritage resolves")
    };
    assert_eq!(
        base.module.as_str(),
        dir.path()
            .join("base.ts")
            .canonicalize()
            .unwrap()
            .to_str()
            .unwrap()
    );
    let TypeLookup::Found(public) = world.resolve(&world.root_module, "Public") else {
        panic!("public interface resolves")
    };
    assert_eq!(world.declaration(&public).unwrap().extends, vec!["NS.Base"]);
}

#[test]
fn imported_tsx_uses_its_declared_syntax_without_breaking_ts_assertions() {
    let dir = tempfile::tempdir().unwrap();
    std::fs::write(
        dir.path().join("api.tsx"),
        "export type Public = { value: string }; const privateRender = <div />",
    )
    .unwrap();
    let source = "import type { Public } from './api'; const privateValue = <number>1; defineProps<{ value: Public }>()";
    let world = ScriptCompileContext::new(source)
        .resolve_type_world(dir.path().join("App.vue").to_str().unwrap(), None);
    let TypeLookup::Found(public) = world.resolve(&world.root_module, "Public") else {
        panic!("tsx declaration resolves")
    };
    assert_eq!(
        world.declaration(&public).unwrap().body,
        "{ value: string }"
    );
}

#[test]
fn declaration_merging_is_unknown_without_hiding_a_part_or_poisoning_siblings() {
    let dir = tempfile::tempdir().unwrap();
    let api = dir.path().join("api.ts");
    let source = "import type { Public, Sibling } from './api'; defineProps<{ value: Public; other: Sibling }>()";
    let filename = dir.path().join("App.vue");
    for field in ["first: string", "first: number"] {
        std::fs::write(&api, vize_carton::cstr!("export interface Public<T = string> {{ {field} }}; export interface Public<T = string> {{ second: number }}; export type Sibling = boolean")).unwrap();
        let world =
            ScriptCompileContext::new(source).resolve_type_world(filename.to_str().unwrap(), None);
        let TypeLookup::Unknown(reference) = world.resolve(&world.root_module, "Public") else {
            panic!("merged interfaces cannot select one declaration part")
        };
        assert_eq!(
            reference.reason,
            vize_croquis::types::world::UnknownTypeReason::UnsupportedDeclaration
        );
        let parts = vec![
            vize_carton::cstr!("interface Public<T = string> {{ {field} }}"),
            vize_carton::String::new("interface Public<T = string> { second: number }"),
        ];
        assert_eq!(world.unknown_contract(&reference), Some(parts.as_slice()));
        let TypeLookup::Found(sibling) = world.resolve(&world.root_module, "Sibling") else {
            panic!("unrelated sibling remains resolved")
        };
        assert_eq!(world.declaration(&sibling).unwrap().body, "boolean");
    }
}

#[test]
fn normal_script_only_sfc_preserves_legacy_metadata_with_a_scoped_world() {
    let dir = tempfile::tempdir().unwrap();
    std::fs::write(
        dir.path().join("api.ts"),
        "export type Public = { label: string }",
    )
    .unwrap();
    let source = "<script lang='ts'>import type { Public } from './api'; const item: Public = { label: 'ok' }; export default {}</script>";
    let descriptor = parse_sfc(source, SfcParseOptions::default()).unwrap();
    let analysis = analyze_sfc_descriptor_resolved(
        &descriptor,
        None,
        SfcCroquisOptions::full(),
        false,
        false,
        dir.path().join("App.vue").to_str().unwrap(),
    );
    let world = analysis
        .croquis
        .types
        .resolved_world()
        .expect("normal script imports need their declaring modules");
    let TypeLookup::Found(public) = world.resolve(&world.root_module, "Public") else {
        panic!("normal script type import resolves")
    };
    assert_eq!(
        world.declaration(&public).unwrap().body,
        "{ label: string }"
    );
    let legacy = analyze_sfc_descriptor_with_context(&descriptor, None, SfcCroquisOptions::full());
    assert_eq!(
        analysis.croquis.semantic_snapshot(),
        legacy.croquis.semantic_snapshot()
    );
}
