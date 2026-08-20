//! Line grammar of the disegno ops section: one op (or structural) line
//! in, one parsed item out.
//!
//! Every `?expr` token is the printed form of a reserved
//! [`ExprSlot`](crate::expr::ExprSlot) position - present/absent is all it
//! encodes until P2-5b. Quoted strings escape `\\`, `\"`, `\n`, `\r`,
//! `\t`; values embedding other control characters, attribute names
//! containing `=`, ` ` or `"`, and modifier names containing `,` or `"`
//! are outside the contract (the derived-page "documented edges" rule).

use vize_carton::{Span, String, cstr};
use vize_davinci::folio::FolioError;

use super::super::owned::{
    FolioAttribute, FolioBranch, FolioComponent, FolioElement, FolioFor, FolioIf,
    FolioInterpolation, FolioModel, FolioName, FolioOp, FolioSlot, FolioText, FolioVueDirective,
};
use crate::expr::ExprSlot;
use crate::op::{BindingContract, ForBinding, Namespace};

/// One classified ops-section line.
pub(in super::super) enum Item {
    Attr(FolioAttribute),
    Model(FolioModel),
    Directive(FolioVueDirective),
    Branch(FolioBranch),
    Op(FolioOp),
}

/// Build a [`FolioError`] attributed to `line_no`.
pub(in super::super) fn err(line_no: usize, message: String) -> FolioError {
    FolioError::new(line_no, message)
}

fn split_word(text: &str) -> (&str, &str) {
    text.split_once(' ').unwrap_or((text, ""))
}

/// Parse a quoted string starting at `rest[0]`; returns the content and
/// the remainder after the closing quote.
fn take_quoted(rest: &str, line_no: usize) -> Result<(String, &str), FolioError> {
    let Some(body) = rest.strip_prefix('"') else {
        return Err(err(line_no, cstr!("expected quoted string")));
    };
    let mut content = String::default();
    let mut chars = body.char_indices();
    while let Some((idx, c)) = chars.next() {
        match c {
            '"' => return Ok((content, &body[idx + 1..])),
            '\\' => match chars.next() {
                Some((_, 'n')) => content.push('\n'),
                Some((_, 'r')) => content.push('\r'),
                Some((_, 't')) => content.push('\t'),
                Some((_, '"')) => content.push('"'),
                Some((_, '\\')) => content.push('\\'),
                Some((_, other)) => {
                    return Err(err(line_no, cstr!("invalid escape `\\{other}`")));
                }
                None => return Err(err(line_no, cstr!("unterminated quoted string"))),
            },
            other => content.push(other),
        }
    }
    Err(err(line_no, cstr!("unterminated quoted string")))
}

/// Parse `@start:end` making up the whole remainder.
fn final_span(rest: &str, line_no: usize) -> Result<Span, FolioError> {
    if rest.is_empty() {
        return Err(err(line_no, cstr!("missing span")));
    }
    let parsed = rest.strip_prefix('@').and_then(|body| {
        let (start, end) = body.split_once(':')?;
        Some(Span::new(start.parse().ok()?, end.parse().ok()?))
    });
    parsed.ok_or_else(|| err(line_no, cstr!("invalid span `{rest}`")))
}

/// Parse the ` @start:end` tail after a completed component.
fn tail_span(rest: &str, line_no: usize) -> Result<Span, FolioError> {
    match rest.strip_prefix(' ') {
        Some(tail) => final_span(tail, line_no),
        None if rest.is_empty() => Err(err(line_no, cstr!("missing span"))),
        None => Err(err(line_no, cstr!("trailing content `{rest}`"))),
    }
}

/// Classify and parse one non-blank, dedented ops-section line.
pub(in super::super) fn parse_item(content: &str, line_no: usize) -> Result<Item, FolioError> {
    let (keyword, rest) = split_word(content);
    match keyword {
        "attr" => attr(rest, line_no),
        "branch" => branch(rest, line_no),
        "ui.element" => element(rest, line_no),
        "ui.component" => component(rest, line_no),
        "ui.text" => text(rest, line_no),
        "ui.interpolation" => interpolation(rest, line_no),
        "ui.if" => Ok(Item::Op(FolioOp::If(FolioIf {
            branches: alloc::vec::Vec::new(),
            span: final_span(rest, line_no)?,
        }))),
        "ui.for" => for_op(rest, line_no),
        "ui.slot" => slot(rest, line_no),
        "ui.model" => model(rest, line_no),
        "vue.directive" => directive(rest, line_no),
        other => Err(err(line_no, cstr!("unknown op `{other}`"))),
    }
}

fn attr(rest: &str, line_no: usize) -> Result<Item, FolioError> {
    let name_end = rest.find(['=', ' ']).unwrap_or(rest.len());
    let (name, after) = rest.split_at(name_end);
    if name.is_empty() {
        return Err(err(line_no, cstr!("missing attribute name")));
    }
    let (value, span) = if let Some(quoted) = after.strip_prefix('=') {
        let (value, tail) = take_quoted(quoted, line_no)?;
        (Some(value), tail_span(tail, line_no)?)
    } else {
        (None, tail_span(after, line_no)?)
    };
    Ok(Item::Attr(FolioAttribute {
        name: String::from(name),
        value,
        span,
    }))
}

fn branch(rest: &str, line_no: usize) -> Result<Item, FolioError> {
    let (condition, span) = if let Some(tail) = rest.strip_prefix("?expr") {
        (Some(ExprSlot), tail_span(tail, line_no)?)
    } else {
        (None, final_span(rest, line_no)?)
    };
    Ok(Item::Branch(FolioBranch {
        condition,
        ops: alloc::vec::Vec::new(),
        span,
    }))
}

