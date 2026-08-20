//! Structured control flow: `ui.if` and `ui.for`.
//!
//! Control flow is regions, not directive attributes: `v-if`, JSX
//! `<Show>`-style patterns and pug conditionals normalize to the same two
//! ops, and each op owns the content it controls (see [`crate::op`] for
//! why ownership is the fusion-tractability point).

use vize_carton::{Span, Vec};

use super::Region;
use crate::expr::ExprSlot;

/// `ui.if` - structured conditional.
///
/// The folio models the structure and the S2 verifier (P2-6) owns the
/// invariants (at least one branch, at most one trailing unconditional
/// branch); the type deliberately encodes neither, matching the "models
/// the dump, not the analysis" folio rule.
#[derive(Debug)]
pub struct IfOp<'a> {
    /// The branches, in authored order.
    pub branches: Vec<'a, IfBranch<'a>>,
    /// The whole conditional's source range, every branch included.
    pub span: Span,
}

/// One branch of a [`IfOp`], owning its region.
#[derive(Debug)]
pub struct IfBranch<'a> {
    /// The branch condition; `None` for the unconditional (`else`) branch.
    pub condition: Option<ExprSlot>,
    /// The content this branch renders.
    pub region: Region<'a>,
    /// The branch's source range.
    pub span: Span,
}

/// `ui.for` - structured iteration over one owned region.
#[derive(Debug)]
pub struct ForOp<'a> {
    /// What is iterated and what each iteration binds.
    pub binding: ForBinding,
    /// The repeated content.
    pub region: Region<'a>,
    /// The whole iteration's source range.
    pub span: Span,
}

/// The iteration binding of a [`ForOp`]: the source and the per-iteration
/// binding positions.
///
/// The value/key/index split mirrors the authored grammar
/// (`(value, key, index) in source`); the positions are expression slots
/// because v-for's binding patterns are one of the retained-`None` classes
/// P2-5b decides.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ForBinding {
    /// The iterated collection, object, or range (reserved; P2-5b).
    pub source: ExprSlot,
    /// The per-iteration value binding (reserved; P2-5b).
    pub value: ExprSlot,
    /// The second binding position (object key), when authored.
    pub key: Option<ExprSlot>,
    /// The third binding position (index), when authored.
    pub index: Option<ExprSlot>,
}

/// See [`crate::op`] for the guard rationale; figures move when P2-5b
/// lands.
#[cfg(target_pointer_width = "64")]
const _: () = {
    assert!(core::mem::size_of::<IfOp<'_>>() == 32);
    assert!(core::mem::size_of::<IfBranch<'_>>() == 40);
    assert!(core::mem::size_of::<ForOp<'_>>() == 40);
    assert!(core::mem::size_of::<ForBinding>() == 2);
};
