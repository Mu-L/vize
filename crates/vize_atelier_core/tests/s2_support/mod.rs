//! The P2-9 series 1 differential comparator: legacy transform lane vs
//! the S2 `v-if` pass, compared at the DOM-output level — the facts DOM
//! codegen consumes from an if structure (chain order, branch count and
//! order, condition text, branch keys). The byte-level DOM comparison
//! arrives when a DOM backend exists to emit from S2 (P2-11); until
//! then this projection is the strongest output-determining oracle the
//! transform lane has, and TS-11 (`corpus-diff --surface compiler`)
//! holds the actual output bytes still.
//!
//! # Why this lives in test space (the dependency direction)
//!
//! `vize_atelier_core` is published; the Davinci crates are not, and
//! the release gate (`tests/tooling/moonbit-publish-crates.test.ts`)
//! rejects a published crate whose release graph names an unpublished
//! one. Dev-dependencies with no version requirement are stripped on
//! publish — the exact carve-out the gate encodes — so the S2 lane and
//! this comparator ride dev-deps, never the compile path. The P1-7
//! in-`src` comparator shape does not apply here because the shipped
//! path has no migrated read yet: the S2 lane runs *beside* the legacy
//! lane, not inside it.
//!
//! # The lane flag (charter #26)
//!
//! `VIZE_DAVINCI_TRANSFORM=legacy` disarms the dual-run: the legacy
//! lane is then the only thing exercised, which is also the shipped
//! default. The plain witness pins non-zero comparison counts, so a
//! flag or cfg regression that silently disarms the lane fails loudly.
//!
//! # Skip classes are counted, never silent
//!
//! The two lanes parse with different S1 front ends, and the S1 v1
//! scope records deliberate tree deviations (no implied-end-tag
//! reconciliation, no entity decoding). The comparator therefore
//! compares exactly the domain both lanes claim to model — templates
//! neither lane **rejects** — and **counts** everything it declines:
//! legacy hard parse errors, S2 error diagnostics (evaluated pre-pass,
//! so the pass's own duplicate-key errors never mask a comparison),
//! dynamic keys (deferred until `ui.bind`), template-wrapper keys
//! (dropped at lowering — the recorded series gap), slot-outlet keys
//! (no S2 attribute surface), and compound condition rebuilds.
//! Recovery-level legacy notes (`ErrorCode::is_recovery` — spec repairs
//! such as self-closing rewrites the parser already applied) do **not**
//! skip: the first corpus run measured them on 3,027 of 12,021
//! templates, and comparing them held zero divergence, so excluding
//! them would have quietly shrunk the claim by a quarter. Divergence
//! inside the compared domain panics (TS-25): investigate, never
//! average.

pub mod battery;
pub mod old_lane;
pub mod s2_lane;

pub use battery::BATTERY;

use vize_atelier_core::parser::parse as old_parse;
use vize_atelier_core::{TransformOptions, transform};
use vize_carton::Allocator;
use vize_davinci::diagnostic::Severity;
use vize_davinci::pass::NoObserver;
use vize_disegno::folio::DisegnoFolio;
use vize_ricalco::pass::{TRANSFORM_LANE_FLAG, run_transform};

use old_lane::{OldChain, OldKey};
use s2_lane::{RootKind, S2Chain};

/// The comparator's process-global accounting, pinned exactly by the
/// plain witness and printed by the corpus entry.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct Counters {
    /// Templates handed to [`compare`].
    pub templates_seen: u64,
    /// Templates dual-run to completion with zero divergence.
    pub compared: u64,
    /// `VIZE_DAVINCI_TRANSFORM=legacy` disarmed the S2 lane.
    pub skipped_legacy_flag: u64,
    /// The legacy parser reported a **hard** error (recovery notes
    /// compare — see the module docs); outside both lanes' shared
    /// domain.
    pub skipped_old_parse_errors: u64,
    /// The S2 lowering reported an `Error` diagnostic (pre-pass).
    pub skipped_s2_errors: u64,
    /// `ui.if` ops compared.
    pub if_ops: u64,
    /// Branches compared.
    pub branches: u64,
    /// Static-key value comparisons that ran.
    pub keys_static: u64,
    /// Old lane saw a `:key` binding; S2 defers it until `ui.bind`.
    pub keys_dynamic: u64,
    /// Old lane extracted a `<template v-if>` wrapper key; the lowering
    /// dropped the wrapper's attributes (the recorded series gap).
    pub keys_template_if: u64,
    /// Old lane extracted a key from a slot outlet; `ui.slot` carries
    /// no attribute surface.
    pub keys_slot_root: u64,
    /// Old lane rebuilt a compound condition; no single source text to
    /// compare.
    pub conditions_compound: u64,
}

