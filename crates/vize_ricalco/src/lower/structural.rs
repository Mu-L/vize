//! The region walk: children in document order, `v-if` sibling chains
//! grouped into region-owning [`IfOp`]s, `v-for` wrapped as [`ForOp`]s.
//!
//! Grouping at lowering is the point of the region design: the shipped
//! pipeline merges `v-else` branches onto the parent's child list
//! mid-traversal; a region-owning `ui.if` is built with its branches from
//! birth, so no pass ever revisits a sibling list. Whitespace-only text
//! and comments **between** consumed branches are dropped under
//! provenance (`drop.branch-gap`); the same nodes anywhere else lower
//! normally.
//!
//! `v-if` and `v-for` on one element follow Vue 3 precedence: the
//! conditional evaluates outside the iteration, so the branch region
//! holds the `ui.for` which holds the element.

use alloc::vec::Vec as StdVec;

use vize_carton::{Box, Span, String, Vec, cstr};
use vize_sinopia::{Element, SurfaceChild};

use vize_disegno::op::{IfBranch, IfOp, Namespace, Op, Region};

use super::cx::{Cx, attr_slice, attr_span, element_span};
use super::element::{Analyzed, BranchKind, analyze, attr_value_text, element_core};
use super::expr::expr_at;
use super::forop::lower_for;
use super::leaf::lower_leaf;

/// One scanned branch of a chain: its element, analysis, branch-attr
/// index, and the gap children it consumes.
type Branch<'a, 't> = (&'t Element<'a>, Analyzed<'a>, usize, StdVec<usize>);

/// Lower one children level into a region's ops, in document order.
pub(crate) fn lower_children<'a>(
    cx: &mut Cx<'a>,
    children: &[SurfaceChild<'a>],
    ns: Namespace,
) -> Vec<'a, Op<'a>> {
    let mut out: Vec<'a, Op<'a>> = Vec::new_in(&cx.allocator);
    let mut i = 0usize;
    while i < children.len() {
        match &children[i] {
            SurfaceChild::Element(element) => {
                let analyzed = analyze(element);
                match analyzed.branch {
                    Some((idx, BranchKind::If)) => {
                        i = lower_if_group(cx, children, i, (element, analyzed, idx), ns, &mut out);
                        continue;
                    }
                    Some((idx, BranchKind::ElseIf | BranchKind::Else)) => {
                        let attr = &element.open.attrs[idx];
                        cx.error(
                            attr_span(cx, attr),
                            String::from("v-else/v-else-if has no adjacent v-if."),
                        );
                        cx.record(
                            "error.v-else-orphan",
                            None,
                            attr_slice(cx, attr),
                            String::default(),
                            attr_span(cx, attr),
                        );
                        out.push(lower_with_for(cx, element, &analyzed, ns));
                    }
                    None => out.push(lower_with_for(cx, element, &analyzed, ns)),
                }
            }
            other => lower_leaf(cx, other, &mut out),
        }
        i += 1;
    }
    out
}

/// Whether a child may stand between two branches of one chain without
/// breaking it (and is dropped when the chain consumes it).
fn is_branch_gap(child: &SurfaceChild<'_>) -> bool {
    match child {
        SurfaceChild::Comment(_) => true,
        SurfaceChild::Text(token) => token.text.trim().is_empty(),
        _ => false,
    }
}

/// Lower a `v-if` chain starting at `start`. Returns the index just past
/// the last consumed sibling.
fn lower_if_group<'a>(
    cx: &mut Cx<'a>,
    children: &[SurfaceChild<'a>],
    start: usize,
    (first, first_analyzed, first_attr): (&Element<'a>, Analyzed<'a>, usize),
    ns: Namespace,
    out: &mut Vec<'a, Op<'a>>,
) -> usize {
    // Scan the chain first: branches plus the gap nodes each consumes.
    let mut branches: StdVec<Branch<'a, '_>> = StdVec::new();
    branches.push((first, first_analyzed, first_attr, StdVec::new()));
    let mut j = start + 1;
    let mut pending: StdVec<usize> = StdVec::new();
    while j < children.len() {
        match &children[j] {
            gap if is_branch_gap(gap) => pending.push(j),
            SurfaceChild::Element(element) => {
                let analyzed = analyze(element);
                match analyzed.branch {
                    Some((idx, kind @ (BranchKind::ElseIf | BranchKind::Else))) => {
                        branches.push((element, analyzed, idx, core::mem::take(&mut pending)));
                        j += 1;
                        if kind == BranchKind::Else {
                            break;
                        }
                        continue;
                    }
                    _ => break,
                }
            }
            _ => break,
        }
        j += 1;
    }
    // Gap nodes past the last branch were scanned but not consumed; they
    // re-enter the main loop.
    let consumed_until = j - pending.len();

    let node = cx.mint_op();
    let last_end = branches
        .last()
        .map(|(element, ..)| element_span(cx, element).end)
        .unwrap_or_else(|| element_span(cx, first).end);
    let span = Span::new(cx.offset(first.open.lt_name.text), last_end);
    let head_attr = &first.open.attrs[first_attr];
    cx.record(
        "lower.if",
        node,
        attr_slice(cx, head_attr),
        cstr!("ui.if branches={}", branches.len()),
        span,
    );

    let mut lowered: Vec<'a, IfBranch<'a>> = Vec::new_in(&cx.allocator);
    for (element, analyzed, attr_idx, gaps) in branches {
        for gap in gaps {
            if let SurfaceChild::Text(token) | SurfaceChild::Comment(token) = &children[gap] {
                let gap_span = cx.token_span(token);
                cx.record(
                    "drop.branch-gap",
                    None,
                    token.text,
                    String::default(),
                    gap_span,
                );
            }
        }
        let attr = &element.open.attrs[attr_idx];
        let kind = match analyzed.branch {
            Some((_, kind)) => kind,
            None => BranchKind::If,
        };
        let condition = match kind {
            BranchKind::Else => None,
            BranchKind::If | BranchKind::ElseIf => {
                let text = attr_value_text(element, attr_idx);
                if text.map(str::trim).is_none_or(str::is_empty) {
                    cx.error(
                        attr_span(cx, attr),
                        String::from("v-if/v-else-if is missing expression."),
                    );
                }
                let slice = match text {
                    Some(text) => text,
                    // No authored value at all: a zero-width position at
                    // the end of the directive name, admitted through the
                    // same total rule (refused as empty).
                    None => cx.hole_at(cx.token_span(&attr.name).end),
                };
                Some(expr_at(cx, slice))
            }
        };
        let region = Region {
            ops: branch_body(cx, element, &analyzed, ns),
        };
        lowered.push(IfBranch {
            condition,
            region,
            span: element_span(cx, element),
        });
    }
    out.push(Op::If(Box::new_in(
        IfOp {
            branches: lowered,
            span,
        },
        &cx.allocator,
    )));
    consumed_until
}

/// The ops a branch's element contributes: its `v-for` wrap when it has
/// one, its children directly when it is an unwrapped `<template>`, the
/// element op otherwise.
fn branch_body<'a>(
    cx: &mut Cx<'a>,
    element: &Element<'a>,
    analyzed: &Analyzed<'a>,
    ns: Namespace,
) -> Vec<'a, Op<'a>> {
    if analyzed.vfor.is_some() {
        let op = lower_for(cx, element, analyzed, ns);
        let mut ops: Vec<'a, Op<'a>> = Vec::new_in(&cx.allocator);
        ops.push(op);
        return ops;
    }
    if element.tag() == "template" {
        cx.report_missing_close(element);
        record_template_drops(cx, element, analyzed);
        return lower_children(cx, &element.children, ns);
    }
    let op = element_core(cx, element, analyzed, ns);
    let mut ops: Vec<'a, Op<'a>> = Vec::new_in(&cx.allocator);
    ops.push(op);
    ops
}

