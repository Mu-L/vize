//! P2-9, the plain-suite coverage witness: the committed battery (the
//! v-if half from series 1, the v-for half from series 2) dual-runs
//! legacy-vs-S2 with **exact-pinned** counters, so a cfg or flag
//! regression that disarms the differential lane fails loudly here (the
//! P1-6/P1-7 witness law). The corpus-widened entry is
//! `davinci_s2_transform_corpus.rs` (feature `davinci-differential`).

mod s2_support;

use s2_support::{BATTERY, Counters, compare};

/// The battery's exact accounting. The corpus entry pins the same
/// numbers; both move together, deliberately, when the battery does.
fn expected() -> Counters {
    Counters {
        templates_seen: 30,
        compared: 30,
        skipped_legacy_flag: 0,
        skipped_old_parse_errors: 0,
        skipped_s2_errors: 0,
        if_ops: 20,
        branches: 38,
        keys_static: 13,
        keys_dynamic: 2,
        keys_template_if: 1,
        keys_slot_root: 1,
        conditions_compound: 0,
        for_ops: 15,
        for_values: 14,
        for_keys: 4,
        for_indexes: 1,
        for_values_absent: 1,
        for_compound: 0,
    }
}

#[test]
fn the_battery_dual_runs_with_pinned_counts() {
    let mut counters = Counters::default();
    for (name, source) in BATTERY {
        compare(name, source, &mut counters);
    }
    assert_eq!(
        counters,
        expected(),
        "the v-if differential lane's battery accounting moved: re-pin in \
         BOTH this witness and the corpus entry deliberately"
    );
}

#[test]
fn the_same_key_wording_never_drifts_from_relief() {
    // The S2 pass duplicates relief's message text rather than the
    // dependency (ricalco must not depend on the legacy AST crate);
    // this pin is what keeps the two channels from drifting.
    assert_eq!(
        vize_ricalco::pass::vif::SAME_KEY_MESSAGE,
        vize_atelier_core::ErrorCode::VIfSameKey.message()
    );
}

#[test]
fn both_lanes_flag_the_duplicate_key() {
    // End-to-end wording check on the battery's collision template: the
    // legacy transform reports `VIfSameKey`, the S2 pass appends the
    // same text to the unified channel.
    let (_, source) = BATTERY
        .iter()
        .find(|(name, _)| *name == "duplicate-keys")
        .expect("the battery carries the collision template");

    let allocator = vize_carton::Allocator::new();
    let (mut root, parse_errors) = vize_atelier_core::parser::parse(&allocator, source);
    assert!(parse_errors.is_empty(), "{parse_errors:?}");
    let transform_errors = vize_atelier_core::transform(
        &allocator,
        &mut root,
        vize_atelier_core::TransformOptions::default(),
        None,
    );
    assert!(
        transform_errors
            .iter()
            .any(|error| error.code == vize_atelier_core::ErrorCode::VIfSameKey),
        "the legacy lane must flag the collision: {transform_errors:?}"
    );

    let s2_allocator = vize_carton::Allocator::new();
    let (tree, surface_errors) = vize_sinopia::parse(&s2_allocator, source);
    let mut lowered = vize_ricalco::lower(&s2_allocator, &tree, &surface_errors);
    let _facts =
        vize_ricalco::pass::run_transform(&mut lowered, &mut vize_davinci::pass::NoObserver);
    assert!(
        lowered
            .diagnostics
            .iter()
            .any(|diagnostic| diagnostic.message.as_str()
                == vize_ricalco::pass::vif::SAME_KEY_MESSAGE),
        "the S2 pass must flag the collision: {:?}",
        lowered.diagnostics
    );
}

#[test]
fn the_legacy_flag_disarms_the_lane_visibly() {
    // Not an env-mutating test (the harness runs tests concurrently):
    // the flag's read is pinned by name here, and its disarm arm is the
    // `skipped_legacy_flag` counter the battery pin holds at zero.
    assert_eq!(
        vize_ricalco::pass::TRANSFORM_LANE_FLAG,
        "VIZE_DAVINCI_TRANSFORM"
    );
}
