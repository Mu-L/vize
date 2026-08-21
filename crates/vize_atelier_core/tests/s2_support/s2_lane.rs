//! The S2-lane projection: the DOM-output-determining facts of every
//! `ui.if` after the v-if pass ran, in document order.
//!
//! Facts are keyed by page-order ids, so the walk re-derives them with
//! the same numbering rule the folio's `ops=` header states: op line,
//! attached bindings, then children.

use vize_carton::String;
use vize_davinci::id::NodeId;
use vize_davinci::side_table::SideTable;
use vize_disegno::folio::{DisegnoFolio, FolioExpr, FolioOp};
use vize_ricalco::pass::IfFacts;

/// What stands as a branch region's single root, for the key-comparison
/// skip classes.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum RootKind {
    /// An element or component — the attribute surface a key rides on.
    Element,
    /// A `ui.for` — the key belongs to the iteration (Vue 3 precedence).
    ForWrapped,
    /// A `ui.slot` — no attribute surface in S2.
    SlotOutlet,
    /// Anything else (unwrapped template content, empty region, ...).
    Other,
}

/// One branch's projected facts.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct S2Branch {
    /// The trimmed condition source text; `None` = unconditional.
    pub condition: Option<String>,
    /// The extracted key fact: `Some(value)` when the pass lifted one
    /// (`Some(None)` for a bare `key`).
    pub key: Option<Option<String>>,
    /// The region's single-root shape.
    pub root: RootKind,
}

/// One `ui.if`.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct S2Chain {
    /// The branches, in authored order.
    pub branches: Vec<S2Branch>,
}

/// Collect every chain in `folio`, outer before nested, document order.
pub fn collect(folio: &DisegnoFolio, facts: &SideTable<IfFacts>) -> Vec<S2Chain> {
    let mut out = Vec::new();
    let mut next = 0u32;
    walk(&folio.ops, facts, &mut next, &mut out);
    out
}

fn walk(ops: &[FolioOp], facts: &SideTable<IfFacts>, next: &mut u32, out: &mut Vec<S2Chain>) {
    for op in ops {
        match op {
            FolioOp::Element(element) => {
                *next += 1 + u32::try_from(element.bindings.len()).expect("binding count fits");
                walk(&element.children, facts, next, out);
            }
            FolioOp::Component(component) => {
                *next += 1 + u32::try_from(component.bindings.len()).expect("binding count fits");
                walk(&component.children, facts, next, out);
            }
            FolioOp::Text(_) | FolioOp::Interpolation(_) => *next += 1,
            FolioOp::If(if_op) => {
                let id = NodeId::from_index(*next).expect("page-order ids fit");
                *next += 1;
                let fact = facts.get(id);
                out.push(S2Chain {
                    branches: if_op
                        .branches
                        .iter()
                        .enumerate()
                        .map(|(index, branch)| S2Branch {
                            condition: branch.condition.as_ref().map(expr_text),
                            key: fact
                                .and_then(|fact| fact.branches.get(index))
                                .and_then(|key| key.as_ref())
                                .map(|key| key.value.clone()),
                            root: root_kind(&branch.ops),
                        })
                        .collect(),
                });
                for branch in &if_op.branches {
                    walk(&branch.ops, facts, next, out);
                }
            }
            FolioOp::For(for_op) => {
                *next += 1;
                walk(&for_op.ops, facts, next, out);
            }
            FolioOp::Slot(slot) => {
                *next += 1;
                walk(&slot.fallback, facts, next, out);
            }
        }
    }
}

fn expr_text(expr: &FolioExpr) -> String {
    match expr {
        FolioExpr::Js { source, .. }
        | FolioExpr::Foreign { source, .. }
        | FolioExpr::Opaque { source, .. } => String::from(source.trim()),
    }
}

fn root_kind(ops: &[FolioOp]) -> RootKind {
    match ops {
        [FolioOp::Element(_)] | [FolioOp::Component(_)] => RootKind::Element,
        [FolioOp::For(_)] => RootKind::ForWrapped,
        [FolioOp::Slot(_)] => RootKind::SlotOutlet,
        _ => RootKind::Other,
    }
}
