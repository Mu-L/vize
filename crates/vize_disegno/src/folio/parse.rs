//! Parser for the disegno folio text format.
//!
//! Accepts canonical output byte-for-byte and is lenient exactly where the
//! printer normalizes: blank-line placement (separators vanish), the
//! `ops=` count (validated as an integer, recomputed by print), and
//! non-canonical integer spellings inside spans. Everything else is
//! strict: the section order is fixed because there are exactly two
//! sections, the grouping under an element (attributes, bindings,
//! children) is part of the grammar, and a line that does not match is a
//! [`FolioError`] with a 1-based line number.
//!
//! Tree structure is driven by indentation (two spaces per level) over a
//! frame stack: container ops open a frame, a shallower line closes every
//! deeper frame back into its owner. Only tree *shape* is validated here;
//! semantic invariants belong to the S2 verifier (P2-6).

use alloc::vec::Vec;

use vize_carton::cstr;
use vize_davinci::folio::FolioError;

use super::DisegnoFolio;
use super::owned::{
    FolioBinding, FolioBranch, FolioComponent, FolioElement, FolioFor, FolioIf, FolioModel,
    FolioOp, FolioSlot,
};

mod binding_line;
mod expr_token;
mod line;

use line::{Item, err};

/// Which grouped position an open element/component frame is in.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Phase {
    Attrs,
    Bindings,
    Children,
}

/// One open container on the indentation stack.
#[derive(Debug)]
enum Frame {
    Element(FolioElement, Phase),
    Component(FolioComponent, Phase),
    Model(FolioModel),
    If(FolioIf),
    Branch(FolioBranch),
    For(FolioFor),
    Slot(FolioSlot),
}

/// Where in the page the scan currently is.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Section {
    BeforeHeader,
    Header,
    Ops,
}

struct Parser {
    root: Vec<FolioOp>,
    stack: Vec<Frame>,
    section: Section,
    seen_ops_section: bool,
    seen_ops_field: bool,
}

pub(super) fn parse(input: &str) -> Result<DisegnoFolio, FolioError> {
    let mut parser = Parser {
        root: Vec::new(),
        stack: Vec::new(),
        section: Section::BeforeHeader,
        seen_ops_section: false,
        seen_ops_field: false,
    };
    for (idx, line) in input.split('\n').enumerate() {
        parser.line(line, idx + 1)?;
    }
    parser.finish()
}

impl Parser {
    fn line(&mut self, line: &str, line_no: usize) -> Result<(), FolioError> {
        if let Some(name) = line.strip_prefix('[').and_then(|r| r.strip_suffix(']')) {
            return self.enter(name, line_no);
        }
        if line.is_empty() {
            return Ok(());
        }
        match self.section {
            Section::BeforeHeader => {
                Err(err(line_no, cstr!("content before the [disegno] header")))
            }
            Section::Header => self.field_line(line, line_no),
            Section::Ops => self.ops_line(line, line_no),
        }
    }

    fn enter(&mut self, name: &str, line_no: usize) -> Result<(), FolioError> {
        if self.section == Section::BeforeHeader {
            if name == "disegno" {
                self.section = Section::Header;
                return Ok(());
            }
            return Err(err(line_no, cstr!("first section must be [disegno]")));
        }
        match name {
            "disegno" => Err(err(line_no, cstr!("duplicate section [disegno]"))),
            "disegno.ops" => {
                if self.seen_ops_section {
                    return Err(err(line_no, cstr!("duplicate section [disegno.ops]")));
                }
                self.seen_ops_section = true;
                self.section = Section::Ops;
                Ok(())
            }
            other => Err(err(line_no, cstr!("unknown section [{other}]"))),
        }
    }

    fn field_line(&mut self, line: &str, line_no: usize) -> Result<(), FolioError> {
        let Some((name, value)) = line.split_once('=') else {
            return Err(err(line_no, cstr!("field line is missing `=`")));
        };
        if name != "ops" {
            return Err(err(line_no, cstr!("unknown field `{name}`")));
        }
        if self.seen_ops_field {
            return Err(err(line_no, cstr!("duplicate field `ops`")));
        }
        if value.parse::<u64>().is_err() {
            return Err(err(line_no, cstr!("invalid integer `{value}`")));
        }
        // The count is the printer's statement about the tree; parse
        // validates the syntax and discards the value.
        self.seen_ops_field = true;
        Ok(())
    }

