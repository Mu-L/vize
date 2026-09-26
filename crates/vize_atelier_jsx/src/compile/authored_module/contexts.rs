//! A Vue setup method cannot inherit an authored arrow's enclosing receiver.

use oxc_ast::ast::{Function, IdentifierReference, MetaProperty, Program, ThisExpression};
use oxc_ast_visit::Visit;

use super::{JsxComponent, JsxDiagnostic, error};

pub(super) fn check(
    program: &Program<'_>,
    components: &[JsxComponent],
) -> Result<(), JsxDiagnostic> {
    if !components.iter().any(|c| c.component_setup().is_some()) {
        return Ok(());
    }
    let mut visitor = Contexts {
        components,
        missing: None,
    };
    visitor.visit_program(program);
    if let Some((start, end)) = visitor.missing {
        return Err(error(
            start,
            end,
            "Block-body JSX component setup cannot preserve lexical this, arguments or new.target; use a function declaration or expression-bodied component",
        ));
    }
    Ok(())
}

struct Contexts<'a> {
    components: &'a [JsxComponent],
    missing: Option<(u32, u32)>,
}

impl Contexts<'_> {
    fn record(&mut self, start: u32, end: u32) {
        if self
            .components
            .iter()
            .filter_map(JsxComponent::component_setup)
            .any(|setup| setup.declaration_start <= start && end <= setup.declaration_end)
        {
            self.missing = Some((start, end));
        }
    }
}

impl<'a> Visit<'a> for Contexts<'_> {
    fn visit_function(&mut self, function: &Function<'a>, flags: oxc_syntax::scope::ScopeFlags) {
        // Normal functions keep their own receiver, arguments and new.target.
        // Walk enclosing functions to reach nested component arrows, but skip
        // functions whose complete body is retained within a setup wrapper.
        if self
            .components
            .iter()
            .filter_map(JsxComponent::component_setup)
            .any(|setup| {
                setup.declaration_start <= function.span.start
                    && function.span.end <= setup.declaration_end
            })
        {
            return;
        }
        oxc_ast_visit::walk::walk_function(self, function, flags);
    }

    fn visit_this_expression(&mut self, expression: &ThisExpression) {
        self.record(expression.span.start, expression.span.end);
    }

    fn visit_identifier_reference(&mut self, identifier: &IdentifierReference<'a>) {
        if identifier.name == "arguments" {
            self.record(identifier.span.start, identifier.span.end);
        }
    }

    fn visit_meta_property(&mut self, property: &MetaProperty<'a>) {
        if property.meta.name == "new" {
            self.record(property.span.start, property.span.end);
        }
    }
}
