//! Refuse initializer facts after a mutation or an executed call may escape them.

use oxc_ast::ast::{
    ArrowFunctionExpression, AssignmentExpression, CallExpression, Function, IdentifierReference,
    NewExpression, Statement, TaggedTemplateExpression, UpdateExpression,
};
use oxc_ast_visit::{Visit, walk};
use oxc_syntax::scope::ScopeFlags;

use crate::macros::{MacroKind, MacroTracker};
use crate::script_parser::ScriptParseResult;

pub(in crate::script_parser) fn invalidate_default_objects(
    result: &mut ScriptParseResult,
    statement: &Statement<'_>,
) {
    invalidate(result, |effects| effects.visit_statement(statement));
}

pub(in crate::script_parser) fn invalidate_default_expression(
    result: &mut ScriptParseResult,
    expression: Option<&oxc_ast::ast::Expression<'_>>,
) {
    if let Some(expression) = expression {
        invalidate(result, |effects| effects.visit_expression(expression));
    }
}

struct References<'a> {
    macros: &'a MacroTracker,
    found: bool,
}
impl<'a> Visit<'a> for References<'_> {
    fn visit_identifier_reference(&mut self, identifier: &IdentifierReference<'a>) {
        self.found |= self
            .macros
            .default_object(identifier.name.as_str())
            .is_some();
    }
}
struct Effects<'a> {
    macros: &'a MacroTracker,
    unknown: bool,
}
impl<'a> Visit<'a> for Effects<'_> {
    fn visit_function(&mut self, _: &Function<'a>, _: ScopeFlags) {}
    fn visit_arrow_function_expression(&mut self, _: &ArrowFunctionExpression<'a>) {}
    fn visit_call_expression(&mut self, call: &CallExpression<'a>) {
        if !matches!(&call.callee, oxc_ast::ast::Expression::Identifier(id) if MacroKind::from_name(id.name.as_str()).is_some())
        {
            // Even a call without explicit object arguments may invoke a
            // closure that captured a cached object. Refuse that inference.
            self.unknown = true;
        }
        walk::walk_call_expression(self, call);
    }
    fn visit_new_expression(&mut self, _: &NewExpression<'a>) {
        self.unknown = true;
    }
    fn visit_tagged_template_expression(&mut self, _: &TaggedTemplateExpression<'a>) {
        self.unknown = true;
    }
    fn visit_assignment_expression(&mut self, assignment: &AssignmentExpression<'a>) {
        let mut refs = References {
            macros: self.macros,
            found: false,
        };
        refs.visit_assignment_expression(assignment);
        self.unknown |= refs.found;
        walk::walk_assignment_expression(self, assignment);
    }
    fn visit_update_expression(&mut self, update: &UpdateExpression<'a>) {
        let mut refs = References {
            macros: self.macros,
            found: false,
        };
        refs.visit_update_expression(update);
        self.unknown |= refs.found;
    }
}

fn invalidate(result: &mut ScriptParseResult, visit: impl FnOnce(&mut Effects<'_>)) {
    let mut effects = Effects {
        macros: &result.macros,
        unknown: false,
    };
    visit(&mut effects);
    if effects.unknown {
        result.macros.invalidate_default_objects();
    }
}
