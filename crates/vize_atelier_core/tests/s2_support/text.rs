//! The text projection (P2-9 series 4): the merged text-unit surface
//! DOM codegen compiles — one unit per `createTextVNode` boundary, each
//! a sequence of static/dynamic parts.
//!
//! # The unit rule, lane-neutral
//!
//! The legacy lane condenses whitespace at parse and groups consecutive
//! text/interpolation children at codegen
//! (`crates/vize_atelier_core/src/codegen/children.rs`); S2 does both
//! at lowering (`crates/vize_ricalco/src/lower/text.rs`), so its
//! remaining text-family ops *are* the units. The projections read each
//! lane's own tree — legacy runs re-grouped exactly as codegen groups
//! them ([`super::text_old`]), S2 ops one-to-one — and compare the
//! parts exactly: kind, then text (the legacy condensed content against
//! the S2 condensed content; the trimmed expression on both sides).
//!
//! # Counted classes, never silence
//!
//! - `vpre_templates` — the legacy parser reads `v-pre` (interpolations
//!   inside become plain text) while S2 lowers the subtree as ordinary
//!   content (`defer.v-pre`, the recorded P2-8 deferral), so the two
//!   trees genuinely disagree inside it; a template carrying `v-pre`
//!   skips the text projection as one counted class, owned by the
//!   installment that gives `v-pre` an S2 story.
//! - `entity_templates` — the legacy parser decodes entities in text
//!   and interpolation content; S1 v1 deliberately does not (the
//!   recorded deviation). A template whose S2 parts carry
//!   entity-shaped text skips as a counted class instead of averaging.
//! - `rawtext_excluded` — rawtext content (`script`/`style`/… — the
//!   `lower::text` exemption list) is another language's text; both
//!   projections exclude those subtrees, and the S2 side counts the
//!   ops it skipped so the blind spot has a number.
//! - `parts_compound` — a legacy interpolation whose content is a
//!   compound rebuild has no single source text; counted, not
//!   compared (never seen under default options).

use vize_carton::String;

/// The comparator's text accounting, part of [`super::Counters`].
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct TextCounters {
    /// Units compared (both lanes agreed on count and shape).
    pub units: u64,
    /// Static parts whose text compared equal.
    pub parts_static: u64,
    /// Dynamic parts whose expression text compared equal.
    pub parts_dynamic: u64,
    /// S2 units backed by a merged `opaque(compound)` op.
    pub compound_units: u64,
    /// Templates skipped: the legacy parse handles `v-pre`, S2 defers it.
    pub vpre_templates: u64,
    /// Templates skipped: entity-shaped text under the S1 no-decoding
    /// scope.
    pub entity_templates: u64,
    /// S2 text-family ops inside rawtext content, excluded on both
    /// sides.
    pub rawtext_excluded: u64,
    /// Legacy compound interpolation content: counted, not compared.
    pub parts_compound: u64,
}

/// One part of a unit. `text: None` is the legacy compound-rebuild
/// escape (no single source text).
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct TPart {
    pub dynamic: bool,
    pub text: Option<String>,
}

/// One text unit — one `createTextVNode` boundary.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct TUnit {
    pub parts: Vec<TPart>,
    /// S2 side: the unit is a merged compound op.
    pub compound: bool,
}

/// Entity-shaped text under the S1 no-decoding scope: `&` followed by
/// an alphanumeric or `#` (`&amp;` `&#65;` — never `a && b`).
fn entity_bearing(text: &str) -> bool {
    let bytes = text.as_bytes();
    bytes.iter().enumerate().any(|(index, byte)| {
        *byte == b'&'
            && bytes
                .get(index + 1)
                .is_some_and(|next| next.is_ascii_alphanumeric() || *next == b'#')
    })
}

/// Compare the two lanes' unit lists for one template.
///
/// # Panics
///
/// Panics on any divergence inside the compared domain (TS-25).
pub fn check(name: &str, source: &str, old: &[TUnit], s2: &[TUnit], counters: &mut TextCounters) {
    // The entity class is a template-level predicate on the S2 parts
    // (where the authored `&` survives), decided before any comparison.
    let has_entities = s2.iter().any(|unit| {
        unit.parts
            .iter()
            .any(|part| part.text.as_deref().is_some_and(entity_bearing))
    });
    if has_entities {
        counters.entity_templates += 1;
        return;
    }

    macro_rules! diverged {
        ($($why:tt)+) => {
            panic!(
                "TS-25 text divergence [{}]: {}\ntemplate:\n{}\nlegacy units: {:#?}\ns2 units: {:#?}",
                name, format_args!($($why)+), source, old, s2
            )
        };
    }

    if old.len() != s2.len() {
        diverged!("unit count {} vs {}", old.len(), s2.len());
    }
    for (index, (old_unit, s2_unit)) in old.iter().zip(s2).enumerate() {
        if old_unit.parts.len() != s2_unit.parts.len() {
            diverged!(
                "unit {index} part count {} vs {}",
                old_unit.parts.len(),
                s2_unit.parts.len()
            );
        }
        for (old_part, s2_part) in old_unit.parts.iter().zip(&s2_unit.parts) {
            if old_part.dynamic != s2_part.dynamic {
                diverged!("unit {index} part kind {old_part:?} vs {s2_part:?}");
            }
            match (&old_part.text, &s2_part.text) {
                (None, Some(_)) => counters.parts_compound += 1,
                (Some(old_text), Some(s2_text)) if old_text == s2_text => {
                    if old_part.dynamic {
                        counters.parts_dynamic += 1;
                    } else {
                        counters.parts_static += 1;
                    }
                }
                _ => diverged!("unit {index} part text {old_part:?} vs {s2_part:?}"),
            }
        }
        if s2_unit.compound {
            counters.compound_units += 1;
        }
        counters.units += 1;
    }
}
