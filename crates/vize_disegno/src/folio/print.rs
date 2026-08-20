//! Canonical printer for [`DisegnoFolio`].
//!
//! `Full` mode is the injective, parseable form; `Display` elides every
//! ` @start:end` span tail (a semantic elision, hand-written per the P2-4
//! boundary) and changes nothing else. Indentation is two spaces per
//! nesting level; the fixed grouping under an element - attributes, then
//! bindings, then children - is part of the canonical form.

use core::fmt::{Result, Write};

use vize_carton::Span;

use super::DisegnoFolio;
use super::owned::{FolioAttribute, FolioBinding, FolioName, FolioOp, FolioVueDirective};
use crate::op::Namespace;
use vize_davinci::folio::FolioMode;

pub(super) fn print<W: Write>(folio: &DisegnoFolio, w: &mut W, mode: FolioMode) -> Result {
    writeln!(w, "[disegno]")?;
    writeln!(w, "ops={}", folio.op_count())?;
    writeln!(w)?;

    if folio.ops.is_empty() {
        return Ok(());
    }
    writeln!(w, "[disegno.ops]")?;
    for op in &folio.ops {
        print_op(w, op, 0, mode)?;
    }
    writeln!(w)
}

fn indent<W: Write>(w: &mut W, depth: usize) -> Result {
    for _ in 0..depth {
        w.write_str("  ")?;
    }
    Ok(())
}

/// Write the span tail in `Full` mode, nothing in `Display`, then the
/// newline either way.
fn end_line<W: Write>(w: &mut W, span: Span, mode: FolioMode) -> Result {
    if mode == FolioMode::Full {
        write!(w, " @{}:{}", span.start, span.end)?;
    }
    w.write_char('\n')
}

/// Write one quoted string with the format's escapes.
fn quoted<W: Write>(w: &mut W, text: &str) -> Result {
    w.write_char('"')?;
    for c in text.chars() {
        match c {
            '"' => w.write_str("\\\"")?,
            '\\' => w.write_str("\\\\")?,
            '\n' => w.write_str("\\n")?,
            '\r' => w.write_str("\\r")?,
            '\t' => w.write_str("\\t")?,
            other => w.write_char(other)?,
        }
    }
    w.write_char('"')
}

fn print_name<W: Write>(w: &mut W, name: &FolioName) -> Result {
    match name {
        FolioName::Static(text) => quoted(w, text.as_str()),
        FolioName::Dynamic(_) => w.write_str("?expr"),
    }
}

fn print_attribute<W: Write>(
    w: &mut W,
    attribute: &FolioAttribute,
    depth: usize,
    mode: FolioMode,
) -> Result {
    indent(w, depth)?;
    write!(w, "attr {}", attribute.name)?;
    if let Some(value) = &attribute.value {
        w.write_char('=')?;
        quoted(w, value.as_str())?;
    }
    end_line(w, attribute.span, mode)
}

fn print_binding<W: Write>(
    w: &mut W,
    binding: &FolioBinding,
    depth: usize,
    mode: FolioMode,
) -> Result {
    match binding {
        FolioBinding::Model(model) => {
            indent(w, depth)?;
            w.write_str("ui.model read=?expr write=?expr")?;
            end_line(w, model.span, mode)?;
            for attribute in &model.attributes {
                print_attribute(w, attribute, depth + 1, mode)?;
            }
            Ok(())
        }
        FolioBinding::VueDirective(directive) => print_directive(w, directive, depth, mode),
    }
}

fn print_directive<W: Write>(
    w: &mut W,
    directive: &FolioVueDirective,
    depth: usize,
    mode: FolioMode,
) -> Result {
    indent(w, depth)?;
    w.write_str("vue.directive ")?;
    quoted(w, directive.name.as_str())?;
    if let Some(argument) = &directive.argument {
        w.write_str(" arg=")?;
        print_name(w, argument)?;
    }
    if !directive.modifiers.is_empty() {
        w.write_str(" mods=\"")?;
        for (i, modifier) in directive.modifiers.iter().enumerate() {
            if i > 0 {
                w.write_char(',')?;
            }
            w.write_str(modifier.as_str())?;
        }
        w.write_char('"')?;
    }
    if directive.value.is_some() {
        w.write_str(" value=?expr")?;
    }
    end_line(w, directive.span, mode)
}

fn print_op<W: Write>(w: &mut W, op: &FolioOp, depth: usize, mode: FolioMode) -> Result {
    match op {
        FolioOp::Element(element) => {
            indent(w, depth)?;
            write!(w, "ui.element {}", element.tag)?;
            match element.namespace {
                Namespace::Html => {}
                Namespace::Svg => w.write_str(" ns=svg")?,
                Namespace::MathMl => w.write_str(" ns=mathml")?,
            }
            end_line(w, element.span, mode)?;
            print_owner_body(
                w,
                &element.attributes,
                &element.bindings,
                &element.children,
                depth + 1,
                mode,
            )
        }
        FolioOp::Component(component) => {
            indent(w, depth)?;
            write!(w, "ui.component {}", component.name)?;
            end_line(w, component.span, mode)?;
            print_owner_body(
                w,
                &component.attributes,
                &component.bindings,
                &component.children,
                depth + 1,
                mode,
            )
        }
        FolioOp::Text(text) => {
            indent(w, depth)?;
            w.write_str("ui.text ")?;
            quoted(w, text.content.as_str())?;
            end_line(w, text.span, mode)
        }
        FolioOp::Interpolation(interpolation) => {
            indent(w, depth)?;
            w.write_str("ui.interpolation ?expr")?;
            end_line(w, interpolation.span, mode)
        }
        FolioOp::If(if_op) => {
            indent(w, depth)?;
            w.write_str("ui.if")?;
            end_line(w, if_op.span, mode)?;
            for branch in &if_op.branches {
                indent(w, depth + 1)?;
                w.write_str("branch")?;
                if branch.condition.is_some() {
                    w.write_str(" ?expr")?;
                }
                end_line(w, branch.span, mode)?;
                for child in &branch.ops {
                    print_op(w, child, depth + 2, mode)?;
                }
            }
            Ok(())
        }
        FolioOp::For(for_op) => {
            indent(w, depth)?;
            w.write_str("ui.for source=?expr value=?expr")?;
            if for_op.binding.key.is_some() {
                w.write_str(" key=?expr")?;
            }
            if for_op.binding.index.is_some() {
                w.write_str(" index=?expr")?;
            }
            end_line(w, for_op.span, mode)?;
            for child in &for_op.ops {
                print_op(w, child, depth + 1, mode)?;
            }
            Ok(())
        }
        FolioOp::Slot(slot) => {
            indent(w, depth)?;
            w.write_str("ui.slot name=")?;
            print_name(w, &slot.name)?;
            end_line(w, slot.span, mode)?;
            for child in &slot.fallback {
                print_op(w, child, depth + 1, mode)?;
            }
            Ok(())
        }
    }
}

fn print_owner_body<W: Write>(
    w: &mut W,
    attributes: &[FolioAttribute],
    bindings: &[FolioBinding],
    children: &[FolioOp],
    depth: usize,
    mode: FolioMode,
) -> Result {
    for attribute in attributes {
        print_attribute(w, attribute, depth, mode)?;
    }
    for binding in bindings {
        print_binding(w, binding, depth, mode)?;
    }
    for child in children {
        print_op(w, child, depth, mode)?;
    }
    Ok(())
}
