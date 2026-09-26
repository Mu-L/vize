//! AST-authored validator headers, including lexical generic binders.

use oxc_ast::ast::{
    BindingPattern, Expression, FormalParameters, TSThisParameter, TSTypeAnnotation,
};
use oxc_span::Span;
use vize_carton::CompactString;

pub(in crate::script_parser::extract) fn extract_runtime_emit_signature(
    value: &Expression<'_>,
    source: &str,
) -> Option<CompactString> {
    let (parameters, generics, this_parameter, returns) = match value {
        Expression::ArrowFunctionExpression(function) => (
            &*function.params,
            function
                .type_parameters
                .as_ref()
                .map(|parameters| parameters.span),
            None,
            function.return_type.as_deref(),
        ),
        Expression::FunctionExpression(function) => (
            &*function.params,
            function
                .type_parameters
                .as_ref()
                .map(|parameters| parameters.span),
            function.this_param.as_deref(),
            function.return_type.as_deref(),
        ),
        Expression::TSAsExpression(expression) => {
            return extract_runtime_emit_signature(&expression.expression, source);
        }
        Expression::TSSatisfiesExpression(expression) => {
            return extract_runtime_emit_signature(&expression.expression, source);
        }
        Expression::TSNonNullExpression(expression) => {
            return extract_runtime_emit_signature(&expression.expression, source);
        }
        Expression::ParenthesizedExpression(expression) => {
            return extract_runtime_emit_signature(&expression.expression, source);
        }
        _ => return None,
    };
    header(parameters, generics, this_parameter, returns, source)
}

fn header(
    params: &FormalParameters<'_>,
    generics: Option<Span>,
    this: Option<&TSThisParameter<'_>>,
    returns: Option<&TSTypeAnnotation<'_>>,
    source: &str,
) -> Option<CompactString> {
    let mut text = CompactString::default();
    if let Some(generics) = generics {
        text.push_str(source.get(generics.start as usize..generics.end as usize)?);
    }
    text.push('(');
    let mut first = true;
    if let Some(this) = this {
        text.push_str("this");
        annotation(&mut text, this.type_annotation.as_deref(), source)?;
        first = false;
    }
    for parameter in &params.items {
        separator(&mut text, &mut first);
        pattern(&mut text, &parameter.pattern);
        if parameter.optional || parameter.initializer.is_some() {
            text.push('?');
        }
        annotation(&mut text, parameter.type_annotation.as_deref(), source)?;
    }
    if let Some(rest) = &params.rest {
        separator(&mut text, &mut first);
        text.push_str("...");
        pattern(&mut text, &rest.rest.argument);
        annotation(&mut text, rest.type_annotation.as_deref(), source)?;
    }
    text.push(')');
    annotation(&mut text, returns, source)?;
    Some(text)
}

fn separator(text: &mut CompactString, first: &mut bool) {
    if !*first {
        text.push_str(", ");
    }
    *first = false;
}

fn pattern(text: &mut CompactString, pattern: &BindingPattern<'_>) {
    match pattern {
        BindingPattern::BindingIdentifier(identifier) => text.push_str(identifier.name.as_str()),
        // Destructuring bindings do not establish the callable parameter type.
        // Their nested default expressions belong to implementation bodies.
        _ => text.push_str("__destructured"),
    }
}

fn annotation(
    text: &mut CompactString,
    annotation: Option<&TSTypeAnnotation<'_>>,
    source: &str,
) -> Option<()> {
    if let Some(annotation) = annotation {
        use oxc_span::GetSpan;
        let span = annotation.type_annotation.span();
        text.push_str(": ");
        text.push_str(source.get(span.start as usize..span.end as usize)?);
    }
    Some(())
}
