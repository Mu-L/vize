//! `ui.model` - the two-way binding contract, never its realization.
//!
//! `v-model` is not sugar for `:value` + `@input`: the runtime realization
//! guards IME composition, handles checkbox arrays, `.lazy`'s
//! change-vs-input switch, and select-multiple. So the neutral core
//! carries **the contract only** - what is read, what is written, the
//! value-type flow - which is all lint, the reactivity lattice, and type
//! projection need, and which Svelte's `bind:` lowers to identically
//! (charter #40). Each S4 target picks the realization at lowering: VDOM
//! emits runtime directive references, Vapor calls upstream vapor helpers,
//! SSR renders attributes. IME/composition handling is **runtime-owned by
//! declaration** (charter #23 tiering); the compiler's obligation ends at
//! selecting the realization and preserving this contract.

use vize_carton::{Span, Vec};

use super::Attribute;
use crate::expr::ExprSlot;

/// The two-way binding contract of a [`ModelOp`].
///
/// The value-type flow is the pair's law: **the type of what is read is
/// the type of what is written** - one declared value type flowing
/// view-ward through `read` and model-ward through `write`. The law lives
/// on the pair rather than in a third field because, until P2-5b gives the
/// slots identity, any flow *data* would either be a one-variant enum or a
/// speculation on type-system structure that belongs to the projection;
/// the moment the slots are real, the flow is checkable on them directly.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub struct BindingContract {
    /// What the view reads (reserved; P2-5b).
    pub read: ExprSlot,
    /// What updates write into (reserved; P2-5b). Usually the same
    /// authored expression as `read`; custom accessors split them.
    pub write: ExprSlot,
}

/// `ui.model` - a two-way binding, attached to one element or component.
///
/// Realization is never expanded in S2. Element kind and dialect modifiers
/// (`.lazy`, `.number`, `.trim`, the authored argument) ride as
/// [`Attribute`]s so the contract stays dialect-neutral while lowering
/// still sees everything it needs to select a realization.
#[derive(Debug)]
pub struct ModelOp<'a> {
    /// The binding contract (see [`BindingContract`] for the flow law).
    pub contract: BindingContract,
    /// Element kind and dialect modifiers, in lowering-declared order.
    pub attributes: Vec<'a, Attribute<'a>>,
    /// The authored binding's source range.
    pub span: Span,
}

/// See [`crate::op`] for the guard rationale; figures move when P2-5b
/// lands.
#[cfg(target_pointer_width = "64")]
const _: () = {
    assert!(core::mem::size_of::<BindingContract>() == 0);
    assert!(core::mem::size_of::<ModelOp<'_>>() == 32);
};
