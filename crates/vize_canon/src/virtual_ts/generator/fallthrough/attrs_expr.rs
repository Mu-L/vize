//! Expression-text helpers for the fallthrough scan, split under the
//! 350-line source budget.

use vize_relief::ExpressionNode;

pub(super) fn expression_source<'a>(
    expression: &'a ExpressionNode<'a>,
    source: &'a str,
) -> &'a str {
    match expression {
        ExpressionNode::Simple(simple) => simple.content,
        ExpressionNode::Compound(compound) => compound.loc.span.slice(source),
    }
}

pub(super) fn expression_spreads_attrs(source: &str) -> bool {
    if source == "$attrs" {
        return true;
    }

    let mut rest = source;
    while let Some(index) = rest.find("$attrs") {
        let before = rest[..index].trim_end();
        if before.ends_with("...") {
            return true;
        }
        rest = &rest[index + "$attrs".len()..];
    }
    false
}
