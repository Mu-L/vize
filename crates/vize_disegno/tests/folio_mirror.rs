//! The arena side of TS-16 (P2-5a): the reference tree built with the op
//! family in a live arena, mirrored through [`DisegnoFolio::of`] into the
//! committed canonical page - pinning the op family and the folio
//! together. The owned twin of this tree lives in `tests/folio_laws.rs`.

use vize_carton::{Allocator, Box, Span, Vec as ArenaVec};
use vize_davinci::folio::{Folio, FolioMode};
use vize_disegno::expr::ExprSlot;
use vize_disegno::folio::DisegnoFolio;
use vize_disegno::op::{
    Attribute, BindingContract, BindingOp, ComponentOp, DynamicName, ElementOp, ForBinding, ForOp,
    IfBranch, IfOp, InterpolationOp, ModelOp, Namespace, Op, Region, SlotOp, TextOp,
    VueDirectiveOp,
};

/// Canonical text of the reference tree.
const CANONICAL: &str = include_str!("fixtures/reference.folio");

/// The same reference tree, built in a live arena with the op family.
fn arena_built<'a>(allocator: &'a Allocator) -> ArenaVec<'a, Op<'a>> {
    let if_op = Op::If(Box::new_in(
        IfOp {
            branches: ArenaVec::from_iter_in(
                [
                    IfBranch {
                        condition: Some(ExprSlot),
                        region: Region {
                            ops: ArenaVec::from_iter_in(
                                [Op::Text(Box::new_in(
                                    TextOp {
                                        content: "a\"b\\c",
                                        span: Span::new(66, 70),
                                    },
                                    &allocator,
                                ))],
                                &allocator,
                            ),
                        },
                        span: Span::new(61, 75),
                    },
                    IfBranch {
                        condition: None,
                        region: Region {
                            ops: ArenaVec::from_iter_in(
                                [Op::Interpolation(Box::new_in(
                                    InterpolationOp {
                                        expression: ExprSlot,
                                        span: Span::new(80, 88),
                                    },
                                    &allocator,
                                ))],
                                &allocator,
                            ),
                        },
                        span: Span::new(75, 90),
                    },
                ],
                &allocator,
            ),
            span: Span::new(61, 90),
        },
        &allocator,
    ));
    let element = Op::Element(Box::new_in(
        ElementOp {
            tag: "form",
            namespace: Namespace::Html,
            attributes: ArenaVec::from_iter_in(
                [Attribute {
                    name: "method",
                    value: Some("post"),
                    span: Span::new(5, 20),
                }],
                &allocator,
            ),
            bindings: ArenaVec::from_iter_in(
                [
                    BindingOp::Model(Box::new_in(
                        ModelOp {
                            contract: BindingContract::default(),
                            attributes: ArenaVec::from_iter_in(
                                [Attribute {
                                    name: "element-kind",
                                    value: Some("textarea"),
                                    span: Span::new(21, 40),
                                }],
                                &allocator,
                            ),
                            span: Span::new(21, 40),
                        },
                        &allocator,
                    )),
                    BindingOp::VueDirective(Box::new_in(
                        VueDirectiveOp {
                            name: "pin",
                            argument: Some(DynamicName::Static("top")),
                            modifiers: ArenaVec::from_iter_in(["lazy", "trim"], &allocator),
                            value: Some(ExprSlot),
                            span: Span::new(41, 60),
                        },
                        &allocator,
                    )),
                ],
                &allocator,
            ),
            children: Region {
                ops: ArenaVec::from_iter_in([if_op], &allocator),
            },
            span: Span::new(0, 99),
        },
        &allocator,
    ));
    let for_op = Op::For(Box::new_in(
        ForOp {
            binding: ForBinding {
                source: ExprSlot,
                value: ExprSlot,
                key: Some(ExprSlot),
                index: None,
            },
            region: Region {
                ops: ArenaVec::from_iter_in(
                    [Op::Slot(Box::new_in(
                        SlotOp {
                            name: DynamicName::Dynamic(ExprSlot),
                            fallback: Region {
                                ops: ArenaVec::new_in(&allocator),
                            },
                            span: Span::new(105, 118),
                        },
                        &allocator,
                    ))],
                    &allocator,
                ),
            },
            span: Span::new(100, 120),
        },
        &allocator,
    ));
    let component = Op::Component(Box::new_in(
        ComponentOp {
            name: "Chrome",
            attributes: ArenaVec::new_in(&allocator),
            bindings: ArenaVec::new_in(&allocator),
            children: Region {
                ops: ArenaVec::new_in(&allocator),
            },
            span: Span::new(121, 130),
        },
        &allocator,
    ));
    ArenaVec::from_iter_in([element, for_op, component], &allocator)
}

#[test]
fn an_arena_tree_mirrors_into_the_same_folio() {
    let allocator = Allocator::default();
    let ops = arena_built(&allocator);
    let mirrored = DisegnoFolio::of(&ops);
    assert_eq!(mirrored.op_count(), 9);
    assert_eq!(
        mirrored.print_to_string(FolioMode::Full).as_str(),
        CANONICAL
    );
    assert_eq!(
        mirrored,
        DisegnoFolio::parse(CANONICAL).expect("canonical text parses")
    );
}
