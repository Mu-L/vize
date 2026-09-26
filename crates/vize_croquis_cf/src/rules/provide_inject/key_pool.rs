//! One tree-build-local pool. Keys never leave the private tree traversal.

use std::num::NonZeroUsize;

use lasso::{Capacity, MemoryLimits, Rodeo, Spur};
use rustc_hash::FxBuildHasher;
use vize_croquis::provide::ProvideKey;

type Pool = Rodeo<Spur, FxBuildHasher>;

/// Namespace is separate from the authored text: string and symbol keys with
/// identical spelling must remain distinct, including Unicode and prefixes.
pub(super) fn key_parts(key: &ProvideKey) -> (bool, &str) {
    match key {
        ProvideKey::String(text) => (false, text),
        ProvideKey::Symbol(text) => (true, text),
    }
}

/// Preserve lexical context order by assigning symbols in lexical text order.
/// The total source-key bytes bound the arena; failures use borrowed keys for
/// the entire traversal, so partially interned and borrowed identities never
/// mix. The pool and its owned arena are dropped at the end of this build.
pub(super) fn build_pool<'a>(keys: impl Iterator<Item = &'a ProvideKey>) -> Option<Pool> {
    let mut texts = keys.map(|key| key_parts(key).1).collect::<Vec<_>>();
    texts.sort_unstable();
    texts.dedup();
    let bytes = texts
        .iter()
        .fold(0usize, |total, text| total.saturating_add(text.len()));
    let capacity = Capacity::new(texts.len(), NonZeroUsize::new(bytes.max(1))?);
    let mut pool = Pool::with_capacity_memory_limits_and_hasher(
        capacity,
        MemoryLimits::for_memory_usage(bytes.max(1)),
        FxBuildHasher,
    );
    for text in texts {
        pool.try_get_or_intern(text).ok()?;
    }
    Some(pool)
}

#[cfg(test)]
mod tests;
