//! `<slot>` outlets into `ui.slot`: name (static or computed) plus the
//! owned fallback region.
//!
//! An implicit name normalizes to `"default"` — the lowering decision
//! `SlotOp` documents as the dialect's, made here. Forwarded slot props
//! land with `ui.bind` (P2-9), so every non-name attribute defers; a
//! custom directive on an outlet is Vue's own error and is dropped under
//! it.

use vize_carton::{Box, String, cstr};
use vize_sinopia::Element;

use vize_disegno::op::{DynamicName, Namespace, Op, Region, SlotOp};

use super::binding::defer;
use super::cx::{Cx, attr_slice, attr_span, element_span};
use super::directive::{Arg, AttrForm, Head};
use super::element::{Analyzed, attr_value_text};
use super::expr::{desc, expr_at};
use super::structural::lower_children;

/// Lower one `<slot>` element into a `ui.slot` outlet.
pub(crate) fn lower_slot<'a>(
    cx: &mut Cx<'a>,
    element: &Element<'a>,
    analyzed: &Analyzed<'a>,
    ns: Namespace,
) -> Op<'a> {
    let span = element_span(cx, element);
    let node = cx.mint_op();

    let mut name: Option<DynamicName<'a>> = None;
    for (index, attr) in element.open.attrs.iter().enumerate() {
        if Some(index) == analyzed.branch.map(|(idx, _)| idx) || Some(index) == analyzed.vfor {
            continue;
        }
        match &analyzed.forms[index] {
            AttrForm::Static if attr.name.text == "name" && name.is_none() => {
                // A value-less `name` reads as the implicit name — the
                // shipped resolution (`codegen/slots/outlet.rs`), matched
                // exactly so the two lanes never differ on the spelling.
                name = Some(DynamicName::Static(
                    attr_value_text(element, index).unwrap_or("default"),
                ));
            }
            AttrForm::Static => defer(
                cx,
                "defer.slot-props",
                attr_span(cx, attr),
                attr_slice(cx, attr),
                String::from("slot props have no S2 op at P2-8; they land with `ui.bind` (P2-9)"),
            ),
            AttrForm::Directive(directive) => match directive.head {
                Head::Bind if directive.arg == Some(Arg::Static("name")) && name.is_none() => {
                    // A `:name` with no expression is not a name candidate
                    // in the shipped resolution (a later `name` attribute
                    // may still win, else the implicit name); dropped
                    // under a record, never silently.
                    match attr_value_text(element, index).map(str::trim) {
                        Some(text) if !text.is_empty() => {
                            name = Some(DynamicName::Dynamic(expr_at(cx, text)));
                        }
                        _ => {
                            cx.info(
                                attr_span(cx, attr),
                                String::from(
                                    "`:name` with no expression names no slot; the outlet keeps the implicit name",
                                ),
                            );
                            cx.record(
                                "drop.slot-name-hole",
                                None,
                                attr_slice(cx, attr),
                                String::default(),
                                attr_span(cx, attr),
                            );
                        }
                    }
                }
                Head::Bind => defer(
                    cx,
                    "defer.slot-props",
                    attr_span(cx, attr),
                    attr_slice(cx, attr),
                    String::from(
                        "slot props have no S2 op at P2-8; they land with `ui.bind` (P2-9)",
                    ),
                ),
                Head::Custom => {
                    cx.error(
                        attr_span(cx, attr),
                        String::from("Unexpected custom directive on <slot> outlet."),
                    );
                    cx.record(
                        "error.slot-directive",
                        None,
                        attr_slice(cx, attr),
                        String::default(),
                        attr_span(cx, attr),
                    );
                }
                Head::Model => {
                    cx.error(
                        attr_span(cx, attr),
                        String::from("v-model is not supported on <slot> outlets."),
                    );
                    cx.record(
                        "error.v-model-on-slot",
                        None,
                        attr_slice(cx, attr),
                        String::default(),
                        attr_span(cx, attr),
                    );
                }
                _ => defer(
                    cx,
                    "defer.slot-directive",
                    attr_span(cx, attr),
                    attr_slice(cx, attr),
                    cstr!(
                        "`{}` on a <slot> outlet has no S2 op at P2-8 (P2-9)",
                        attr.name.text
                    ),
                ),
            },
        }
    }
    let name = name.unwrap_or(DynamicName::Static("default"));
    let after = match &name {
        DynamicName::Static(text) => cstr!("ui.slot \"{text}\""),
        DynamicName::Dynamic(expr) => cstr!("ui.slot {}", desc(expr)),
    };
    let open_end = cx.token_span(&element.open.gt).end;
    let open_slice = cx
        .source
        .get(cx.offset(element.open.lt_name.text) as usize..open_end as usize)
        .unwrap_or("slot");
    cx.record("lower.slot", node, open_slice, after, span);

    let fallback = Region {
        ops: lower_children(cx, &element.children, ns),
    };
    Op::Slot(Box::new_in(
        SlotOp {
            name,
            fallback,
            span,
        },
        &cx.allocator,
    ))
}
