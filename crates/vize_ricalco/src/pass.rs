//! The S2 transform passes over lowered Vue output — the P2-9 series
//! substrate.
//!
//! # Why the passes live here (the dependency-direction decision)
//!
//! P2-9 re-expresses `vize_atelier_core`'s transform lane as classified
//! S2 passes, but the passes cannot live *in* `vize_atelier_core`: that
//! crate is published to crates.io and the release gate
//! (`tests/tooling/moonbit-publish-crates.test.ts`) rejects any
//! published crate whose release graph names an unpublished one — the
//! constraint `davinci-road/plan/phase-2.md` records under "Davinci
//! describes the shipped pipeline". The backends read Davinci from
//! **dev-dependencies** (stripped on publish), which is where the P2-9
//! differential comparator sits (`crates/vize_atelier_core/tests/
//! davinci_s2_transform*.rs`); the pass bodies themselves need a crate
//! that may depend on `vize_davinci` + `vize_disegno` outright.
//!
//! That crate is this one. `vize_ricalco` is `publish = false`, already
//! depends downward on both stages, and the passes are the continuation
//! of the dialect lowering — the MLIR conversion-library shape extended
//! one step: `lower` converts, the passes legalize. What lowering leaves
//! syntactic (a branch `key` attribute, a deferred binding) a pass here
//! turns semantic, dialect knowledge included, without the neutral pivot
//! (`vize_disegno`) learning any Vue and without the published legacy
//! lane gaining an edge on the strangler's new lane.
//!
//! # The in-phase lane flag (charter #26)
//!
//! [`TRANSFORM_LANE_FLAG`] names the env flag the P2-9 series runs
//! behind: `VIZE_DAVINCI_TRANSFORM=legacy` disarms the S2 dual-run in
//! the differential comparator, leaving the shipped legacy lane alone as
//! today. The flag is *read* in `vize_atelier_core`'s test-space
//! comparator (this crate is `no_std` and reads no environment); it is
//! *named* here so the phase-2 exit gate's deletion grep has one home.
//! The old lane is the only shipped lane while the phase is live; the
//! differential lane, not the flag, carries the risk (phase-2.md § 11).
//!
//! # Driving a run
//!
//! [`run_transform`] executes [`TRANSFORM`] through the P2-2 pass
//! manager (`vize_davinci::pass::run_pipeline`) with a caller-supplied
//! observer, and wires the P2-6 [`VerifyObserver`] between passes in
//! debug builds exactly as its module documents: `note` then `check` /
//! `check_table` after every pass, so a broken invariant names the pass
//! that broke it. Release builds make zero verifier calls (guardrail 5).

use vize_davinci::pass::{PassDesc, PassFailure, PassObserver, Pipeline, run_pipeline};
use vize_davinci::side_table::SideTable;

use crate::lower::Lowered;

#[path = "pass/vif.rs"]
pub mod vif;

pub use vif::{BranchKey, IfFacts};

/// The stage name S2 transform pipelines print and parse under.
pub const S2_STAGE: &str = "s2";

/// The env flag the P2-9 series runs behind (charter #26): value
/// `legacy` disarms the S2 dual-run lane. Read by the differential
/// comparator in `vize_atelier_core`'s test space; deleted, with the
/// lane it guards, at the phase-2 exit gate.
pub const TRANSFORM_LANE_FLAG: &str = "VIZE_DAVINCI_TRANSFORM";

/// The S2 transform pipeline as the series has built it so far.
///
/// One pass today ([`vif::DESC`]); later installments append here, and
/// the `const` pins below are the grouping regression guard (the P2-2
/// convention: a fusion-plan change is a compile error, not a surprise).
pub const TRANSFORM_PASSES: &[PassDesc] = &[vif::DESC];

/// The planned pipeline over [`TRANSFORM_PASSES`].
pub const TRANSFORM: Pipeline = Pipeline::new(S2_STAGE, TRANSFORM_PASSES);

// The plan's fusion shape, pinned: one mandatory barrier, one walk.
const _: () = assert!(TRANSFORM.group_count() == 1);
const _: () = assert!(TRANSFORM.is_fully_serialized());

/// The facts the S2 transform pipeline produces beside the tree.
///
/// One field per fact family, so a later installment's facts land as new
/// fields rather than a second bag type.
#[derive(Debug, Default)]
pub struct S2Facts {
    /// Per-`ui.if` branch-key facts, keyed by the op's page-order id
    /// ([`vif`]).
    pub if_facts: SideTable<IfFacts>,
}

/// Run the S2 transform pipeline over `lowered`, firing `observer`'s
/// hooks around each pass.
///
/// Pass diagnostics and provenance append to `lowered`'s own channels —
/// the unified-channel design; there is no second diagnostics stream.
/// In debug builds the S2 verifier runs between passes ([`VerifyObserver`]
/// wiring per its docs); a violated invariant panics naming the pass.
///
/// # Panics
///
/// Panics only on a compiler bug: a pipeline pass with no registered
/// body, or (debug builds) a verifier violation.
///
/// [`VerifyObserver`]: vize_disegno::verify::VerifyObserver
pub fn run_transform<'a, O: PassObserver>(lowered: &mut Lowered<'a>, observer: &mut O) -> S2Facts {
    let mut facts = S2Facts::default();
    #[cfg(debug_assertions)]
    let mut verify = vize_disegno::verify::VerifyObserver::new();

    let outcome = run_pipeline(&TRANSFORM, observer, |event| {
        let name = event.desc().name;
        if name == vif::DESC.name {
            facts.if_facts = vif::run(lowered);
        } else {
            return Err(PassFailure::new("pipeline pass has no registered body"));
        }

        // P2-6: verifier between passes, debug builds only. `note` first
        // (rigor escalates after a mandatory-lowering pass), then the
        // tree checks and one `check_table` per side table that exists.
        #[cfg(debug_assertions)]
        {
            verify.note(event);
            let folio = vize_disegno::folio::DisegnoFolio::of(&lowered.root.ops);
            verify.check(event, &folio);
            verify.check_table(event, &folio, &lowered.scopes);
            verify.check_table(event, &folio, &facts.if_facts);
        }
        Ok(())
    });
    // The catalogue above is closed over the const pipeline, so a failure
    // here is a compiler bug, not an input property.
    if let Err(failure) = outcome {
        panic!("s2 transform pipeline stopped: {}", failure.reason);
    }
    facts
}

#[cfg(test)]
mod tests {
    use super::{S2_STAGE, TRANSFORM, TRANSFORM_LANE_FLAG, TRANSFORM_PASSES, vif};
    use vize_davinci::pass::{Fusability, PassKind};

    #[test]
    fn the_pipeline_holds_exactly_the_landed_passes() {
        assert_eq!(TRANSFORM.stage, S2_STAGE);
        assert_eq!(TRANSFORM_PASSES.len(), 1);
        assert_eq!(TRANSFORM_PASSES[0], vif::DESC);
    }

    #[test]
    fn the_vif_classification_is_pinned() {
        // The review-point classification, pinned so a drive-by re-kind
        // is a loud diff: see `vif::DESC`'s docs for the reasoning.
        assert_eq!(vif::DESC.name, "v-if");
        assert_eq!(vif::DESC.kind, PassKind::MandatoryLowering);
        assert_eq!(vif::DESC.fusability, Fusability::Barrier);
    }

    #[test]
    fn the_lane_flag_has_its_recorded_name() {
        assert_eq!(TRANSFORM_LANE_FLAG, "VIZE_DAVINCI_TRANSFORM");
    }
}
