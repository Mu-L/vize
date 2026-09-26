mod signature;
#[cfg(test)]
mod tests;
mod typed;

pub(super) use signature::extract_runtime_emit_signature;
pub use typed::extract_emits_from_type;

use oxc_ast::ast::{
    Argument, BindingPattern, Expression, FormalParameters, ObjectPropertyKind, PropertyKey,
};
use oxc_span::{GetSpan, Span};

use crate::macros::EmitDefinition;
use vize_carton::{CompactString, String};

use super::super::ScriptParseResult;

/// Extract emits from runtime arguments (array)
pub fn extract_emits_from_runtime(
    result: &mut ScriptParseResult,
    arg: &Argument<'_>,
    source: &str,
) {
    match arg {
        Argument::ArrayExpression(arr) => extract_emits_from_array(result, arr),
        Argument::ObjectExpression(obj) => extract_emits_from_object(result, obj, source),
        Argument::TSAsExpression(ts_as) => {
            extract_emits_from_runtime_expression(result, &ts_as.expression, source);
        }
        Argument::TSSatisfiesExpression(ts_satisfies) => {
            extract_emits_from_runtime_expression(result, &ts_satisfies.expression, source);
        }
        Argument::TSNonNullExpression(ts_non_null) => {
            extract_emits_from_runtime_expression(result, &ts_non_null.expression, source);
        }
        Argument::ParenthesizedExpression(paren) => {
            extract_emits_from_runtime_expression(result, &paren.expression, source);
        }
        _ => {}
    }
}

fn extract_emits_from_runtime_expression(
    result: &mut ScriptParseResult,
    expr: &Expression<'_>,
    source: &str,
) {
    match expr {
        Expression::ArrayExpression(arr) => extract_emits_from_array(result, arr),
        Expression::ObjectExpression(obj) => extract_emits_from_object(result, obj, source),
        Expression::TSAsExpression(ts_as) => {
            extract_emits_from_runtime_expression(result, &ts_as.expression, source);
        }
        Expression::TSSatisfiesExpression(ts_satisfies) => {
            extract_emits_from_runtime_expression(result, &ts_satisfies.expression, source);
        }
        Expression::TSNonNullExpression(ts_non_null) => {
            extract_emits_from_runtime_expression(result, &ts_non_null.expression, source);
        }
        Expression::ParenthesizedExpression(paren) => {
            extract_emits_from_runtime_expression(result, &paren.expression, source);
        }
        _ => {}
    }
}

fn extract_emits_from_array(
    result: &mut ScriptParseResult,
    arr: &oxc_ast::ast::ArrayExpression<'_>,
) {
    for elem in arr.elements.iter() {
        if let oxc_ast::ast::ArrayExpressionElement::StringLiteral(s) = elem {
            result.macros.add_emit_with_declaration(
                EmitDefinition {
                    name: CompactString::new(s.value.as_str()),
                    payload_type: None,
                },
                s.span.start,
                s.span.end,
            );
        }
    }
}

fn extract_emits_from_object(
    result: &mut ScriptParseResult,
    obj: &oxc_ast::ast::ObjectExpression<'_>,
    source: &str,
) {
    for prop in obj.properties.iter() {
        match prop {
            ObjectPropertyKind::ObjectProperty(prop) => {
                let (name, span) = match &prop.key {
                    PropertyKey::StaticIdentifier(id) => (id.name.as_str(), id.span),
                    PropertyKey::StringLiteral(s) => (s.value.as_str(), s.span),
                    _ => continue,
                };

                result.macros.add_emit_with_declaration(
                    EmitDefinition {
                        name: CompactString::new(name),
                        payload_type: extract_runtime_emit_payload_type(&prop.value, source),
                    },
                    span.start,
                    span.end,
                );
                if prop.kind == oxc_ast::ast::PropertyKind::Init
                    && let Some(signature) = extract_runtime_emit_signature(&prop.value, source)
                {
                    result.macros.add_emit_validator_signature(name, signature);
                }
            }
            ObjectPropertyKind::SpreadProperty(spread) => {
                let Expression::Identifier(identifier) = &spread.argument else {
                    continue;
                };
                let Some(literal) = result
                    .runtime_object_literals
                    .get(identifier.name.as_str())
                    .cloned()
                else {
                    continue;
                };
                for emit in literal.emits {
                    result.macros.add_emit(emit);
                }
                for (name, signatures) in literal.emit_validator_signatures {
                    for signature in signatures {
                        result.macros.add_emit_validator_signature(&name, signature);
                    }
                }
            }
        }
    }
}

pub(in crate::script_parser) fn extract_runtime_emit_payload_type(
    value: &Expression<'_>,
    source: &str,
) -> Option<CompactString> {
    match value {
        Expression::ArrowFunctionExpression(func) if func.type_parameters.is_none() => {
            extract_emit_payload_tuple(&func.params, source, 0)
        }
        Expression::FunctionExpression(func)
            if func.type_parameters.is_none() && func.this_param.is_none() =>
        {
            extract_emit_payload_tuple(&func.params, source, 0)
        }
        Expression::TSAsExpression(ts_as) => {
            extract_runtime_emit_payload_type(&ts_as.expression, source)
        }
        Expression::TSSatisfiesExpression(ts_satisfies) => {
            extract_runtime_emit_payload_type(&ts_satisfies.expression, source)
        }
        Expression::TSNonNullExpression(ts_non_null) => {
            extract_runtime_emit_payload_type(&ts_non_null.expression, source)
        }
        Expression::ParenthesizedExpression(paren) => {
            extract_runtime_emit_payload_type(&paren.expression, source)
        }
        _ => None,
    }
}

fn extract_emit_payload_tuple(
    params: &FormalParameters<'_>,
    source: &str,
    skip: usize,
) -> Option<CompactString> {
    let mut payload = String::from("[");
    let mut first = true;

    for param in params.items.iter().skip(skip) {
        let type_annotation = param.type_annotation.as_ref()?;
        let ty = type_annotation_source(source, type_annotation.type_annotation.span())?;

        if !first {
            payload.push_str(", ");
        }
        first = false;

        if let BindingPattern::BindingIdentifier(identifier) = &param.pattern {
            payload.push_str(identifier.name.as_str());
            if param.optional || param.initializer.is_some() {
                payload.push('?');
            }
            payload.push_str(": ");
        } else if param.optional || param.initializer.is_some() {
            // Optional destructured parameters cannot become a labeled tuple
            // without inventing a parameter name.
            return None;
        }
        payload.push_str(ty);
    }

    if let Some(rest) = params.rest.as_ref() {
        let type_annotation = rest.type_annotation.as_ref()?;
        let ty = type_annotation_source(source, type_annotation.type_annotation.span())?;

        if !first {
            payload.push_str(", ");
        }

        if let BindingPattern::BindingIdentifier(identifier) = &rest.rest.argument {
            payload.push_str("...");
            payload.push_str(identifier.name.as_str());
            payload.push_str(": ");
        } else {
            payload.push_str("...");
        }
        payload.push_str(ty);
    }

    payload.push(']');
    Some(CompactString::new(payload.as_str()))
}

fn type_annotation_source(source: &str, span: Span) -> Option<&str> {
    let ty = source.get(span.start as usize..span.end as usize)?;
    (!ty.is_empty()).then_some(ty)
}
