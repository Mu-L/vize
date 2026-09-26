//! Map other live native roots using the query-captured Canon source catalog.

use tower_lsp::lsp_types::{Location, Url};
use vize_canon::LspLocation;

use super::{CanonicalVirtualDocument, map_virtual_result_lsp_range_to_source};
use crate::ide::{IdeContext, diagnostics::VirtualTsResult};

pub(super) fn map_location(
    ctx: &IdeContext<'_>,
    document: &CanonicalVirtualDocument,
    location: &LspLocation,
) -> Option<Location> {
    let path = Url::parse(&location.uri).ok()?.to_file_path().ok()?;
    let source = document
        .source_catalogs
        .iter()
        .find_map(|catalog| catalog.get(&path))?;
    if !source.mapping_kind.is_mappable() {
        return None;
    }
    let result = VirtualTsResult::from_projection(
        source.code.to_string(),
        source.mapping.clone(),
        source.import_source_map.clone(),
    );
    Some(Location {
        uri: super::open::authored_uri(ctx, &source.source_path)?,
        range: map_virtual_result_lsp_range_to_source(&source.source, &result, &location.range)?,
    })
}

#[cfg(test)]
mod tests;
