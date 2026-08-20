//! The `vue.*` dialect family: genuinely Vue-specific ops that ride along
//! the neutral core instead of shaping it.
//!
//! Exactly one op lives here today, and that is the rule, not a gap: a
//! dialect op lands with the transform that needs it (P2-9), never
//! speculatively. The fairness litmus test (P2-16) is what keeps this
//! family honest - a lint rule written against `ui.*` must run unchanged
//! on SFC and JSX, so anything only Vue understands belongs here.

use vize_carton::{Span, Vec};

use super::DynamicName;
use crate::expr::ExprRef;

/// `vue.directive` - a Vue custom directive (`v-pin:top.lazy="value"`),
/// carried through S2 for a consumer that understands it.
///
/// Built-in directives never appear here: they normalize into `ui.*` ops
/// at lowering (`v-if` into [`super::IfOp`], `v-model` into
/// [`super::ModelOp`], ...); only user-defined directives survive as
/// dialect ops, exactly as the shipped pipeline emits runtime directive
/// references for them today.
#[derive(Debug)]
pub struct VueDirectiveOp<'a> {
    /// Directive name without the `v-` prefix, a slice of the source.
    pub name: &'a str,
    /// The authored argument (`v-pin:top`, `v-pin:[dir]`), when present.
    pub argument: Option<DynamicName<'a>>,
    /// Modifier names in authored order, without their leading dots.
    pub modifiers: Vec<'a, &'a str>,
    /// The directive's value expression, when authored.
    pub value: Option<ExprRef<'a>>,
    /// The whole directive's source range.
    pub span: Span,
}

/// See [`crate::op`] for the guard rationale.
#[cfg(target_pointer_width = "64")]
const _: () = assert!(core::mem::size_of::<VueDirectiveOp<'_>>() == 88);
