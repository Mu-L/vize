//! Diagnose proven authored-module loss in the standalone Vapor/SSR emitter.

use oxc_ast::ast::{IdentifierReference, Statement};
use oxc_ast_visit::Visit;
use oxc_semantic::{Scoping, SemanticBuilder};
use oxc_span::GetSpan;

use super::{JsxComponent, JsxDiagnostic, error};
use crate::JsxLang;

pub(super) fn check(
    components: &[JsxComponent],
    spans: &[(u32, u32)],
    source: &str,
    lang: JsxLang,
) -> Result<(), JsxDiagnostic> {
    let message = "Vapor/SSR authored module preservation is not supported for imports, exports or captured setup bindings; use VDOM output or consume the per-component renderer";
    let allocator = oxc_allocator::Allocator::default();
    let parsed = crate::parse_module(&allocator, source, lang);
    for statement in &parsed.program.body {
        if matches!(
            statement,
            Statement::ImportDeclaration(_)
                | Statement::ExportNamedDeclaration(_)
                | Statement::ExportDefaultDeclaration(_)
                | Statement::ExportAllDeclaration(_)
        ) {
            let span = statement.span();
            return Err(error(span.start, span.end, message));
        }
    }
    let scoping = SemanticBuilder::new()
        .build(&parsed.program)
        .semantic
        .into_scoping();
    let mut bindings = Captures {
        scoping: &scoping,
        components,
        spans,
        missing: None,
    };
    bindings.visit_program(&parsed.program);
    if let Some((start, end)) = bindings.missing {
        return Err(error(start, end, message));
    }
    Ok(())
}

struct Captures<'a> {
    scoping: &'a Scoping,
    components: &'a [JsxComponent],
    spans: &'a [(u32, u32)],
    missing: Option<(u32, u32)>,
}

impl<'a> Visit<'a> for Captures<'_> {
    fn visit_statement(&mut self, statement: &Statement<'a>) {
        let span = statement.span();
        if self
            .components
            .iter()
            .filter_map(JsxComponent::component_setup)
            .any(|setup| setup.setup_start <= span.start && span.end <= setup.setup_end)
        {
            self.missing = Some((span.start, span.end));
        }
        oxc_ast_visit::walk::walk_statement(self, statement);
    }

    fn visit_identifier_reference(&mut self, identifier: &IdentifierReference<'a>) {
        let Some(&(root_start, root_end)) = self
            .spans
            .iter()
            .find(|&&(start, end)| start <= identifier.span.start && identifier.span.end <= end)
        else {
            return;
        };
        let Some(reference) = identifier.reference_id.get() else {
            return;
        };
        let Some(symbol) = self.scoping.get_reference(reference).symbol_id() else {
            return;
        };
        let binding = self.scoping.symbol_span(symbol);
        if !(root_start <= binding.start && binding.end <= root_end) {
            self.missing = Some((identifier.span.start, identifier.span.end));
        }
    }
}