fn element(rest: &str, line_no: usize) -> Result<Item, FolioError> {
    let (tag, rest) = split_word(rest);
    if tag.is_empty() {
        return Err(err(line_no, cstr!("missing tag")));
    }
    let (namespace, rest) = if let Some(after) = rest.strip_prefix("ns=") {
        let (name, tail) = split_word(after);
        let namespace = match name {
            "svg" => Namespace::Svg,
            "mathml" => Namespace::MathMl,
            other => return Err(err(line_no, cstr!("invalid namespace `{other}`"))),
        };
        (namespace, tail)
    } else {
        (Namespace::Html, rest)
    };
    Ok(Item::Op(FolioOp::Element(FolioElement {
        tag: String::from(tag),
        namespace,
        attributes: alloc::vec::Vec::new(),
        bindings: alloc::vec::Vec::new(),
        children: alloc::vec::Vec::new(),
        span: final_span(rest, line_no)?,
    })))
}

fn component(rest: &str, line_no: usize) -> Result<Item, FolioError> {
    let (name, rest) = split_word(rest);
    if name.is_empty() {
        return Err(err(line_no, cstr!("missing component name")));
    }
    Ok(Item::Op(FolioOp::Component(FolioComponent {
        name: String::from(name),
        attributes: alloc::vec::Vec::new(),
        bindings: alloc::vec::Vec::new(),
        children: alloc::vec::Vec::new(),
        span: final_span(rest, line_no)?,
    })))
}

fn text(rest: &str, line_no: usize) -> Result<Item, FolioError> {
    let (content, tail) = take_quoted(rest, line_no)?;
    Ok(Item::Op(FolioOp::Text(FolioText {
        content,
        span: tail_span(tail, line_no)?,
    })))
}

fn interpolation(rest: &str, line_no: usize) -> Result<Item, FolioError> {
    let Some(tail) = rest.strip_prefix("?expr") else {
        return Err(err(line_no, cstr!("expected `?expr`")));
    };
    Ok(Item::Op(FolioOp::Interpolation(FolioInterpolation {
        expression: ExprSlot,
        span: tail_span(tail, line_no)?,
    })))
}

fn for_op(rest: &str, line_no: usize) -> Result<Item, FolioError> {
    let Some(mut rest) = rest.strip_prefix("source=?expr value=?expr") else {
        return Err(err(line_no, cstr!("expected `source=?expr value=?expr`")));
    };
    let mut key = None;
    let mut index = None;
    if let Some(tail) = rest.strip_prefix(" key=?expr") {
        key = Some(ExprSlot);
        rest = tail;
    }
    if let Some(tail) = rest.strip_prefix(" index=?expr") {
        index = Some(ExprSlot);
        rest = tail;
    }
    Ok(Item::Op(FolioOp::For(FolioFor {
        binding: ForBinding {
            source: ExprSlot,
            value: ExprSlot,
            key,
            index,
        },
        ops: alloc::vec::Vec::new(),
        span: tail_span(rest, line_no)?,
    })))
}

/// Parse a `name=` value: a quoted static name or the `?expr` marker.
fn name_value(rest: &str, line_no: usize) -> Result<(FolioName, &str), FolioError> {
    if rest.starts_with('"') {
        let (name, tail) = take_quoted(rest, line_no)?;
        return Ok((FolioName::Static(name), tail));
    }
    match rest.strip_prefix("?expr") {
        Some(tail) => Ok((FolioName::Dynamic(ExprSlot), tail)),
        None => Err(err(line_no, cstr!("expected quoted string or `?expr`"))),
    }
}

fn slot(rest: &str, line_no: usize) -> Result<Item, FolioError> {
    let Some(rest) = rest.strip_prefix("name=") else {
        return Err(err(line_no, cstr!("expected `name=`")));
    };
    let (name, tail) = name_value(rest, line_no)?;
    Ok(Item::Op(FolioOp::Slot(FolioSlot {
        name,
        fallback: alloc::vec::Vec::new(),
        span: tail_span(tail, line_no)?,
    })))
}

fn model(rest: &str, line_no: usize) -> Result<Item, FolioError> {
    let Some(tail) = rest.strip_prefix("read=?expr write=?expr") else {
        return Err(err(line_no, cstr!("expected `read=?expr write=?expr`")));
    };
    Ok(Item::Model(FolioModel {
        contract: BindingContract {
            read: ExprSlot,
            write: ExprSlot,
        },
        attributes: alloc::vec::Vec::new(),
        span: tail_span(tail, line_no)?,
    }))
}

fn directive(rest: &str, line_no: usize) -> Result<Item, FolioError> {
    let (name, mut rest) = take_quoted(rest, line_no)?;
    let mut argument = None;
    if let Some(after) = rest.strip_prefix(" arg=") {
        let (value, tail) = name_value(after, line_no)?;
        argument = Some(value);
        rest = tail;
    }
    let mut modifiers = alloc::vec::Vec::new();
    if let Some(after) = rest.strip_prefix(" mods=") {
        let (joined, tail) = take_quoted(after, line_no)?;
        for part in joined.as_str().split(',') {
            if part.is_empty() {
                return Err(err(line_no, cstr!("invalid modifier list")));
            }
            modifiers.push(String::from(part));
        }
        rest = tail;
    }
    let mut value = None;
    if let Some(tail) = rest.strip_prefix(" value=?expr") {
        value = Some(ExprSlot);
        rest = tail;
    }
    Ok(Item::Directive(FolioVueDirective {
        name,
        argument,
        modifiers,
        value,
        span: tail_span(rest, line_no)?,
    }))
}
