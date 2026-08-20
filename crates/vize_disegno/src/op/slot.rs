//! `ui.slot` - the slot outlet, and the static-or-computed name position
//! it shares with `vue.directive` arguments.

use vize_carton::Span;

use super::Region;
use crate::expr::ExprSlot;

/// A name position that may be authored statically or computed at runtime:
/// slot names (`<slot :name="n">`) and directive arguments
/// (`v-pin:[direction]`).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum DynamicName<'a> {
    /// Authored as a literal name, a slice of the source.
    Static(&'a str),
    /// Computed by an expression (reserved; P2-5b).
    Dynamic(ExprSlot),
}

/// `ui.slot` - a slot outlet owning its fallback region.
///
/// Forwarded slot props are one-way bindings and land with `ui.bind`
/// (P2-9); the outlet itself carries only its name and fallback.
#[derive(Debug)]
pub struct SlotOp<'a> {
    /// The outlet name (`default` when the dialect leaves it implicit is a
    /// lowering decision, not this type's).
    pub name: DynamicName<'a>,
    /// Content rendered when the parent passes nothing.
    pub fallback: Region<'a>,
    /// The outlet's full source range.
    pub span: Span,
}

/// See [`crate::op`] for the guard rationale; figures move when P2-5b
/// lands.
#[cfg(target_pointer_width = "64")]
const _: () = {
    assert!(core::mem::size_of::<DynamicName<'_>>() == 16);
    assert!(core::mem::size_of::<SlotOp<'_>>() == 48);
};
