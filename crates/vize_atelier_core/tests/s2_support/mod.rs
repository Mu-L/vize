//! The P2-9 differential comparator: legacy transform lane vs the S2
//! passes, compared at the DOM-output level — the facts DOM codegen
//! consumes from an if structure (chain order, branch count and order,
//! condition text, branch keys — series 1) and from a for structure
//! (document order, source text, value/key/index alias texts — series
//! 2: `renderList`'s whole input surface; the iterated element's `key`
//! prop stays element surface in both lanes and is compared there by
//! neither, exactly as legacy codegen reads it per vnode). The
//! byte-level DOM comparison arrives when a DOM backend exists to emit
//! from S2 (P2-11); until then this projection is the strongest
//! output-determining oracle the transform lane has, and TS-11
//! (`corpus-diff --surface compiler`) holds the actual output bytes
//! still. Series 3 adds the slot projection — component slot grouping
//! (canonical names with their invented-vs-authored class, params
//! texts, group order) and outlet names — in the [`slots`] module.
//! Series 4 adds the text projection — the merged text-unit surface
//! (`createTextVNode` boundaries with their static/dynamic parts,
//! condensed text included) — in the [`text`] module.
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
//! so the pass's own duplicate-key errors never mask a comparison; a
//! malformed or expressionless `v-for` skips here, matching the legacy
//! transform's refusal to build a `ForNode` from it), dynamic keys
//! (deferred until `ui.bind`), template-wrapper keys (dropped at
//! lowering — the recorded series gap), slot-outlet keys (no S2
//! attribute surface), compound condition rebuilds, compound
//! source/alias rebuilds in a for's binding surface, and the slot
//! projection's counted classes — conditional carriers, the `v-slots`
//! spread, filler-only implicit defaults ([`slots`] module docs,
//! series 3).
//! Recovery-level legacy notes (`ErrorCode::is_recovery` — spec repairs
//! such as self-closing rewrites the parser already applied) do **not**
//! skip: the first corpus run measured them on 3,027 of 12,021
//! templates, and comparing them held zero divergence, so excluding
//! them would have quietly shrunk the claim by a quarter. Divergence
//! inside the compared domain panics (TS-25): investigate, never
//! average.

pub mod battery;
mod checks;
pub mod old_lane;
pub mod s2_lane;
pub mod slots;
pub mod slots_old;
pub mod text;
pub mod text_old;

pub use battery::BATTERY;
pub use slots::SlotCounters;
pub use text::TextCounters;

use vize_atelier_core::parser::parse_with_options as old_parse_with_options;
use vize_atelier_core::{ParserOptions, TransformOptions, transform};
use vize_carton::Allocator;
use vize_davinci::diagnostic::Severity;
use vize_davinci::pass::NoObserver;
use vize_disegno::folio::DisegnoFolio;
use vize_ricalco::pass::{TRANSFORM_LANE_FLAG, run_transform};

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
    /// `ui.for`s compared (series 2).
    pub for_ops: u64,
    /// Value-alias text comparisons that ran.
    pub for_values: u64,
    /// Key-alias text comparisons that ran.
    pub for_keys: u64,
    /// Index-alias text comparisons that ran.
    pub for_indexes: u64,
    /// Both lanes agreed the value alias is absent (`v-for=" in xs"`).
    pub for_values_absent: u64,
    /// Old lane rebuilt a compound source or alias; no single source
    /// text to compare.
    pub for_compound: u64,
    /// The slot half (series 3): units, groups, outlets, and the
    /// counted classes ([`slots`] module docs).
    pub slots: SlotCounters,
    /// The text half (series 4): units, parts, compounds, and the
    /// counted classes ([`text`] module docs).
    pub text: TextCounters,
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

    // Legacy lane: the shipped parse + transform. Options stay default
    // except `is_pre_tag`, which takes the shipped DOM configuration
    // (`crates/vize_atelier_dom/src/compile/stage_options.rs`) so both
    // lanes exempt `<pre>` from whitespace condensing the same way —
    // the default `|_| false` would condense inside `<pre>`, which no
    // shipped compile does. `is_pre_tag` feeds only the condense
    // strategy, so every pre-series-4 projection is unaffected.
    let old_allocator = Allocator::new();
    let options = ParserOptions {
        is_pre_tag: |tag| tag == "pre",
        ..ParserOptions::default()
    };
    let (mut root, parse_errors) = old_parse_with_options(&old_allocator, source, options);
    if parse_errors.iter().any(|error| !error.code.is_recovery()) {
        counters.skipped_old_parse_errors += 1;
        return;
    }
    let _transform_errors = transform(&old_allocator, &mut root, TransformOptions::default(), None);
    let mut old_chains = Vec::new();
    let mut old_fors = Vec::new();
    old_lane::collect(&root.children, &mut old_chains, &mut old_fors);
    let mut old_units = Vec::new();
    let mut old_outlets = Vec::new();
    slots_old::collect_old(&root.children, source, &mut old_units, &mut old_outlets);
    let mut old_text_units = Vec::new();
    text_old::collect_units(&root.children, &mut old_text_units);

    // S2 lane: sinopia parse -> ricalco lower -> the S2 passes through
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
    let s2 = s2_lane::collect(
        &folio,
        &facts.if_facts,
        &facts.slot_facts,
        &facts.text_facts,
    );

    checks::check(name, source, &old_chains, &s2.chains, counters);
    checks::check_fors(name, source, &old_fors, &s2.fors, counters);
    slots::check(
        name,
        source,
        &old_units,
        &s2.units,
        &old_outlets,
        &s2.outlets,
        &mut counters.slots,
    );
    counters.text.rawtext_excluded += s2.text_rawtext_excluded;
    // The text projection's template-level v-pre class ([`text`] module
    // docs): the legacy parser honours `v-pre` and then erases it from
    // its tree, so the deterministic detector is the S2 lowering's own
    // deferral record.
    let has_vpre = lowered
        .provenance
        .iter()
        .any(|record| record.rule.as_str() == "defer.v-pre");
    if has_vpre {
        counters.text.vpre_templates += 1;
    } else {
        text::check(
            name,
            source,
            &old_text_units,
            &s2.text_units,
            &mut counters.text,
        );
    }
    counters.compared += 1;
}
