use super::{PropContract, SignatureContract};
use crate::Croquis;
use crate::drawer::{Drawer, DrawerOptions};
use crate::types::world::{
    ResolvedTypeWorld, TypeDeclaration, TypeDeclarationKind, TypeExportBinding, TypeImport,
    TypeModule, TypeModuleReference,
};
use vize_carton::{CompactString, cstr};
use vize_davinci::summary::{Facet, SfcSummary};

fn declaration(name: &str, body: &str) -> TypeDeclaration {
    TypeDeclaration {
        kind: TypeDeclarationKind::Alias,
        body: CompactString::new(body),
        extends: Vec::new(),
        type_parameters: None,
        declaration_source: cstr!("type {name} = {body};"),
    }
}

fn world(helper: &str) -> ResolvedTypeWorld {
    let target = TypeModuleReference {
        specifier: "./types".into(),
        module: Some("/types.ts".into()),
    };
    let mut root = TypeModule {
        complete: true,
        ..Default::default()
    };
    root.imports.insert(
        "Alias".into(),
        TypeImport {
            target: target.clone(),
            exported: Some("Public".into()),
        },
    );
    root.direct_imports.insert("./types".into(), target);
    root.declarations
        .insert("Helper".into(), declaration("Helper", "boolean"));
    let mut external = TypeModule {
        complete: true,
        ..Default::default()
    };
    external.declarations.insert(
        "Internal".into(),
        declaration("Internal", "{ value: Helper }"),
    );
    external
        .declarations
        .insert("Helper".into(), declaration("Helper", helper));
    external
        .exports
        .insert("Public".into(), TypeExportBinding::Local("Internal".into()));
    ResolvedTypeWorld {
        root_module: "/Component.vue".into(),
        modules: [
            ("/Component.vue".into(), root),
            ("/types.ts".into(), external),
        ]
        .into_iter()
        .collect(),
    }
}

fn croquis(source: &str, world: ResolvedTypeWorld) -> Croquis {
    let mut drawer = Drawer::with_options(DrawerOptions::full());
    drawer.draw_script_setup(source);
    let mut croquis = drawer.finish();
    croquis.types.set_resolved_world(world);
    croquis
}

fn summary(croquis: &Croquis) -> SfcSummary {
    SfcSummary::from_alpha(croquis.alpha_pages("Component", None).expect("pages")).expect("summary")
}

#[test]
fn imported_alias_fingerprints_follow_the_declaring_modules_own_helpers() {
    let source = "import type { Public as Alias } from './types'; type Helper = boolean; \
        defineProps<{ value: Alias; sibling: boolean; literal: 'Alias' }>(); \
        const item: Alias = null as Alias; defineExpose({ item });";
    let before = croquis(source, world("string"));
    let after = croquis(source, world("number"));
    let changed = summary(&before).changed(&summary(&after));
    assert!(
        changed
            .iter()
            .any(|id| id.facet() == Facet::Prop && id.name() == "value")
    );
    assert!(
        changed
            .iter()
            .any(|id| id.facet() == Facet::Reactivity && id.name() == "item")
    );
    assert!(
        !changed
            .iter()
            .any(|id| id.facet() == Facet::Prop && matches!(id.name(), "sibling" | "literal"))
    );
    let pages = before.alpha_pages("Component", None).expect("pages");
    let value: PropContract = serde_json::from_str(
        &pages
            .props
            .iter()
            .find(|entry| entry.name == "value")
            .expect("value")
            .contract,
    )
    .expect("contract");
    assert!(value.type_dependencies.complete);
    assert_eq!(value.prop_type.as_deref(), Some("Alias"));
    assert!(
        value
            .type_dependencies
            .declarations
            .iter()
            .any(|dependency| dependency.name == "Helper"
                && dependency.module.as_deref() == Some("/types.ts")
                && dependency.body.as_deref() == Some("string"))
    );
    assert!(
        !value
            .type_dependencies
            .declarations
            .iter()
            .any(|dependency| dependency.module.as_deref() == Some("/Component.vue"))
    );
    let mut private_edit = world("string");
    private_edit
        .modules
        .get_mut("/Component.vue")
        .expect("root")
        .declarations
        .insert(
            "Helper".into(),
            declaration("Helper", "'unrelated private edit'"),
        );
    assert!(
        summary(&before)
            .changed(&summary(&croquis(source, private_edit)))
            .is_empty()
    );
}

#[test]
fn direct_import_type_changes_and_opaque_macro_arguments_reach_their_contracts() {
    let source = "defineProps<{ value: import('./types').Public; sibling: boolean }>();";
    let before = croquis(source, world("string"));
    let after = croquis(source, world("number"));
    let changed = summary(&before).changed(&summary(&after));
    assert!(
        changed
            .iter()
            .any(|id| id.facet() == Facet::Prop && id.name() == "value")
    );
    assert!(
        !changed
            .iter()
            .any(|id| id.facet() == Facet::Prop && id.name() == "sibling")
    );
    let opaque = "import type { Public as Alias } from './types'; defineProps<Alias>();";
    let before = croquis(opaque, world("string"));
    let after = croquis(opaque, world("number"));
    assert!(
        summary(&before)
            .changed(&summary(&after))
            .iter()
            .any(|id| id.facet() == Facet::Signature)
    );
    let pages = before.alpha_pages("Component", None).expect("pages");
    let signature: SignatureContract =
        serde_json::from_str(&pages.signature.params).expect("signature");
    assert!(signature.type_dependencies.complete);
    assert!(
        signature
            .type_dependencies
            .declarations
            .iter()
            .any(|dependency| dependency.name == "Internal")
    );
}

#[test]
fn imported_declarations_do_not_capture_sfc_generic_parameters() {
    let mut type_world = world("T");
    type_world
        .modules
        .get_mut("/types.ts")
        .expect("external")
        .declarations
        .insert("T".into(), declaration("T", "'external literal'"));
    let croquis = croquis(
        "import type { Public as Alias } from './types'; defineProps<{ value: Alias }>();",
        type_world,
    );
    let pages = croquis.alpha_pages("Component", Some("T")).expect("pages");
    let prop: PropContract =
        serde_json::from_str(&pages.props.first().expect("value").contract).expect("prop");
    assert!(prop.type_dependencies.complete);
    assert!(
        prop.type_dependencies
            .declarations
            .iter()
            .any(|dependency| dependency.name == "T"
                && dependency.body.as_deref() == Some("'external literal'"))
    );
}
