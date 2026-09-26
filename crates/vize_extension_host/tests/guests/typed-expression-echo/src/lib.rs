//! Typed-world transport probe depending only on the SDK.
#![no_std]
extern crate alloc;
use alloc::string::String;
use alloc::vec::Vec;
use vize_extension_sdk::typed_bindings::exports::vize::contracts::typed_expression_analysis;
use vize_extension_sdk::handshake;
use typed_expression_analysis::TypedAnalysis as Analysis;
use vize_extension_sdk::types::Page;

struct Echo;

impl handshake::Guest for Echo {
    fn get_capability() -> handshake::Capability {
        handshake::Capability {
            protocol_version: 1,
            features: vize_extension_sdk::TYPED_EXPRESSION_REQUIRED_FEATURES.iter().copied().map(String::from).collect(),
        }
    }
}

impl typed_expression_analysis::Guest for Echo {
    fn analyze_typed(batch: typed_expression_analysis::TypedExpressionBatch) -> Analysis {
        let signatures: Vec<&str> = batch.environment.iter().map(|b| b.signature.as_str()).collect();
        let sources: Vec<&str> = batch.expressions.iter().map(|e| e.source.as_str()).collect();
        if signatures != ["Int", "String", "String"]
            || sources != ["msg + suffix", "count * 2"]
            || batch.expressions.iter().any(|expression| !expression.locals.is_empty()) {
            core::arch::wasm32::unreachable();
        }
        Analysis {
            facts: Page { schema_version: 1, text: String::from(include_str!("../../../fixtures/expression/probe.facts.folio")) },
            projection: Page { schema_version: 1, text: String::from(include_str!("../../../fixtures/expression/probe.projection.folio")) },
            diagnostics: Vec::new(),
        }
    }
}

vize_extension_sdk::export_typed_expression_dialect!(Echo);
