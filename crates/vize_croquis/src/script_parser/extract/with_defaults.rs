//! Static `withDefaults` facts extracted from the authored object AST.

use oxc_ast::ast::{CallExpression, ObjectPropertyKind, PropertyKey, PropertyKind};
use oxc_span::GetSpan;
use vize_carton::{CompactString, FxHashMap, ToCompactString};

use super::super::ScriptParseResult;
use super::common::argument_object;

pub(super) fn record_defaults(
    result: &mut ScriptParseResult,
    call: &CallExpression<'_>,
    source: &str,
) {
    let Some(argument) = call.arguments.get(1) else {
        return;
    };
    let expression = CompactString::new(argument.span().source_text(source));
    let mut values = FxHashMap::default();
    if let Some(object) = argument_object(argument) {
        for property in &object.properties {
            let ObjectPropertyKind::ObjectProperty(property) = property else {
                // An unknown spread may overwrite every preceding key.
                values.clear();
                continue;
            };
            let name = match &property.key {
                PropertyKey::StaticIdentifier(id) if !property.computed => {
                    CompactString::new(id.name.as_str())
                }
                PropertyKey::StringLiteral(literal) => CompactString::new(literal.value.as_str()),
                PropertyKey::NumericLiteral(literal) => literal.value.to_compact_string(),
                _ => {
                    // A dynamic key may overwrite any preceding default.
                    values.clear();
                    continue;
                }
            };
            if property.kind != PropertyKind::Init {
                // An accessor does not author the default's resulting value.
                values.remove(&name);
                continue;
            }
            values.insert(
                name,
                CompactString::new(property.value.span().source_text(source)),
            );
        }
    }
    result.macros.set_with_defaults(expression, values);
}
