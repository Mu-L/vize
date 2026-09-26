//! Tests for [`super::compile`].
//!
//! Split out of that module so it stays inside the per-file source-length
//! budget.
#![expect(clippy::disallowed_macros, reason = "insta and fixtures use format!")]

use super::*;

#[test]
fn module_code_prepends_merged_preamble_to_render_code() {
    // The authored VDOM declaration follows its deduplicated runtime imports.
    let bump = Allocator::new();
    let out = compile_jsx(
        &bump,
        "const A = () => <div>{x}</div>;",
        JsxLang::Jsx,
        &JsxCompileConfig::default(),
    );
    let module = out.module_code();
    insta::assert_snapshot!(module);
}

#[test]
fn source_map_covers_single_and_multiple_component_modules() {
    let bump = Allocator::new();
    let mut config = JsxCompileConfig::default();
    config.vdom.source_map = true;

    let single = compile_jsx(
        &bump,
        "const A = () => <div>{x}</div>;",
        JsxLang::Jsx,
        &config,
    );
    assert_eq!(single.components.len(), 1);
    let map = single.source_map().expect("single component carries a map");
    insta::assert_snapshot!(map);

    let multi = compile_jsx(
        &bump,
        "const A = () => <div>{x}</div>;\nconst B = () => <span>{y}</span>;",
        JsxLang::Jsx,
        &config,
    );
    assert!(multi.components.len() >= 2);
    assert!(
        multi.source_map().is_some(),
        "multi-component module composes maps for every retained declaration"
    );
}
