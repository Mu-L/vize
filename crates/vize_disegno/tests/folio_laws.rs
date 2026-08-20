//! TS-16 for the disegno folio (P2-5a).
//!
//! `Full` mode: `print(parse(t)) == t` byte-exact for canonical text and
//! `parse(print(v)) == v` structurally, with normalization by the first
//! print for non-canonical input. `Display` explicitly carries **no**
//! round-trip law - here it elides every span tail and nothing else.
//! The committed reference page (`tests/fixtures/reference.folio`) covers
//! every op kind, both binding kinds, escapes, a namespace, static and
//! dynamic names, and optional `ui.for` positions; `tests/folio_mirror.rs`
//! builds the same tree in a live arena.

use vize_carton::{Span, String};
use vize_davinci::folio::{Folio, FolioMode};
use vize_disegno::expr::ExprSlot;
use vize_disegno::folio::{
    DisegnoFolio, FolioAttribute, FolioBinding, FolioBranch, FolioComponent, FolioElement,
    FolioFor, FolioIf, FolioInterpolation, FolioModel, FolioName, FolioOp, FolioSlot, FolioText,
    FolioVueDirective,
};
use vize_disegno::op::{BindingContract, ForBinding, Namespace};

/// Canonical text of the reference tree.
const CANONICAL: &str = include_str!("fixtures/reference.folio");

/// `Display` output for the same tree: span tails elided, nothing else.
const DISPLAY: &str = "\
[disegno]
ops=9

[disegno.ops]
ui.element form
  attr method=\"post\"
  ui.model read=?expr write=?expr
    attr element-kind=\"textarea\"
  vue.directive \"pin\" arg=\"top\" mods=\"lazy,trim\" value=?expr
  ui.if
    branch ?expr
      ui.text \"a\\\"b\\\\c\"
    branch
      ui.interpolation ?expr
ui.for source=?expr value=?expr key=?expr
  ui.slot name=?expr
ui.component Chrome

";

/// The reference tree, hand-built in the owned model.
fn hand_built() -> DisegnoFolio {
    DisegnoFolio {
        ops: vec![
            FolioOp::Element(FolioElement {
                tag: String::from("form"),
                namespace: Namespace::Html,
                attributes: vec![FolioAttribute {
                    name: String::from("method"),
                    value: Some(String::from("post")),
                    span: Span::new(5, 20),
                }],
                bindings: vec![
                    FolioBinding::Model(FolioModel {
                        contract: BindingContract::default(),
                        attributes: vec![FolioAttribute {
                            name: String::from("element-kind"),
                            value: Some(String::from("textarea")),
                            span: Span::new(21, 40),
                        }],
                        span: Span::new(21, 40),
                    }),
                    FolioBinding::VueDirective(FolioVueDirective {
                        name: String::from("pin"),
                        argument: Some(FolioName::Static(String::from("top"))),
                        modifiers: vec![String::from("lazy"), String::from("trim")],
                        value: Some(ExprSlot),
                        span: Span::new(41, 60),
                    }),
                ],
                children: vec![FolioOp::If(FolioIf {
                    branches: vec![
                        FolioBranch {
                            condition: Some(ExprSlot),
                            ops: vec![FolioOp::Text(FolioText {
                                content: String::from("a\"b\\c"),
                                span: Span::new(66, 70),
                            })],
                            span: Span::new(61, 75),
                        },
                        FolioBranch {
                            condition: None,
                            ops: vec![FolioOp::Interpolation(FolioInterpolation {
                                expression: ExprSlot,
                                span: Span::new(80, 88),
                            })],
                            span: Span::new(75, 90),
                        },
                    ],
                    span: Span::new(61, 90),
                })],
                span: Span::new(0, 99),
            }),
            FolioOp::For(FolioFor {
                binding: ForBinding {
                    source: ExprSlot,
                    value: ExprSlot,
                    key: Some(ExprSlot),
                    index: None,
                },
                ops: vec![FolioOp::Slot(FolioSlot {
                    name: FolioName::Dynamic(ExprSlot),
                    fallback: vec![],
                    span: Span::new(105, 118),
                })],
                span: Span::new(100, 120),
            }),
            FolioOp::Component(FolioComponent {
                name: String::from("Chrome"),
                attributes: vec![],
                bindings: vec![],
                children: vec![],
                span: Span::new(121, 130),
            }),
        ],
    }
}

#[test]
fn full_print_is_identity_on_canonical_text() {
    let value = DisegnoFolio::parse(CANONICAL).expect("canonical text parses");
    assert_eq!(value.print_to_string(FolioMode::Full).as_str(), CANONICAL);
}

#[test]
fn parse_print_is_structural_identity() {
    let value = hand_built();
    let printed = value.print_to_string(FolioMode::Full);
    let reparsed = DisegnoFolio::parse(printed.as_str()).expect("printed text parses");
    assert_eq!(reparsed, value);
}

#[test]
fn a_hand_built_value_prints_the_canonical_text() {
    assert_eq!(
        hand_built().print_to_string(FolioMode::Full).as_str(),
        CANONICAL
    );
    assert_eq!(
        DisegnoFolio::parse(CANONICAL).expect("canonical text parses"),
        hand_built()
    );
}

#[test]
fn display_elides_spans_and_carries_no_round_trip_law() {
    assert_eq!(
        hand_built().print_to_string(FolioMode::Display).as_str(),
        DISPLAY
    );
}

#[test]
fn an_empty_tree_prints_the_header_only() {
    let empty = DisegnoFolio::default();
    assert_eq!(
        empty.print_to_string(FolioMode::Full).as_str(),
        "[disegno]\nops=0\n\n"
    );
    assert_eq!(
        DisegnoFolio::parse("[disegno]\nops=0\n\n").expect("empty page parses"),
        empty
    );
}

#[test]
fn non_canonical_input_is_normalized_by_the_first_print() {
    // A stale count, blank-line separators, and a zero-padded span offset:
    // parse accepts all of it and the first print is canonical.
    let scrambled = "\
[disegno]
ops=999

[disegno.ops]

ui.element form @0:007


  attr method=\"post\" @5:20
ui.component Chrome @121:130
";
    let value = DisegnoFolio::parse(scrambled).expect("scrambled text parses");
    assert_eq!(
        value.print_to_string(FolioMode::Full).as_str(),
        "\
[disegno]
ops=2

[disegno.ops]
ui.element form @0:7
  attr method=\"post\" @5:20
ui.component Chrome @121:130

"
    );
}
