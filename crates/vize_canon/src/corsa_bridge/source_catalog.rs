//! Query-captured authored mappings for every live native project root.
#![expect(
    clippy::disallowed_types,
    reason = "immutable mapping leaves are shared across queries"
)]

use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};

use vize_carton::FxHashMap;

use super::CorsaMaterializedSource;
use super::vue_dependencies_alias::recover_lock;

type SourceFacts = FxHashMap<PathBuf, Arc<CorsaMaterializedSource>>;

/// Source facts retained by one exact editor project revision.
///
/// Hosts added to the same revision share this catalog. Each leaf is immutable;
/// an overlay, disk or membership change replaces the catalog, so an in-flight
/// query keeps the source bytes and coordinate maps it opened with.
#[derive(Clone, Default)]
pub struct CorsaSourceCatalog {
    sources: Arc<Mutex<SourceFacts>>,
}

impl CorsaSourceCatalog {
    /// Whether two query handles retain the same editor project revision.
    pub fn shares_revision_with(&self, other: &Self) -> bool {
        Arc::ptr_eq(&self.sources, &other.sources)
    }

    /// Look up an exact Canon materialized identity without copying the project.
    pub fn get(&self, path: &Path) -> Option<Arc<CorsaMaterializedSource>> {
        let sources = recover_lock(&self.sources);
        sources.get(path).cloned().or_else(|| {
            sources
                .get(&vize_carton::path::canonicalize_non_verbatim(path))
                .cloned()
        })
    }

    pub(in crate::corsa_bridge) fn include(&self, sources: Vec<CorsaMaterializedSource>) {
        let mut retained = recover_lock(&self.sources);
        for source in sources {
            retained
                .entry(source.materialized_path.clone())
                .or_insert_with(|| Arc::new(source));
        }
    }
}
