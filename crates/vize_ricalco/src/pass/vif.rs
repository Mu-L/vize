//! The `v-if` pass: the P2-9 port of
//! `crates/vize_atelier_core/src/transforms/v_if.rs` and the
//! sibling-mutation driver in `src/transform/structural.rs`, re-expressed
//! over `ui.if` owned regions.
//!
//! # What survived the port, and where the rest went
//!
//! The old transform did four things. Three are already absorbed by the
//! region design and the P2-8 lowering, which is the point of porting
//! this transform first:
//!
//! - **Chain grouping (the enter/exit sibling mutation)** — done at
//!   lowering: a region-owning `ui.if` is built with its branches from
//!   birth (`vize_ricalco::lower::structural`), so no pass revisits a
//!   sibling list.
//! - **Grammar diagnostics** (`v-if` missing expression, orphan
//!   `v-else`) — emitted at lowering with relief's exact message text.
//! - **Runtime-helper registration** — DOM-backend business; it moves
//!   with P2-11, not with the neutral S2 transform.
//!
//! What remains — and is this pass's body — is the branch-key half:
//! `extract_key_prop`'s lift of the authored `key` off the branch's
//! element into a per-branch fact, and the duplicate-key diagnostic
//! (vuejs/core #13881, `ErrorCode::VIfSameKey`). Static keys only in
//! this installment: a dynamic `:key` is still a P2-8 `defer.v-bind`
//! with no op to read, so its extraction and its collision arm land with
//! the `ui.bind` installment; a `<template v-if>` wrapper's `key` was
//! dropped at lowering (`drop.template-attribute`) and is recorded as a
//! series gap in the P2-9 record.
//!
//! # Classification (the review point)
//!
//! **`MandatoryLowering`, barrier** — see [`DESC`].
//!
//! - *Why mandatory:* skipping it changes meaning, not speed. The key
//!   fact is what keyed branch reuse compiles from, and the duplicate-key
//!   error is a user-visible diagnostic every optimization tier must
//!   emit (the old transform ran unconditionally).
//! - *Why `MandatoryLowering` and not `MandatoryDiagnostic`:* the pass
//!   **mutates the artifact** — the `key` attribute leaves the element's
//!   syntactic surface and becomes a semantic fact — and it is the pass
//!   that establishes the canonical `ui.if` form the verifier's
//!   canonical set (S2V004–S2V006) then holds; a diagnostic pass must
//!   preserve, and this one does not.
//! - *Why not `Optional`:* an optional pass may not change what the
//!   program means; dropping this one loses an error and a fact.
//! - *Why barrier:* forced by law 1 (mandatory passes never fuse), and
//!   independently true — the collision check compares facts **across**
//!   an op's branches, which is not the single-visit locality `Fusable`
//!   claims.
//!
//! # Facts and accounting
//!
//! Ids are positional (page order), so the pass re-derives them through
//! the shared [`super::walk`] — op line, attached bindings, then
//! children — and asserts its count against the lowering's minted
//! accounting on every run. [`IfFacts`] is keyed by the `ui.if` op's id;
//! entries exist only for ops with at least one extracted key
//! (sparse-table discipline). Every extraction and every diagnostic
//! leaves a provenance record (`pass.v-if.branch-key` /
//! `error.v-if-same-key`); `before` carries the folio-normalized
//! `key="value"` spelling because the arena attribute does not retain
//! its authored quoting.

use alloc::vec::Vec as StdVec;

use vize_carton::{Span, String, cstr};
use vize_davinci::diagnostic::{Diagnostic, Severity, Stage};
use vize_davinci::id::NodeId;
use vize_davinci::pass::{Fusability, PassDesc, PassKind, Preserved};
use vize_davinci::side_table::SideTable;
use vize_disegno::op::{Attribute, IfOp, Op};
use vize_disegno::provenance::ProvenanceRecord;

use super::walk::{PageWalk, assert_accounting, visit_ops};
use crate::lower::Lowered;

/// The pass name in pipeline strings and folio pages.
pub const NAME: &str = "v-if";

/// The duplicate-key message, byte-identical to relief's
/// `ErrorCode::VIfSameKey` text so the two channels never drift on
/// wording (pinned against relief in the `vize_atelier_core`
/// differential suite, which owns the relief edge).
pub const SAME_KEY_MESSAGE: &str = "v-if/v-else-if branches must use unique keys.";

/// The pass description — classification reasoning in the module docs.
pub const DESC: PassDesc = PassDesc::new(
    NAME,
    PassKind::MandatoryLowering,
    Fusability::Barrier,
    // Attribute-to-fact movement invalidates no analysis: spans, scopes
    // and provenance keys are untouched, and no analysis reads the
    // attribute surface it trims.
    Preserved::ALL,
);

/// One branch's extracted `key`.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct BranchKey {
    /// The authored value; `None` for a bare `key` attribute — which,
    /// exactly as the legacy `extract_key_value_str`, never collides.
    pub value: Option<String>,
    /// The authored attribute's range.
    pub span: Span,
}

/// Per-`ui.if` branch-key facts, one slot per branch in authored order.
#[derive(Debug, Clone, PartialEq, Eq, Default)]
pub struct IfFacts {
    /// `branches[i]` is branch `i`'s extracted key, when it had one.
    pub branches: StdVec<Option<BranchKey>>,
}