/// A `<template>` wrapper the lowering unwraps has no op to carry its
/// remaining attributes; each is dropped under an `Info` diagnostic and
/// a record — dropping is never silent.
pub(crate) fn record_template_drops<'a>(
    cx: &mut Cx<'a>,
    element: &Element<'a>,
    analyzed: &Analyzed<'a>,
) {
    for (index, attr) in element.open.attrs.iter().enumerate() {
        if Some(index) == analyzed.branch.map(|(idx, _)| idx) || Some(index) == analyzed.vfor {
            continue;
        }
        cx.info(
            attr_span(cx, attr),
            cstr!(
                "`{}` on an unwrapped `<template>` wrapper has no S2 home at P2-8; it is dropped under provenance",
                attr.name.text
            ),
        );
        cx.record(
            "drop.template-attribute",
            None,
            attr_slice(cx, attr),
            String::default(),
            attr_span(cx, attr),
        );
    }
}

/// Lower an element, wrapping it in its `ui.for` when it carries one.
pub(crate) fn lower_with_for<'a>(
    cx: &mut Cx<'a>,
    element: &Element<'a>,
    analyzed: &Analyzed<'a>,
    ns: Namespace,
) -> Op<'a> {
    if analyzed.vfor.is_some() {
        lower_for(cx, element, analyzed, ns)
    } else {
        element_core(cx, element, analyzed, ns)
    }
}