    fn ops_line(&mut self, line: &str, line_no: usize) -> Result<(), FolioError> {
        let content = line.trim_start_matches(' ');
        let spaces = line.len() - content.len();
        if !spaces.is_multiple_of(2) {
            return Err(err(line_no, cstr!("odd indentation")));
        }
        let depth = spaces / 2;
        if depth > self.stack.len() {
            return Err(err(line_no, cstr!("over-indented line")));
        }
        while self.stack.len() > depth {
            self.close_top();
        }
        match line::parse_item(content, line_no)? {
            Item::Attr(attribute) => self.push_attr(attribute, line_no),
            Item::Model(model) => {
                self.guard_binding(line_no)?;
                self.stack.push(Frame::Model(model));
                Ok(())
            }
            Item::SlotContent(content) => {
                self.guard_binding(line_no)?;
                self.push_leaf_binding(FolioBinding::SlotContent(content));
                Ok(())
            }
            Item::Directive(directive) => {
                self.guard_binding(line_no)?;
                self.push_leaf_binding(FolioBinding::VueDirective(directive));
                Ok(())
            }
            Item::Branch(branch) => match self.stack.last() {
                Some(Frame::If(_)) => {
                    self.stack.push(Frame::Branch(branch));
                    Ok(())
                }
                None
                | Some(
                    Frame::Element(..)
                    | Frame::Component(..)
                    | Frame::Model(_)
                    | Frame::Branch(_)
                    | Frame::For(_)
                    | Frame::Slot(_),
                ) => Err(err(line_no, cstr!("`branch` outside `ui.if`"))),
            },
            Item::Op(op) => {
                self.guard_child(line_no)?;
                match op {
                    FolioOp::Element(element) => {
                        self.stack.push(Frame::Element(element, Phase::Attrs));
                    }
                    FolioOp::Component(component) => {
                        self.stack.push(Frame::Component(component, Phase::Attrs));
                    }
                    FolioOp::If(if_op) => self.stack.push(Frame::If(if_op)),
                    FolioOp::For(for_op) => self.stack.push(Frame::For(for_op)),
                    FolioOp::Slot(slot) => self.stack.push(Frame::Slot(slot)),
                    FolioOp::Text(_) | FolioOp::Interpolation(_) => self.attach_op(op),
                }
                Ok(())
            }
        }
    }

    fn push_attr(
        &mut self,
        attribute: super::owned::FolioAttribute,
        line_no: usize,
    ) -> Result<(), FolioError> {
        match self.stack.last_mut() {
            Some(Frame::Element(element, phase)) => match phase {
                Phase::Attrs => {
                    element.attributes.push(attribute);
                    Ok(())
                }
                Phase::Bindings => Err(err(line_no, cstr!("attribute after a binding"))),
                Phase::Children => Err(err(line_no, cstr!("attribute after a child"))),
            },
            Some(Frame::Component(component, phase)) => match phase {
                Phase::Attrs => {
                    component.attributes.push(attribute);
                    Ok(())
                }
                Phase::Bindings => Err(err(line_no, cstr!("attribute after a binding"))),
                Phase::Children => Err(err(line_no, cstr!("attribute after a child"))),
            },
            Some(Frame::Model(model)) => {
                model.attributes.push(attribute);
                Ok(())
            }
            Some(Frame::If(_)) => Err(err(line_no, cstr!("expected `branch` under `ui.if`"))),
            None | Some(Frame::Branch(_) | Frame::For(_) | Frame::Slot(_)) => {
                Err(err(line_no, cstr!("`attr` outside an element")))
            }
        }
    }

    /// Attach a completed leaf binding (`ui.slot-content` /
    /// `vue.directive`) to the owner `guard_binding` admitted.
    fn push_leaf_binding(&mut self, binding: FolioBinding) {
        match self.stack.last_mut() {
            Some(Frame::Element(element, _)) => element.bindings.push(binding),
            Some(Frame::Component(component, _)) => component.bindings.push(binding),
            _ => unreachable!("guard_binding admitted the owner"),
        }
    }

