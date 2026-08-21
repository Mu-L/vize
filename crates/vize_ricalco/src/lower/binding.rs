//! Attached bindings: `v-model` into the `ui.model` contract, custom
//! directives into `vue.directive`, and the deferral of every built-in
//! the P2-8 op family cannot carry yet.
//!
//! # Unmappable means diagnostic, never a new op
//!
//! `ui.bind` / `ui.on` land with the transform that needs them (P2-9);
//! until then `v-bind`, `v-on`, `v-html`, `v-text`, `v-show`, `v-cloak`,
//! `v-once`, `v-memo` and `v-pre` have **no S2 op**, and forcing them
//! into `vue.directive` would break its documented contract ("built-in
//! directives never appear here"). Each is deferred: an `Info`
//! diagnostic — the input is not wrong, the stage is younger than the
//! construct — plus a provenance record naming the rule, with the owner
//! op kept as the fragment. `v-slot` grouping likewise waits for slot
//! normalization (P2-9), but its **scope facts are recorded today**: the
//! slot-props scope is a binding-introduction site whether or not the op
//! family can express the grouping yet.

use alloc::vec::Vec as StdVec;

use vize_carton::{Box, Span, String, Vec, cstr};
use vize_davinci::id::NodeId;
use vize_sinopia::Element;

use vize_disegno::op::{
    Attribute, BindingContract, BindingOp, DynamicName, ModelOp, VueDirectiveOp,
};
use vize_disegno::scope::{ScopeBinding, ScopeFacts, ScopeOrigin};

use super::cx::{Cx, attr_slice, attr_span};
use super::directive::{Arg, Directive, Head};
use super::element::attr_value_text;
use super::expr::{expr_at, simple_identifier};

/// The op an attribute attaches to.
pub(crate) struct Owner<'a> {
    /// The owner's page-order id.
    pub node: Option<NodeId>,
    /// The owner's authored tag or component name.
    pub tag: &'a str,
    /// Whether the owner is a `ui.component`.
    pub component: bool,
}

/// Lower one non-structural directive attribute of an element or
/// component.
pub(crate) fn lower_attr<'a>(
    cx: &mut Cx<'a>,
    element: &Element<'a>,
    index: usize,
    directive: &Directive<'a>,
    owner: &Owner<'a>,
    bindings: &mut Vec<'a, BindingOp<'a>>,
) {
    let attr = &element.open.attrs[index];
    match directive.head {
        Head::Model => {
            if let Some(op) = lower_model(cx, element, index, directive, owner) {
                bindings.push(op);
            }
        }
        Head::Custom => bindings.push(lower_custom(cx, element, index, directive)),
        Head::Slot => {
            defer(
                cx,
                "defer.v-slot",
                attr_span(cx, attr),
                attr_slice(cx, attr),
                cstr!(
                    "`{}` content grouping has no S2 representation at P2-8; it lands with slot normalization (P2-9)",
                    attr.name.text
                ),
            );
            record_slot_scope(cx, element, index, owner.node);
        }
        Head::Pre => defer(
            cx,
            "defer.v-pre",
            attr_span(cx, attr),
            attr_slice(cx, attr),
            String::from(
                "`v-pre` has no S2 representation at P2-8; its subtree lowers as ordinary content",
            ),
        ),
        Head::Bind
        | Head::On
        | Head::Html
        | Head::Text
        | Head::Show
        | Head::Cloak
        | Head::Once
        | Head::Memo => {
            let rule = match directive.head {
                Head::Bind => "defer.v-bind",
                Head::On => "defer.v-on",
                Head::Html => "defer.v-html",
                Head::Text => "defer.v-text",
                Head::Show => "defer.v-show",
                Head::Cloak => "defer.v-cloak",
                Head::Once => "defer.v-once",
                _ => "defer.v-memo",
            };
            defer(
                cx,
                rule,
                attr_span(cx, attr),
                attr_slice(cx, attr),
                cstr!(
                    "`{}` has no S2 op at P2-8; the normalized binding ops land with the transform that needs them (P2-9)",
                    attr.name.text
                ),
            );
        }
        Head::If | Head::ElseIf | Head::Else | Head::For => {
            // The structural pass consumed the first of each; a duplicate
            // is ignored under a record, never silently.
            cx.info(
                attr_span(cx, attr),
                cstr!(
                    "duplicate structural directive `{}` is ignored",
                    attr.name.text
                ),
            );
            cx.record(
                "drop.structural-duplicate",
                None,
                attr_slice(cx, attr),
                String::default(),
                attr_span(cx, attr),
            );
        }
    }
}

