//! Authored exposure types. No return-type inference or function bodies.

use oxc_ast::ast::{
    BindingPattern, Expression, FormalParameters, Program, Statement, TSTypeAnnotation,
};
use oxc_span::GetSpan;
use std::fmt::Write;
use vize_carton::{CompactString, FxHashMap};

pub(super) fn declaration_types(
    program: &Program<'_>,
    source: &str,
) -> FxHashMap<(u32, u32), CompactString> {
    let mut types = FxHashMap::default();
    for statement in &program.body {
        match statement {
            Statement::VariableDeclaration(declaration) => {
                for declaration in &declaration.declarations {
                    let BindingPattern::BindingIdentifier(identifier) = &declaration.id else {
                        continue;
                    };
                    let ty = declaration
                        .type_annotation
                        .as_ref()
                        .map(|ty| type_text(ty, source))
                        .or_else(|| {
                            declaration
                                .init
                                .as_ref()
                                .and_then(|init| expression_type(init, source))
                        });
                    if let Some(ty) = ty {
                        types.insert((identifier.span.start, identifier.span.end), ty);
                    }
                }
            }
            Statement::FunctionDeclaration(function) => {
                if let Some(identifier) = &function.id
                    && let Some(ty) = function_type(
                        &function.params,
                        function.return_type.as_deref(),
                        function.type_parameters.as_ref().map(|ty| ty.span),
                        function.this_param.is_some(),
                        source,
                    )
                {
                    types.insert((identifier.span.start, identifier.span.end), ty);
                }
            }
            _ => {}
        }
    }
    types
}

pub(super) fn expression_type(expression: &Expression<'_>, source: &str) -> Option<CompactString> {
    match expression {
        Expression::TSAsExpression(expression) => {
            assertion_type(&expression.type_annotation, source)
        }
        Expression::TSTypeAssertion(expression) => {
            assertion_type(&expression.type_annotation, source)
        }
        Expression::ParenthesizedExpression(expression) => {
            expression_type(&expression.expression, source)
        }
        Expression::TSNonNullExpression(expression) => {
            expression_type(&expression.expression, source)
        }
        Expression::FunctionExpression(function) => function_type(
            &function.params,
            function.return_type.as_deref(),
            function.type_parameters.as_ref().map(|ty| ty.span),
            function.this_param.is_some(),
            source,
        ),
        Expression::ArrowFunctionExpression(function) => function_type(
            &function.params,
            function.return_type.as_deref(),
            function.type_parameters.as_ref().map(|ty| ty.span),
            false,
            source,
        ),
        // `satisfies` validates a type without changing the expression's type.
        Expression::TSSatisfiesExpression(expression) => {
            expression_type(&expression.expression, source)
        }
        _ => None,
    }
}

fn assertion_type(annotation: &oxc_ast::ast::TSType<'_>, source: &str) -> Option<CompactString> {
    if matches!(annotation, oxc_ast::ast::TSType::TSTypeReference(reference)
        if matches!(&reference.type_name, oxc_ast::ast::TSTypeName::IdentifierReference(identifier) if identifier.name == "const"))
    {
        None
    } else {
        Some(CompactString::new(annotation.span().source_text(source)))
    }
}

fn type_text(annotation: &TSTypeAnnotation<'_>, source: &str) -> CompactString {
    CompactString::new(annotation.type_annotation.span().source_text(source))
}

fn function_type(
    params: &FormalParameters<'_>,
    returns: Option<&TSTypeAnnotation<'_>>,
    generics: Option<oxc_span::Span>,
    has_this: bool,
    source: &str,
) -> Option<CompactString> {
    if has_this {
        return None;
    }
    let returns = returns?;
    let mut text = CompactString::default();
    if let Some(generics) = generics {
        text.push_str(generics.source_text(source));
    }
    text.push('(');
    for (index, parameter) in params.items.iter().enumerate() {
        let BindingPattern::BindingIdentifier(identifier) = &parameter.pattern else {
            return None;
        };
        let ty = parameter.type_annotation.as_ref()?;
        if index > 0 {
            text.push_str(", ");
        }
        write!(
            text,
            "{}{}: {}",
            identifier.name,
            if parameter.optional || parameter.initializer.is_some() {
                "?"
            } else {
                ""
            },
            type_text(ty, source)
        )
        .ok()?;
    }
    if let Some(rest) = &params.rest {
        let BindingPattern::BindingIdentifier(identifier) = &rest.rest.argument else {
            return None;
        };
        let ty = rest.type_annotation.as_ref()?;
        if !params.items.is_empty() {
            text.push_str(", ");
        }
        write!(text, "...{}: {}", identifier.name, type_text(ty, source)).ok()?;
    }
    write!(text, ") => {}", type_text(returns, source)).ok()?;
    Some(text)
}