    /// A binding line (`ui.model` / `ui.slot-content` / `vue.directive`)
    /// needs an open element or component whose children have not started.
    fn guard_binding(&mut self, line_no: usize) -> Result<(), FolioError> {
        match self.stack.last_mut() {
            Some(Frame::Element(_, phase) | Frame::Component(_, phase)) => {
                if *phase == Phase::Children {
                    return Err(err(line_no, cstr!("binding after a child")));
                }
                *phase = Phase::Bindings;
                Ok(())
            }
            Some(Frame::Model(_)) => Err(err(line_no, cstr!("expected `attr` under `ui.model`"))),
            Some(Frame::If(_)) => Err(err(line_no, cstr!("expected `branch` under `ui.if`"))),
            None | Some(Frame::Branch(_) | Frame::For(_) | Frame::Slot(_)) => {
                Err(err(line_no, cstr!("binding outside an element")))
            }
        }
    }

    /// A region-op line needs a child position: the root, an element or
    /// component body, a branch, a `ui.for` region, or a slot fallback.
    fn guard_child(&self, line_no: usize) -> Result<(), FolioError> {
        match self.stack.last() {
            Some(Frame::If(_)) => Err(err(line_no, cstr!("expected `branch` under `ui.if`"))),
            Some(Frame::Model(_)) => Err(err(line_no, cstr!("expected `attr` under `ui.model`"))),
            None
            | Some(
                Frame::Element(..)
                | Frame::Component(..)
                | Frame::Branch(_)
                | Frame::For(_)
                | Frame::Slot(_),
            ) => Ok(()),
        }
    }

    /// Attach a finished op to the innermost open child position.
    fn attach_op(&mut self, op: FolioOp) {
        match self.stack.last_mut() {
            None => self.root.push(op),
            Some(Frame::Element(element, phase)) => {
                *phase = Phase::Children;
                element.children.push(op);
            }
            Some(Frame::Component(component, phase)) => {
                *phase = Phase::Children;
                component.children.push(op);
            }
            Some(Frame::Branch(branch)) => branch.ops.push(op),
            Some(Frame::For(for_op)) => for_op.ops.push(op),
            Some(Frame::Slot(slot)) => slot.fallback.push(op),
            Some(Frame::If(_) | Frame::Model(_)) => {
                unreachable!("guard_child rejects these parents")
            }
        }
    }

    /// Close the innermost frame back into its owner.
    fn close_top(&mut self) {
        let Some(frame) = self.stack.pop() else {
            return;
        };
        match frame {
            Frame::Element(element, _) => self.attach_op(FolioOp::Element(element)),
            Frame::Component(component, _) => self.attach_op(FolioOp::Component(component)),
            Frame::If(if_op) => self.attach_op(FolioOp::If(if_op)),
            Frame::For(for_op) => self.attach_op(FolioOp::For(for_op)),
            Frame::Slot(slot) => self.attach_op(FolioOp::Slot(slot)),
            Frame::Branch(branch) => match self.stack.last_mut() {
                Some(Frame::If(if_op)) => if_op.branches.push(branch),
                _ => unreachable!("branch frames only open under ui.if"),
            },
            Frame::Model(model) => match self.stack.last_mut() {
                Some(Frame::Element(element, _)) => {
                    element.bindings.push(FolioBinding::Model(model));
                }
                Some(Frame::Component(component, _)) => {
                    component.bindings.push(FolioBinding::Model(model));
                }
                _ => unreachable!("model frames only open under an element"),
            },
        }
    }

    fn finish(mut self) -> Result<DisegnoFolio, FolioError> {
        if self.section == Section::BeforeHeader {
            return Err(err(0, cstr!("missing [disegno] header")));
        }
        if !self.seen_ops_field {
            return Err(err(0, cstr!("missing field `ops`")));
        }
        while !self.stack.is_empty() {
            self.close_top();
        }
        Ok(DisegnoFolio { ops: self.root })
    }
}
