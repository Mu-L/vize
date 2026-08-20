//! The reserved expression position of the S2 op family.
//!
//! P2-5b owns the expression reference (`ExprRef<'a>`), including the
//! retained-`None` classes P1-5/P1-9 measured (11.73% of corpus rewrites
//! land outside the retained-AST contract). That design is a review point
//! of its own, so this crate does not anticipate it: every expression
//! position holds [`ExprSlot`] until P2-5b replaces it.

/// Placeholder for the expression reference P2-5b decides.
///
/// Zero-sized on purpose: the only information an op carries about an
/// expression today is *that the position exists* (and, through
/// `Option<ExprSlot>`, whether it is occupied). Nothing may branch on it,
/// store data beside it, or grow it - replacing this marker with the real
/// `ExprRef<'a>` is P2-5b's whole deliverable, and the node-size assertions
/// in [`crate::op`] are expected to move when it lands.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub struct ExprSlot;
