//! `ui.text` / `ui.interpolation` payloads.

use vize_carton::Span;

use crate::expr::ExprSlot;

/// `ui.text` - static text content.
#[derive(Debug)]
pub struct TextOp<'a> {
    /// The text exactly as it should render, a slice of the source (or of
    /// a lowering's arena where entity decoding rewrote it).
    pub content: &'a str,
    /// The text's source range.
    pub span: Span,
}

/// `ui.interpolation` - an expression rendered as text.
#[derive(Debug)]
pub struct InterpolationOp {
    /// The rendered expression (reserved; P2-5b).
    pub expression: ExprSlot,
    /// The interpolation's full source range, delimiters included.
    pub span: Span,
}

/// See [`crate::op`] for the guard rationale; figures move when P2-5b
/// lands.
#[cfg(target_pointer_width = "64")]
const _: () = {
    assert!(core::mem::size_of::<TextOp<'_>>() == 24);
    assert!(core::mem::size_of::<InterpolationOp>() == 8);
};
