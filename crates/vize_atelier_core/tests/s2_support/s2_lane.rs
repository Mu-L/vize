//! The S2-lane projection: the DOM-output-determining facts of every
//! `ui.if` (post v-if pass) and every `ui.for`, in document order.
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

/// One `ui.for`'s projected facts — the binding surface. An alias
/// position is `None` when unauthored (for the value position: the
/// zero-width escape of an absent alias; an *undecomposable* value
/// never reaches the projection, because its lowering error skips the
/// template pre-pass).
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct S2For {
    /// The iterated source's trimmed text.
    pub source: String,
    /// The value alias's trimmed text.
    pub value: Option<String>,
    /// The second position (object key).
    pub key: Option<String>,
    /// The third position (index).
    pub index: Option<String>,
}

/// Collect every chain and every for in `folio`, outer before nested,
/// document order.
pub fn collect(folio: &DisegnoFolio, facts: &SideTable<IfFacts>) -> (Vec<S2Chain>, Vec<S2For>) {
    let mut chains = Vec::new();
    let mut fors = Vec::new();
    let mut next = 0u32;
    walk(&folio.ops, facts, &mut next, &mut chains, &mut fors);
    (chains, fors)
}

fn walk(
    ops: &[FolioOp],
    facts: &SideTable<IfFacts>,
    next: &mut u32,
    chains: &mut Vec<S2Chain>,
    fors: &mut Vec<S2For>,
) {
    for op in ops {
        match op {
            FolioOp::Element(element) => {
                *next += 1 + u32::try_from(element.bindings.len()).expect("binding count fits");
                walk(&element.children, facts, next, chains, fors);
            }
            FolioOp::Component(component) => {
                *next += 1 + u32::try_from(component.bindings.len()).expect("binding count fits");
                walk(&component.children, facts, next, chains, fors);
            }
            FolioOp::Text(_) | FolioOp::Interpolation(_) => *next += 1,
            FolioOp::If(if_op) => {
                let id = NodeId::from_index(*next).expect("page-order ids fit");
                *next += 1;
                let fact = facts.get(id);
                chains.push(S2Chain {
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
                    walk(&branch.ops, facts, next, chains, fors);
                }
            }
            FolioOp::For(for_op) => {
                *next += 1;
                fors.push(S2For {
                    source: expr_text(&for_op.binding.source),
                    value: alias_text(Some(&for_op.binding.value)),
                    key: alias_text(for_op.binding.key.as_ref()),
                    index: alias_text(for_op.binding.index.as_ref()),
                });
                walk(&for_op.ops, facts, next, chains, fors);
            }
            FolioOp::Slot(slot) => {
                *next += 1;
                walk(&slot.fallback, facts, next, chains, fors);
            }
        }
    }
}

/// An alias position's text: `None` when unauthored (absent position or
/// the zero-width hole).
fn alias_text(expr: Option<&FolioExpr>) -> Option<String> {
    let text = expr_text(expr?);
    if text.is_empty() { None } else { Some(text) }
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
