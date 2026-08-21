//! TS-20's deterministic half, plain lane: the S1 battery (well-formed
//! and malformed alike) through the full parse → lower pipeline, plus
//! every prefix and suffix truncation — adversarial committed inputs,
//! no fuzzer required, same soundness oracle everywhere.
//!
//! The battery is `vize_sinopia`'s own committed fixture set, included
//! by `#[path]` (the TS-15-validator convention: reuse the artifact,
//! never re-implement it). The aggregate counts at the bottom are the
//! cfg-regression witness the corpus lane re-pins: a change to the
//! lowering's decision surface moves a pinned number loudly in both
//! lanes.

#[expect(
    dead_code,
    reason = "the battery's hole-census fields belong to the TS-19 suites; this lane reuses the sources"
)]
#[path = "../../vize_sinopia/tests/common/mod.rs"]
mod battery;
mod support;

use support::{assert_sound, with_lowered};

#[test]
fn the_battery_scope_is_pinned() {
    assert_eq!(battery::WELL_FORMED.len(), 16);
    assert_eq!(battery::MALFORMED.len(), 26);
}

#[test]
fn every_battery_fixture_lowers_soundly() {
    for fixture in battery::WELL_FORMED.iter().chain(battery::MALFORMED) {
        assert_sound(fixture.source, fixture.name);
    }
}

#[test]
fn every_truncation_of_every_fixture_lowers_soundly() {
    // The EOF-adversarial lane: each fixture cut at every char boundary,
    // from both ends — the recovery paths TS-19 hammers, continued into
    // S2. Deterministic, committed, and panic-free by the totality
    // contract.
    for fixture in battery::WELL_FORMED.iter().chain(battery::MALFORMED) {
        let source = fixture.source;
        for (end, _) in source.char_indices() {
            assert_sound(&source[..end], fixture.name);
        }
        for (start, _) in source.char_indices() {
            assert_sound(&source[start..], fixture.name);
        }
    }
}

#[test]
fn the_battery_aggregates_are_pinned() {
    // The decision-surface census over the whole battery: ops minted,
    // diagnostics raised, provenance records written, scopes tagged.
    // Exact numbers, so any lowering change (or a cfg regression that
    // disarms a lane) moves them loudly.
    let mut ops = 0u64;
    let mut diagnostics = 0usize;
    let mut provenance = 0usize;
    let mut scopes = 0usize;
    for fixture in battery::WELL_FORMED.iter().chain(battery::MALFORMED) {
        with_lowered(fixture.source, |lowered, _folio| {
            ops += u64::from(lowered.op_count);
            diagnostics += lowered.diagnostics.len();
            provenance += lowered.provenance.len();
            scopes += lowered.scopes.len();
        });
    }
    // Re-pinned at the transform_text installment (P2-9 series 4): the
    // lowering now condenses whitespace and merges text/interpolation
    // runs (`lower::text`), so whitespace-only text ops leave the
    // artifact (89 -> 78 ops) and their `lower.text` records become
    // `condense.*` ones (107 -> 101 records — merged runs collapse N
    // leaf records into one). Diagnostics are unchanged on purpose:
    // condensing and merging emit none in either lane.
    assert_eq!(
        (ops, diagnostics, provenance, scopes),
        (78, 33, 101, 1),
        "battery census moved: re-pin deliberately"
    );
}
