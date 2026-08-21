//! Exact-pinned element-level shapes: components by the native-tag rule,
//! namespaces by inheritance, `ui.model` contracts, `vue.directive`
//! ride-through, `ui.slot` outlets, and the Info deferral of bindings
//! the P2-8 op family cannot carry (whole-artifact equality throughout).

mod support;

use support::artifact;
use vize_carton::Span;
use vize_davinci::diagnostic::{Diagnostic, Severity, Stage};

#[test]
fn a_non_native_tag_lowers_as_a_component() {
    let art = artifact("<MyComp>text</MyComp>");
    assert_eq!(
        art.folio,
        "[disegno]\n\
         ops=2\n\
         \n\
         [disegno.ops]\n\
         ui.component MyComp @0:21\n\
         \x20 ui.text \"text\" @8:12\n\
         \n"
    );
}

#[test]
fn the_svg_namespace_is_entered_by_tag_and_inherited() {
    let art = artifact("<svg><path/></svg>");
    assert_eq!(
        art.folio,
        "[disegno]\n\
         ops=2\n\
         \n\
         [disegno.ops]\n\
         ui.element svg ns=svg @0:18\n\
         \x20 ui.element path ns=svg @5:12\n\
         \n"
    );
}

#[test]
fn v_model_lowers_to_the_contract_with_synthesized_attributes() {
    // Read and write share one authored payload; element kind and the
    // dialect modifiers ride as attributes carrying the binding's span,
    // in declared order (element-kind, argument, modifiers).
    let art = artifact("<input v-model.lazy.trim=\"msg\">");
    assert_eq!(
        art.folio,
        "[disegno]\n\
         ops=2\n\
         \n\
         [disegno.ops]\n\
         ui.element input @0:31\n\
         \x20 ui.model read=js(\"msg\" @26:29) write=js(\"msg\" @26:29) @7:30\n\
         \x20   attr element-kind=\"input\" @7:30\n\
         \x20   attr lazy @7:30\n\
         \x20   attr trim @7:30\n\
         \n"
    );
    assert_eq!(art.diagnostics, Vec::new());
}

#[test]
fn a_custom_directive_rides_through_as_the_dialect_op() {
    let art = artifact("<div v-pin:top.stop=\"v\"></div>");
    assert_eq!(
        art.folio,
        "[disegno]\n\
         ops=2\n\
         \n\
         [disegno.ops]\n\
         ui.element div @0:30\n\
         \x20 vue.directive \"pin\" arg=\"top\" mods=\"stop\" value=js(\"v\" @21:22) @5:23\n\
         \n"
    );
}

#[test]
fn a_slot_outlet_owns_its_fallback_and_normalizes_the_implicit_name() {
    let named = artifact("<slot name=\"s\"><span>f</span></slot>");
    assert_eq!(
        named.folio,
        "[disegno]\n\
         ops=3\n\
         \n\
         [disegno.ops]\n\
         ui.slot name=\"s\" @0:36\n\
         \x20 ui.element span @15:29\n\
         \x20   ui.text \"f\" @21:22\n\
         \n"
    );

    let implicit = artifact("<slot></slot>");
    assert_eq!(
        implicit.folio,
        "[disegno]\n\
         ops=1\n\
         \n\
         [disegno.ops]\n\
         ui.slot name=\"default\" @0:13\n\
         \n"
    );

    let dynamic = artifact("<slot :name=\"n\"></slot>");
    assert_eq!(
        dynamic.folio,
        "[disegno]\n\
         ops=1\n\
         \n\
         [disegno.ops]\n\
         ui.slot name=js(\"n\" @13:14) @0:23\n\
         \n"
    );
}

#[test]
fn an_unmappable_binding_defers_with_info_and_keeps_the_fragment() {
    // `:key` has no S2 op until P2-9's normalized binding ops: the
    // element and its `ui.for` are kept, the deferral is an exact Info
    // diagnostic — the input is not wrong, the stage is younger than the
    // construct.
    let art = artifact("<li v-for=\"(item, i) in items\" :key=\"item.id\">{{ item.name }}</li>");
    assert_eq!(
        art.folio,
        "[disegno]\n\
         ops=3\n\
         \n\
         [disegno.ops]\n\
         ui.for source=js(\"items\" @24:29) value=js(\"item\" @12:16) key=js(\"i\" @18:19) @0:66\n\
         \x20 ui.element li @0:66\n\
         \x20   ui.interpolation js(\"item.name\" @49:58) @46:61\n\
         \n"
    );
    assert_eq!(
        art.diagnostics,
        vec![Diagnostic::new(
            Severity::Info,
            Stage::Semantic,
            Span::new(31, 45),
            "`:key` has no S2 op at P2-8; the normalized binding ops land with the transform that needs them (P2-9)",
        )]
    );
}

#[test]
fn a_missing_end_tag_hole_becomes_a_surface_diagnostic() {
    // The tokenizer never reports a missing end tag (end-tag matching is
    // tree construction, not lexing), so the `ElementClose::Missing`
    // hole enters the unified channel at lowering — and the fragment
    // still lowers structurally, its span running to its last child.
    let art = artifact("<div><span>x</div>");
    assert_eq!(
        art.folio,
        "[disegno]\n\
         ops=3\n\
         \n\
         [disegno.ops]\n\
         ui.element div @0:18\n\
         \x20 ui.element span @5:12\n\
         \x20   ui.text \"x\" @11:12\n\
         \n"
    );
    assert_eq!(
        art.diagnostics,
        vec![Diagnostic::new(
            Severity::Error,
            Stage::Surface,
            Span::new(5, 10),
            "Element is missing end tag.",
        )]
    );
}
