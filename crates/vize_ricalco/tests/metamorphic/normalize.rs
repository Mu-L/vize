//! The declared normalization of the TS-21 oracle.
//!
//! The oracle compares S2 folios of original and mutant as **full
//! normalized artifacts**: whole-document `Display`-mode prints, never a
//! partial match (TS-13). `Display` is the `folio-format.md` elision —
//! every ` @s:e` span, line tails and expression payloads alike, and
//! nothing else — which is exactly the quotient a byte-shifting mutation
//! needs; the `ops=` header is recomputed by the printer from the
//! normalized tree, so it needs no rule of its own. On top of that,
//! each mutator declares the minimal structural quotient its
//! justification licenses (`mutators.rs` for the arguments):
//!
//! - `sort_attrs` (reorder only): `attr` lines under one owner sort by
//!   name, then value — the canonical quotient by the permutation the
//!   mutator induces.
//! - `merge_text` (split/merge, whitespace): adjacent `ui.text` lines in
//!   one region concatenate, the `transform_text` merge applied at the
//!   folio.
//! - `condense` (whitespace only): the mirror of Vue's `condense`
//!   whitespace strategy (`crates/vize_armature/src/parser/whitespace.rs`,
//!   cited rule by rule below), applied per region with the `<pre>`
//!   subtree exemption.
//!
//! A normalization applied to both sides can only mask differences,
//! never invent one; what each rule masks is exactly what its mutator's
//! justification argues Vue erases. The sensitivity pins in `main.rs`
//! prove the quotient does not collapse real differences.

use vize_carton::String;
use vize_davinci::folio::{Folio, FolioMode};
use vize_disegno::folio::{DisegnoFolio, FolioAttribute, FolioBinding, FolioOp, FolioText};

use super::sites::is_vue_ws;

/// Which structural rules a comparison applies (spans always elide).
#[derive(Debug, Clone, Copy, Default)]
pub struct Normalization {
    pub sort_attrs: bool,
    pub merge_text: bool,
    pub condense: bool,
}

impl Normalization {
    pub const REORDER: Self = Self {
        sort_attrs: true,
        merge_text: false,
        condense: false,
    };
    pub const WRAP: Self = Self {
        sort_attrs: false,
        merge_text: false,
        condense: false,
    };
    pub const TEXT: Self = Self {
        sort_attrs: false,
        merge_text: true,
        condense: false,
    };
    pub const WHITESPACE: Self = Self {
        sort_attrs: false,
        merge_text: true,
        condense: true,
    };
}

/// The full normalized artifact: apply `rules`, print `Display`.
pub fn normalized_display(folio: &DisegnoFolio, rules: Normalization) -> String {
    let mut folio = folio.clone();
    walk_region(&mut folio.ops, rules, false);
    folio.print_to_string(FolioMode::Display)
}

fn walk_region(ops: &mut Vec<FolioOp>, rules: Normalization, in_pre: bool) {
    if rules.merge_text {
        merge_adjacent_text(ops);
    }
    if rules.condense && !in_pre {
        condense(ops);
    }
    for op in ops.iter_mut() {
        match op {
            FolioOp::Element(element) => {
                if rules.sort_attrs {
                    sort_attrs(&mut element.attributes);
                }
                sort_binding_attrs(rules, &mut element.bindings);
                let child_pre = in_pre || element.tag.as_str() == "pre";
                walk_region(&mut element.children, rules, child_pre);
            }
            FolioOp::Component(component) => {
                if rules.sort_attrs {
                    sort_attrs(&mut component.attributes);
                }
                sort_binding_attrs(rules, &mut component.bindings);
                walk_region(&mut component.children, rules, in_pre);
            }
            FolioOp::If(if_op) => {
                for branch in &mut if_op.branches {
                    walk_region(&mut branch.ops, rules, in_pre);
                }
            }
            FolioOp::For(for_op) => walk_region(&mut for_op.ops, rules, in_pre),
            FolioOp::Slot(slot) => walk_region(&mut slot.fallback, rules, in_pre),
            FolioOp::Text(_) | FolioOp::Interpolation(_) => {}
        }
    }
}

