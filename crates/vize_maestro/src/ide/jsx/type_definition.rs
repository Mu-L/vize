use std::sync::Arc;

use tower_lsp::lsp_types::GotoDefinitionResponse;
use vize_canon::CorsaBridge;

use super::service_project::prepare_navigation_request;
use crate::ide::corsa_support::map_canonical_corsa_locations;
use crate::ide::{IdeContext, TypeDefinitionService};

/// Type-definition support for opt-in JSX/TSX virtual TypeScript.
pub struct JsxTypeDefinitionService;

impl JsxTypeDefinitionService {
    /// Go-to-type-definition on a `.jsx`/`.tsx` component, resolved through
    /// virtual TS and mapped back to authored source.
    pub async fn type_definition(
        ctx: &IdeContext<'_>,
        corsa_bridge: Option<Arc<CorsaBridge>>,
    ) -> Option<GotoDefinitionResponse> {
        let bridge = corsa_bridge?;
        let (document, line, character) = prepare_navigation_request(ctx, &bridge).await?;

        let locations = bridge
            .type_definition(&document.request_uri, line, character)
            .await
            .ok()?;
        if locations.is_empty() {
            return None;
        }

        let mapped = map_canonical_corsa_locations(ctx, &document, locations);

        TypeDefinitionService::convert_locations(mapped)
    }
}