/// Dual-run `source` through both lanes and compare the projections.
///
/// # Panics
///
/// Panics on any divergence inside the compared domain (TS-25), with
/// the template and both projections in the message.
pub fn compare(name: &str, source: &str, counters: &mut Counters) {
    counters.templates_seen += 1;
    if std::env::var(TRANSFORM_LANE_FLAG).is_ok_and(|value| value == "legacy") {
        counters.skipped_legacy_flag += 1;
        return;
    }

    // Legacy lane: the shipped parse + transform, default options (no
    // identifier prefixing, so condition text stays authored).
    let old_allocator = Allocator::new();
    let (mut root, parse_errors) = old_parse(&old_allocator, source);
    if parse_errors.iter().any(|error| !error.code.is_recovery()) {
        counters.skipped_old_parse_errors += 1;
        return;
    }
    let _transform_errors = transform(&old_allocator, &mut root, TransformOptions::default(), None);
    let mut old_chains = Vec::new();
    old_lane::collect(&root.children, &mut old_chains);

    // S2 lane: sinopia parse -> ricalco lower -> the v-if pass through
    // the P2-2 pass manager (verifier between passes in debug).
    let s2_allocator = Allocator::new();
    let (tree, surface_errors) = vize_sinopia::parse(&s2_allocator, source);
    let mut lowered = vize_ricalco::lower(&s2_allocator, &tree, &surface_errors);
    if lowered
        .diagnostics
        .iter()
        .any(|diagnostic| diagnostic.severity == Severity::Error)
    {
        counters.skipped_s2_errors += 1;
        return;
    }
    let facts = run_transform(&mut lowered, &mut NoObserver);
    let folio = DisegnoFolio::of(&lowered.root.ops);
    let s2_chains = s2_lane::collect(&folio, &facts.if_facts);

    check(name, source, &old_chains, &s2_chains, counters);
    counters.compared += 1;
}

/// One divergence panic, with everything needed to investigate.
macro_rules! diverged {
    ($name:expr, $source:expr, $old:expr, $s2:expr, $($why:tt)+) => {
        panic!(
            "TS-25 divergence [{}]: {}\ntemplate:\n{}\nlegacy projection: {:#?}\ns2 projection: {:#?}",
            $name, format_args!($($why)+), $source, $old, $s2
        )
    };
}

fn check(name: &str, source: &str, old: &[OldChain], s2: &[S2Chain], counters: &mut Counters) {
    if old.len() != s2.len() {
        diverged!(
            name,
            source,
            old,
            s2,
            "chain count {} vs {}",
            old.len(),
            s2.len()
        );
    }
    for (chain_index, (old_chain, s2_chain)) in old.iter().zip(s2).enumerate() {
        if old_chain.branches.len() != s2_chain.branches.len() {
            diverged!(name, source, old, s2, "chain {chain_index} branch count");
        }
        counters.if_ops += 1;
        for (old_branch, s2_branch) in old_chain.branches.iter().zip(&s2_chain.branches) {
            counters.branches += 1;
            match (&old_branch.condition, &s2_branch.condition) {
                (None, None) => {}
                (Some(None), Some(_)) => counters.conditions_compound += 1,
                (Some(Some(old_text)), Some(s2_text)) if old_text == s2_text => {}
                _ => diverged!(
                    name,
                    source,
                    old,
                    s2,
                    "chain {chain_index} condition {:?} vs {:?}",
                    old_branch.condition,
                    s2_branch.condition
                ),
            }
            if old_branch.template_if {
                if !matches!(old_branch.key, OldKey::None) {
                    counters.keys_template_if += 1;
                }
                continue;
            }
            match (&old_branch.key, &s2_branch.key, s2_branch.root) {
                (OldKey::None, None, _) => {}
                (OldKey::Dynamic, None, _) => counters.keys_dynamic += 1,
                (OldKey::Static(_), None, RootKind::SlotOutlet) => counters.keys_slot_root += 1,
                (OldKey::Static(old_value), Some(s2_value), _) if old_value == s2_value => {
                    counters.keys_static += 1;
                }
                _ => diverged!(
                    name,
                    source,
                    old,
                    s2,
                    "chain {chain_index} key {:?} vs {:?} (root {:?})",
                    old_branch.key,
                    s2_branch.key,
                    s2_branch.root
                ),
            }
        }
    }
}
