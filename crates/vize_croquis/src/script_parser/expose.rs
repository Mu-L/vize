//! Resolve the public instance after all setup declarations are known.

mod types;

use oxc_ast::ast::{Expression, ObjectPropertyKind, Program, PropertyKey, Statement};
use oxc_semantic::{Scoping, SemanticBuilder};
use vize_carton::{CompactString, FxHashSet};

use super::ScriptParseResult;
use crate::macros::{DEFINE_EXPOSE, ExposeBinding, ExposeDefinition, MacroKind};

pub(super) fn extract_exposes(result: &mut ScriptParseResult, program: &Program<'_>, source: &str) {
    if result.macros.define_expose().is_none() {
        return;
    }
    // Reuse the retained program; lexical resolution never reparses source text.
    let built = SemanticBuilder::new().build(program);
    let scoping = built.semantic.scoping();
    let authored_types = types::declaration_types(program, source);
    let mut calls = 0;
    let mut processed = FxHashSet::default();
    for statement in &program.body {
        let Statement::ExpressionStatement(statement) = statement else {
            continue;
        };
        let Expression::CallExpression(call) = statement.expression.get_inner_expression() else {
            continue;
        };
        let Expression::Identifier(callee) = &call.callee else {
            continue;
        };
        if callee.name != DEFINE_EXPOSE {
            continue;
        }
        processed.insert((call.span.start, call.span.end));
        // A local function named defineExpose is an ordinary call, even when
        // declared later. Only Vue's exact named macro import is also accepted.
        if callee
            .reference_id
            .get()
            .is_some_and(|id| scoping.get_reference(id).symbol_id().is_some())
            && !is_vue_macro_import(program)
        {
            continue;
        }
        calls += 1;
        if calls > 1 || call.arguments.len() > 1 {
            result.macros.mark_expose_incomplete();
        }
        let Some(argument) = call.arguments.first() else {
            if call.type_arguments.is_some() {
                // A type parameter has no runtime properties to expose.
                result.macros.mark_expose_incomplete();
            }
            continue;
        };
        let Some(Expression::ObjectExpression(object)) = argument
            .as_expression()
            .map(Expression::get_inner_expression)
        else {
            result.macros.mark_expose_incomplete();
            continue;
        };
        let mut seen = FxHashSet::default();
        let mut known = Vec::new();
        let mut unknown_override = false;
        // JavaScript's last property wins. An unknown spread/key can override
        // everything to its left, but not a known property written afterwards.
        for property in object.properties.iter().rev() {
            let ObjectPropertyKind::ObjectProperty(property) = property else {
                result.macros.mark_expose_incomplete();
                unknown_override = true;
                continue;
            };
            let Some(name) = property_name(&property.key, property.computed) else {
                result.macros.mark_expose_incomplete();
                unknown_override = true;
                continue;
            };
            if name == "__proto__"
                && property.kind == oxc_ast::ast::PropertyKind::Init
                && !property.computed
                && !property.shorthand
                && !property.method
            {
                continue;
            }
            if !seen.insert(name.clone()) || unknown_override {
                continue;
            }
            let (local_name, declaration_span) = resolved_binding(&property.value, scoping);
            let expose_type = if property.kind == oxc_ast::ast::PropertyKind::Init {
                types::expression_type(&property.value, source).or_else(|| {
                    declaration_span.and_then(|span| authored_types.get(&span).cloned())
                })
            } else {
                // Accessors expose a value, not the getter/setter's function.
                // A paired getter/setter needs type checking to establish its type.
                None
            };
            known.push((
                ExposeDefinition {
                    name: name.clone(),
                    expose_type,
                },
                ExposeBinding {
                    name,
                    local_name,
                    declaration_span,
                },
            ));
        }
        for (definition, binding) in known.into_iter().rev() {
            result.macros.add_expose_binding(definition, binding);
        }
    }
    if result.macros.all_calls().iter().any(|call| {
        call.kind == MacroKind::DefineExpose && !processed.contains(&(call.start, call.end))
    }) {
        result.macros.mark_expose_incomplete();
    }
}

fn resolved_binding(
    expression: &Expression<'_>,
    scoping: &Scoping,
) -> (Option<CompactString>, Option<(u32, u32)>) {
    let Expression::Identifier(identifier) = expression.get_inner_expression() else {
        return (None, None);
    };
    let symbol = identifier
        .reference_id
        .get()
        .and_then(|id| scoping.get_reference(id).symbol_id())
        .filter(|symbol| scoping.symbol_scope_id(*symbol) == scoping.root_scope_id());
    let Some(symbol) = symbol else {
        return (None, None);
    };
    let span = scoping.symbol_span(symbol);
    (
        Some(CompactString::new(scoping.symbol_name(symbol))),
        Some((span.start, span.end)),
    )
}

fn property_name(key: &PropertyKey<'_>, computed: bool) -> Option<CompactString> {
    match key {
        PropertyKey::StaticIdentifier(identifier) if !computed => {
            Some(CompactString::new(identifier.name.as_str()))
        }
        PropertyKey::StringLiteral(literal) => Some(CompactString::new(literal.value.as_str())),
        _ => None,
    }
}

fn is_vue_macro_import(program: &Program<'_>) -> bool {
    use oxc_ast::ast::ImportDeclarationSpecifier;
    program.body.iter().any(|statement| {
        let Statement::ImportDeclaration(import) = statement else { return false; };
        import.source.value == "vue" && !import.import_kind.is_type() && import.specifiers.as_ref().is_some_and(|specifiers| {
            specifiers.iter().any(|specifier| {
                matches!(specifier, ImportDeclarationSpecifier::ImportSpecifier(specifier)
                    if !specifier.import_kind.is_type() && specifier.local.name == DEFINE_EXPOSE && specifier.imported.name() == DEFINE_EXPOSE)
            })
        })
    })
}