fn sort_attrs(attrs: &mut [FolioAttribute]) {
    attrs.sort_by(|a, b| {
        (a.name.as_str(), a.value.as_deref()).cmp(&(b.name.as_str(), b.value.as_deref()))
    });
}

fn sort_binding_attrs(rules: Normalization, bindings: &mut [FolioBinding]) {
    if !rules.sort_attrs {
        return;
    }
    for binding in bindings {
        if let FolioBinding::Model(model) = binding {
            sort_attrs(&mut model.attributes);
        }
    }
}

fn merge_adjacent_text(ops: &mut Vec<FolioOp>) {
    let mut i = 0;
    while i < ops.len() {
        if let FolioOp::Text(_) = ops[i] {
            while i + 1 < ops.len() {
                let FolioOp::Text(next) = &ops[i + 1] else {
                    break;
                };
                let (content, end) = (next.content.clone(), next.span.end);
                let FolioOp::Text(text) = &mut ops[i] else {
                    unreachable!()
                };
                text.content.push_str(content.as_str());
                text.span.end = end;
                ops.remove(i + 1);
            }
        }
        i += 1;
    }
}

/// A `ui.text` op whose content is entirely Vue whitespace
/// (`whitespace.rs:167-170`).
fn is_ws_text(op: &FolioOp) -> bool {
    matches!(op, FolioOp::Text(text) if text.content.chars().all(is_vue_ws))
}

/// `whitespace.rs:173-178`.
fn ws_has_newline(op: &FolioOp) -> bool {
    matches!(
        op,
        FolioOp::Text(text) if text.content.contains('\n') || text.content.contains('\r')
    )
}

/// `whitespace.rs:181-187`: interpolations and non-whitespace text.
fn is_text_like(op: &FolioOp) -> bool {
    match op {
        FolioOp::Interpolation(_) => true,
        FolioOp::Text(text) => !text.content.chars().all(is_vue_ws),
        _ => false,
    }
}

/// The condense mirror over one region's ops — the same algorithm as
/// `condense_whitespace` (`whitespace.rs:69-165`), with folio ops in
/// place of `TemplateChildNode`s. Recursion (and its `<pre>` guard)
/// lives in [`walk_region`].
fn condense(ops: &mut Vec<FolioOp>) {
    while ops.first().is_some_and(is_ws_text) {
        ops.remove(0);
    }
    while ops.last().is_some_and(is_ws_text) {
        ops.pop();
    }
    let mut i = 0;
    while i < ops.len() {
        if is_ws_text(&ops[i]) {
            let mut run_end = i + 1;
            let mut has_newline = ws_has_newline(&ops[i]);
            while run_end < ops.len() && is_ws_text(&ops[run_end]) {
                has_newline |= ws_has_newline(&ops[run_end]);
                run_end += 1;
            }
            let prev_is_text = (0..i)
                .rev()
                .find(|&idx| !is_ws_text(&ops[idx]))
                .is_some_and(|idx| is_text_like(&ops[idx]));
            let next_is_text = (run_end..ops.len())
                .find(|&idx| !is_ws_text(&ops[idx]))
                .is_some_and(|idx| is_text_like(&ops[idx]));
            if !prev_is_text && !next_is_text && has_newline {
                ops.drain(i..run_end);
                continue;
            }
            let FolioOp::Text(text) = &mut ops[i] else {
                unreachable!()
            };
            text.content = String::from(" ");
            ops.drain(i + 1..run_end);
        } else if let FolioOp::Text(text) = &mut ops[i] {
            collapse_internal_runs(text);
        }
        i += 1;
    }
}

/// `condense_internal_whitespace` (`whitespace.rs:22-61`): collapse every
/// maximal run of the alphabet inside mixed text to a single U+0020.
fn collapse_internal_runs(text: &mut FolioText) {
    let mut out = String::with_capacity(text.content.len());
    let mut prev_ws = false;
    for c in text.content.chars() {
        if is_vue_ws(c) {
            if !prev_ws {
                out.push(' ');
                prev_ws = true;
            }
        } else {
            out.push(c);
            prev_ws = false;
        }
    }
    if out.as_str() != text.content.as_str() {
        text.content = out;
    }
}
