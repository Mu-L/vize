//! Production metadata observes unsaved external declarations and their close.
#![expect(
    clippy::disallowed_methods,
    reason = "editor fixtures use owned lsp source text"
)]

use super::cached_component_metadata;
use crate::{ide::IdeContext, server::ServerState};
use std::sync::Arc;
use tower_lsp::lsp_types::{TextDocumentContentChangeEvent, Url};

#[test]
fn external_type_overlay_refreshes_props_and_close_restores_disk() {
    let dir = tempfile::tempdir().unwrap();
    let types = dir.path().join("types.ts");
    let component = dir.path().join("Widget.vue");
    std::fs::write(&types, "export interface Public { label: string }").unwrap();
    std::fs::write(&component, "<script setup lang='ts'>import type { Public } from './types'; defineProps<Public>()</script><template><slot name='footer'/></template>").unwrap();
    let state = ServerState::new();
    let host = Url::from_file_path(dir.path().join("Host.vue")).unwrap();
    state.documents.open(
        host.clone(),
        "<template/>".to_string(),
        1,
        "vue".to_string(),
    );
    let ctx = IdeContext::new(&state, &host, 0).unwrap();
    let first = cached_component_metadata(&ctx, &component).unwrap();
    assert_eq!(
        first.props.first().unwrap().type_detail.as_deref(),
        Some("string")
    );
    let (_, first_sources) = state.component_type_sources().unwrap();
    let (_, repeated_sources) = state.component_type_sources().unwrap();
    assert!(Arc::ptr_eq(&first_sources, &repeated_sources));

    let uri = Url::from_file_path(&types).unwrap();
    state.documents.open(
        uri.clone(),
        "export interface Public { label: number; pending?: boolean }".to_string(),
        1,
        "typescript".to_string(),
    );
    let opened = cached_component_metadata(&ctx, &component).unwrap();
    assert!(!Arc::ptr_eq(&first, &opened));
    assert_eq!(
        opened.props.first().unwrap().type_detail.as_deref(),
        Some("number")
    );
    assert!(
        opened
            .props
            .iter()
            .any(|prop| prop.name == "pending" && !prop.required)
    );
    assert_eq!(opened.slots, first.slots);

    assert!(state.documents.apply_changes(
        &uri,
        vec![TextDocumentContentChangeEvent {
            range: None,
            range_length: None,
            text: "export interface Public { title: 'a b' }".to_string(),
        }],
        2
    ));
    let edited = cached_component_metadata(&ctx, &component).unwrap();
    assert_eq!(edited.props.len(), 1);
    assert_eq!(edited.props.first().unwrap().name, "title");
    assert_eq!(
        edited.props.first().unwrap().type_detail.as_deref(),
        Some("'a b'")
    );
    assert_eq!(edited.slots, first.slots);
    let (_, changed_sources) = state.component_type_sources().unwrap();
    assert!(!Arc::ptr_eq(&first_sources, &changed_sources));

    let renamed_uri = Url::from_file_path(dir.path().join("renamed.ts")).unwrap();
    assert!(state.rename_document(&uri, renamed_uri.clone()));
    assert_eq!(
        *cached_component_metadata(&ctx, &component).unwrap(),
        *first
    );
    assert!(state.rename_document(&renamed_uri, uri.clone()));
    assert_eq!(
        *cached_component_metadata(&ctx, &component).unwrap(),
        *edited
    );

    state.close_document(&uri);
    let closed = cached_component_metadata(&ctx, &component).unwrap();
    assert_eq!(*closed, *first);
    assert!(Arc::ptr_eq(
        &closed,
        &cached_component_metadata(&ctx, &component).unwrap()
    ));
}