/// An `Info` deferral: rule + record + diagnostic, owner kept.
pub(crate) fn defer(
    cx: &mut Cx<'_>,
    rule: &'static str,
    span: Span,
    before: &str,
    message: String,
) {
    cx.info(span, message);
    cx.record(rule, None, before, String::default(), span);
}

/// `v-model` into the `ui.model` contract: read and write are the same
/// authored payload (custom accessors split them in later dialects);
/// element kind, argument and modifiers ride as synthesized attributes
/// carrying the binding's span, in that declared order.
fn lower_model<'a>(
    cx: &mut Cx<'a>,
    element: &Element<'a>,
    index: usize,
    directive: &Directive<'a>,
    owner: &Owner<'a>,
) -> Option<BindingOp<'a>> {
    let attr = &element.open.attrs[index];
    let span = attr_span(cx, attr);
    let text = attr_value_text(element, index);
    if text.map(str::trim).is_none_or(str::is_empty) {
        cx.error(span, String::from("v-model is missing expression."));
        cx.record(
            "error.v-model-no-expression",
            None,
            attr_slice(cx, attr),
            String::default(),
            span,
        );
        return None;
    }
    if matches!(directive.arg, Some(Arg::Dynamic(_))) {
        defer(
            cx,
            "defer.v-model-dynamic-argument",
            span,
            attr_slice(cx, attr),
            String::from(
                "`v-model` with a dynamic argument is not representable in S2 at P2-8; the binding is recorded in provenance only",
            ),
        );
        return None;
    }
    let text = text?;
    let node = cx.mint_op();
    let expr = expr_at(cx, text);
    let mut attributes: Vec<'a, Attribute<'a>> = Vec::new_in(&cx.allocator);
    attributes.push(Attribute {
        name: "element-kind",
        value: Some(if owner.component {
            "component"
        } else {
            owner.tag
        }),
        span,
    });
    if let Some(Arg::Static(argument)) = directive.arg {
        attributes.push(Attribute {
            name: "argument",
            value: Some(argument),
            span,
        });
    }
    for modifier in &directive.modifiers {
        attributes.push(Attribute {
            name: modifier,
            value: None,
            span,
        });
    }
    cx.record(
        "lower.model",
        node,
        attr_slice(cx, attr),
        String::from("ui.model"),
        span,
    );
    Some(BindingOp::Model(Box::new_in(
        ModelOp {
            contract: BindingContract {
                read: expr,
                write: expr,
            },
            attributes,
            span,
        },
        &cx.allocator,
    )))
}

/// A user-defined directive rides through as the `vue.directive` dialect
/// op, exactly as authored.
fn lower_custom<'a>(
    cx: &mut Cx<'a>,
    element: &Element<'a>,
    index: usize,
    directive: &Directive<'a>,
) -> BindingOp<'a> {
    let attr = &element.open.attrs[index];
    let span = attr_span(cx, attr);
    let node = cx.mint_op();
    let argument = directive.arg.map(|arg| match arg {
        Arg::Static(name) => DynamicName::Static(name),
        Arg::Dynamic(inner) => DynamicName::Dynamic(expr_at(cx, inner)),
    });
    let mut modifiers: Vec<'a, &'a str> = Vec::new_in(&cx.allocator);
    for modifier in &directive.modifiers {
        modifiers.push(modifier);
    }
    let value = attr_value_text(element, index)
        .map(str::trim)
        .filter(|text| !text.is_empty())
        .map(|text| expr_at(cx, text));
    cx.record(
        "lower.vue-directive",
        node,
        attr_slice(cx, attr),
        cstr!("vue.directive \"{}\"", directive.name),
        span,
    );
    BindingOp::VueDirective(Box::new_in(
        VueDirectiveOp {
            name: directive.name,
            argument,
            modifiers,
            value,
            span,
        },
        &cx.allocator,
    ))
}

/// The slot-props scope facts of a `v-slot`: a binding-introduction site
/// tagged today even though the grouping op waits for P2-9. The props
/// name is recorded when it is a simple identifier; patterns wait for
/// the one identifier-enumeration seam (#4365).
pub(crate) fn record_slot_scope<'a>(
    cx: &mut Cx<'a>,
    element: &Element<'a>,
    index: usize,
    node: Option<NodeId>,
) {
    let Some(text) = attr_value_text(element, index) else {
        return;
    };
    if text.trim().is_empty() {
        return;
    }
    let tag = cx.mint_scope();
    let expr = expr_at(cx, text);
    let mut bindings = StdVec::new();
    if let Some(name) = simple_identifier(&expr) {
        bindings.push(ScopeBinding {
            name: String::from(name),
            origin: ScopeOrigin::Authored { span: expr.span() },
        });
    }
    cx.attach_scope(node, ScopeFacts { tag, bindings });
}