/// Facts cross compile boundaries with their artifact (P1-11; the same
/// enforcement `Diagnostic` and `ProvenanceRecord` carry).
const _: () = {
    const fn assert_owned<T: 'static>() {}
    assert_owned::<BranchKey>();
    assert_owned::<IfFacts>();
};

/// 64-bit footprints, guarded like every node-size assert (the wasm32
/// lane is 32-bit).
#[cfg(target_pointer_width = "64")]
const _: () = {
    assert!(core::mem::size_of::<BranchKey>() == 32);
    assert!(core::mem::size_of::<IfFacts>() == 24);
};

/// Run the pass over `lowered`, in place.
///
/// Walks the op tree once in page order (re-deriving positional ids),
/// lifts each branch's static `key` attribute into a [`BranchKey`] fact,
/// and reports duplicate authored keys on the later branch's attribute
/// span. Diagnostics and provenance append to `lowered`'s own channels.
///
/// # Panics
///
/// Panics when the re-derived page-order count disagrees with the
/// lowering's minted accounting — a compiler bug by the id law, never an
/// input property.
#[must_use]
pub fn run(lowered: &mut Lowered<'_>) -> SideTable<IfFacts> {
    let Lowered {
        root,
        op_count,
        diagnostics,
        provenance,
        ..
    } = lowered;
    let mut channels = Channels {
        diagnostics,
        provenance,
        facts: SideTable::new(),
    };
    let mut walk = PageWalk::new();
    visit_ops(&mut walk, &mut root.ops, &mut |id, op| {
        if let Op::If(if_op) = op {
            process_if(&mut channels, id, if_op);
        }
    });
    assert_accounting(&walk, *op_count, NAME);
    channels.facts
}

struct Channels<'l> {
    diagnostics: &'l mut StdVec<Diagnostic>,
    provenance: &'l mut StdVec<ProvenanceRecord>,
    facts: SideTable<IfFacts>,
}

/// Lift each branch's static `key` into a fact, then diagnose duplicate
/// authored values (later branch flagged, per the legacy transform).
fn process_if<'a>(walk: &mut Channels<'_>, id: Option<NodeId>, if_op: &mut IfOp<'a>) {
    let mut keys: StdVec<Option<BranchKey>> = StdVec::with_capacity(if_op.branches.len());
    for (index, branch) in if_op.branches.iter_mut().enumerate() {
        let key = branch_root_attributes(branch.span, &mut branch.region.ops)
            .and_then(|attributes| take_key(attributes));
        if let Some(key) = &key {
            walk.provenance.push(ProvenanceRecord {
                rule: String::from("pass.v-if.branch-key"),
                node: id,
                before: match &key.value {
                    Some(value) => cstr!("key=\"{value}\""),
                    None => String::from("key"),
                },
                after: cstr!("fact key branch={index}"),
                span: key.span,
            });
        }
        keys.push(key);
    }

    for index in 1..keys.len() {
        let Some(BranchKey {
            value: Some(value),
            span,
        }) = &keys[index]
        else {
            continue;
        };
        let collides = keys[..index].iter().any(|earlier| {
            matches!(earlier, Some(BranchKey { value: Some(existing), .. }) if existing == value)
        });
        if collides {
            walk.diagnostics.push(Diagnostic::new(
                Severity::Error,
                Stage::Semantic,
                *span,
                String::from(SAME_KEY_MESSAGE),
            ));
            walk.provenance.push(ProvenanceRecord {
                rule: String::from("error.v-if-same-key"),
                node: id,
                before: cstr!("key=\"{value}\""),
                after: String::default(),
                span: *span,
            });
        }
    }

    if keys.iter().any(Option::is_some)
        && let Some(id) = id
    {
        walk.facts.insert(id, IfFacts { branches: keys });
    }
}

/// The attribute list a branch's key may ride on: the branch region's
/// single root op when it is an element or component **and it is the
/// branch's own carrier** (its span equals the branch span).
///
/// The span-identity guard is what keeps an unwrapped
/// `<template v-if><div key>` honest: the lowering unwraps the wrapper,
/// so the region's single root can be an inner child whose `key`
/// belongs to that child's own vnode, exactly as the legacy transform
/// leaves it — an inner op's span is strictly inside the branch's, the
/// carrier's is equal. A `ui.for` root means the key belongs to `v-for`
/// (Vue 3 precedence — the legacy transform skips extraction the same
/// way); a `ui.slot` root carries no attribute surface.
fn branch_root_attributes<'w, 'a>(
    branch_span: Span,
    ops: &'w mut [Op<'a>],
) -> Option<&'w mut vize_carton::Vec<'a, Attribute<'a>>> {
    let [op] = ops else {
        return None;
    };
    match op {
        Op::Element(element) if element.span == branch_span => Some(&mut element.attributes),
        Op::Component(component) if component.span == branch_span => {
            Some(&mut component.attributes)
        }
        Op::Element(_)
        | Op::Component(_)
        | Op::Text(_)
        | Op::Interpolation(_)
        | Op::If(_)
        | Op::For(_)
        | Op::Slot(_) => None,
    }
}

/// Remove the first `key` attribute, returning it as a fact.
fn take_key<'a>(attributes: &mut vize_carton::Vec<'a, Attribute<'a>>) -> Option<BranchKey> {
    let index = attributes
        .iter()
        .position(|attribute| attribute.name == "key")?;
    let attribute = attributes.remove(index);
    Some(BranchKey {
        value: attribute.value.map(String::from),
        span: attribute.span,
    })
}
