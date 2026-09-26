//! Authored event payload types, without validator bodies or inferred types.

use oxc_ast::ast::{PropertyKey, TSLiteral, TSMethodSignatureKind, TSSignature, TSType};
use oxc_span::{GetSpan, Span};
use vize_carton::CompactString;

use super::{ScriptParseResult, extract_emit_payload_tuple, type_annotation_source};
use crate::macros::EmitDefinition;

pub fn extract_emits_from_type(
    result: &mut ScriptParseResult,
    type_params: &oxc_allocator::Vec<'_, TSType<'_>>,
    source: &str,
) {
    for tp in type_params {
        let TSType::TSTypeLiteral(literal) = tp else {
            continue;
        };
        for member in &literal.members {
            let (name, span, payload_type) = match member {
                TSSignature::TSCallSignatureDeclaration(call) => {
                    let Some(annotation) = call
                        .params
                        .items
                        .first()
                        .and_then(|parameter| parameter.type_annotation.as_ref())
                    else {
                        continue;
                    };
                    let TSType::TSLiteralType(literal) = &annotation.type_annotation else {
                        continue;
                    };
                    let TSLiteral::StringLiteral(event) = &literal.literal else {
                        continue;
                    };
                    // A generic signature's local binders cannot be projected
                    // as root type names by a bare payload tuple.
                    let payload = (call.type_parameters.is_none() && call.this_param.is_none())
                        .then(|| extract_emit_payload_tuple(&call.params, source, 1))
                        .flatten();
                    (event.value.as_str(), event.span, payload)
                }
                TSSignature::TSPropertySignature(property) => {
                    let Some((name, span)) = property_name(&property.key, property.computed) else {
                        continue;
                    };
                    let payload = property.type_annotation.as_ref().and_then(|annotation| {
                        type_annotation_source(source, annotation.type_annotation.span())
                            .map(CompactString::new)
                    });
                    (name, span, payload)
                }
                TSSignature::TSMethodSignature(method)
                    if method.kind == TSMethodSignatureKind::Method =>
                {
                    let Some((name, span)) = property_name(&method.key, method.computed) else {
                        continue;
                    };
                    let payload = (method.type_parameters.is_none() && method.this_param.is_none())
                        .then(|| extract_emit_payload_tuple(&method.params, source, 0))
                        .flatten();
                    (name, span, payload)
                }
                _ => continue,
            };
            result.macros.add_emit_with_declaration(
                EmitDefinition {
                    name: CompactString::new(name),
                    payload_type,
                },
                span.start,
                span.end,
            );
        }
    }
}

fn property_name<'a>(key: &'a PropertyKey<'_>, computed: bool) -> Option<(&'a str, Span)> {
    match key {
        PropertyKey::StaticIdentifier(identifier) if !computed => {
            Some((identifier.name.as_str(), identifier.span))
        }
        PropertyKey::StringLiteral(literal) => Some((literal.value.as_str(), literal.span)),
        _ => None,
    }
}
