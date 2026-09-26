use crate::croquis::{SfcCroquisOptions, analyze_sfc_descriptor_resolved};
use crate::{SfcParseOptions, parse_sfc};

#[test]
fn imported_props_expanded_after_macro_extraction_receive_authored_defaults() {
    let dir = tempfile::tempdir().unwrap();
    std::fs::write(
        dir.path().join("types.ts"),
        "export interface Public { count: number; label?: string }",
    )
    .unwrap();
    let filename = dir.path().join("App.vue");
    for binding in ["", "const props = "] {
        let source = vize_carton::cstr!(
            "<script setup lang='ts'>import type {{ Public }} from './types'; {binding}withDefaults(defineProps<Public>(), {{ count: 41, label: () => 'ready' }})</script>"
        );
        let descriptor = parse_sfc(&source, SfcParseOptions::default()).unwrap();
        let croquis = analyze_sfc_descriptor_resolved(
            &descriptor,
            None,
            SfcCroquisOptions::full(),
            false,
            false,
            filename.to_str().unwrap(),
        )
        .croquis;
        let props: Vec<_> = croquis
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
            props,
            vec![
                ("count", true, Some("number"), Some("41")),
                ("label", false, Some("string"), Some("() => 'ready'"))
            ]
        );
        assert_eq!(
            croquis.macros.with_defaults_expression(),
            Some("{ count: 41, label: () => 'ready' }")
        );
    }
}
