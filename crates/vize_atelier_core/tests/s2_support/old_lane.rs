//! The legacy-lane projection: the DOM-output-determining facts of every
//! `IfNode` after the shipped transform ran, in document order.

use vize_atelier_core::{ExpressionNode, IfBranchNode, PropNode, TemplateChildNode};
use vize_carton::String;

/// A branch key as the legacy transform holds it (`user_key`).
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum OldKey {
    /// No key prop was extracted.
    None,
    /// A static `key` attribute; the payload is its authored value
    /// (`None` for a bare attribute, which never collides).
    Static(Option<String>),
    /// A `:key` binding. The S2 lane defers these until `ui.bind` lands,
    /// so the comparator counts rather than compares them.
    Dynamic,
}

/// One branch's projected facts.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct OldBranch {
    /// `None` = unconditional; `Some(None)` = a compound rebuild with no
    /// single source text; `Some(Some(text))` = the trimmed source text.
    pub condition: Option<Option<String>>,
    /// The extracted key prop.
    pub key: OldKey,
    /// Whether the branch carried `<template v-if>` (its wrapper has no
    /// S2 attribute surface, so key comparison is counted instead).
    pub template_if: bool,
}

/// One `v-if` chain.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct OldChain {
    /// The branches, in authored order.
    pub branches: Vec<OldBranch>,
}

/// Collect every chain under `children`, outer before nested, document
/// order — the same order the S2 projection walks.
pub fn collect(children: &[TemplateChildNode<'_>], out: &mut Vec<OldChain>) {
    for child in children {
        match child {
            TemplateChildNode::Element(element) => collect(&element.children, out),
            TemplateChildNode::If(node) => {
                out.push(OldChain {
                    branches: node.branches.iter().map(project_branch).collect(),
                });
                for branch in node.branches.iter() {
                    collect(&branch.children, out);
                }
            }
            TemplateChildNode::IfBranch(branch) => collect(&branch.children, out),
            TemplateChildNode::For(node) => collect(&node.children, out),
            TemplateChildNode::Text(_)
            | TemplateChildNode::Comment(_)
            | TemplateChildNode::Interpolation(_)
            | TemplateChildNode::TextCall(_)
            | TemplateChildNode::CompoundExpression(_)
            | TemplateChildNode::Hoisted(_) => {}
        }
    }
}

fn project_branch(branch: &IfBranchNode<'_>) -> OldBranch {
    let condition = branch
        .condition
        .as_ref()
        .map(|expression| match expression {
            ExpressionNode::Simple(simple) => Some(String::from(simple.content.trim())),
            ExpressionNode::Compound(_) => None,
        });
    let key = match &branch.user_key {
        None => OldKey::None,
        Some(PropNode::Attribute(attribute)) => OldKey::Static(
            attribute
                .value
                .as_ref()
                .map(|value| String::from(value.content)),
        ),
        Some(PropNode::Directive(_)) => OldKey::Dynamic,
    };
    OldBranch {
        condition,
        key,
        template_if: branch.is_template_if,
    }
}
