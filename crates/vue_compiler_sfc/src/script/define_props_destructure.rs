//! defineProps destructure handling.
//!
//! Handles the props destructure pattern: `const { prop1, prop2 = default } = defineProps(...)`
//!
//! This module follows Vue.js core's definePropsDestructure.ts implementation.
//! Uses OXC for AST-based analysis and transformation.

use oxc_allocator::Allocator;
use oxc_ast::ast::{
    BindingPattern, BindingPatternKind, Expression, ObjectPattern, Program, Statement,
};
use oxc_parser::Parser;
use oxc_span::{GetSpan, SourceType};
use rustc_hash::FxHashMap;

use crate::types::BindingType;

/// Props destructure binding info
#[derive(Debug, Clone)]
pub struct PropsDestructureBinding {
    /// Local variable name
    pub local: String,
    /// Default value expression (source text)
    pub default: Option<String>,
}

/// Props destructure bindings data
#[derive(Debug, Clone, Default)]
pub struct PropsDestructuredBindings {
    /// Map of prop key -> binding info
    pub bindings: FxHashMap<String, PropsDestructureBinding>,
    /// Rest spread identifier (if any)
    pub rest_id: Option<String>,
}

impl PropsDestructuredBindings {
    pub fn is_empty(&self) -> bool {
        self.bindings.is_empty() && self.rest_id.is_none()
    }
}

/// Process props destructure from an ObjectPattern
pub fn process_props_destructure(
    pattern: &ObjectPattern<'_>,
    source: &str,
) -> (
    PropsDestructuredBindings,
    FxHashMap<String, BindingType>,
    FxHashMap<String, String>,
) {
    let mut result = PropsDestructuredBindings::default();
    let mut binding_metadata: FxHashMap<String, BindingType> = FxHashMap::default();
    let mut props_aliases: FxHashMap<String, String> = FxHashMap::default();

    for prop in pattern.properties.iter() {
        let key = resolve_object_key(&prop.key, source);

        if let Some(key) = key {
            match &prop.value.kind {
                // Default value: { foo = 123 }
                BindingPatternKind::AssignmentPattern(assign) => {
                    if let BindingPatternKind::BindingIdentifier(id) = &assign.left.kind {
                        let local = id.name.to_string();
                        let default_expr = &source
                            [assign.right.span().start as usize..assign.right.span().end as usize];

                        result.bindings.insert(
                            key.clone(),
                            PropsDestructureBinding {
                                local: local.clone(),
                                default: Some(default_expr.to_string()),
                            },
                        );

                        // If local name differs from key, it's an alias
                        if local != key {
                            binding_metadata.insert(local.clone(), BindingType::PropsAliased);
                            props_aliases.insert(local, key);
                        } else {
                            // Same name - it's a prop
                            binding_metadata.insert(local.clone(), BindingType::Props);
                        }
                    }
                }
                // Simple destructure: { foo } or { foo: bar }
                BindingPatternKind::BindingIdentifier(id) => {
                    let local = id.name.to_string();

                    result.bindings.insert(
                        key.clone(),
                        PropsDestructureBinding {
                            local: local.clone(),
                            default: None,
                        },
                    );

                    // If local name differs from key, it's an alias
                    if local != key {
                        binding_metadata.insert(local.clone(), BindingType::PropsAliased);
                        props_aliases.insert(local, key);
                    } else {
                        // Same name - it's a prop
                        binding_metadata.insert(local.clone(), BindingType::Props);
                    }
                }
                _ => {
                    // Nested patterns not supported
                }
            }
        }
    }

    // Handle rest spread: { ...rest }
    if let Some(rest) = &pattern.rest {
        if let BindingPatternKind::BindingIdentifier(id) = &rest.argument.kind {
            let rest_name = id.name.to_string();
            result.rest_id = Some(rest_name.clone());
            binding_metadata.insert(rest_name, BindingType::SetupReactiveConst);
        }
    }

    (result, binding_metadata, props_aliases)
}

/// Resolve object key to string
fn resolve_object_key(key: &oxc_ast::ast::PropertyKey<'_>, _source: &str) -> Option<String> {
    match key {
        oxc_ast::ast::PropertyKey::StaticIdentifier(id) => Some(id.name.to_string()),
        oxc_ast::ast::PropertyKey::StringLiteral(lit) => Some(lit.value.to_string()),
        oxc_ast::ast::PropertyKey::NumericLiteral(lit) => Some(lit.value.to_string()),
        _ => None, // Computed keys not supported
    }
}

/// Transform destructured props references in source code.
/// Rewrites `foo` to `__props.foo` for destructured props.
pub fn transform_destructured_props(
    source: &str,
    destructured: &PropsDestructuredBindings,
) -> String {
    if destructured.is_empty() {
        return source.to_string();
    }

    // Build map of local name -> prop key
    let mut local_to_key: FxHashMap<&str, &str> = FxHashMap::default();
    for (key, binding) in &destructured.bindings {
        local_to_key.insert(binding.local.as_str(), key.as_str());
    }

    // Try AST-based transformation first
    let allocator = Allocator::default();
    let source_type = SourceType::from_path("script.ts").unwrap_or_default();
    let ret = Parser::new(&allocator, source, source_type).parse();

    if !ret.panicked {
        // Collect rewrites: (start, end, replacement)
        let mut rewrites: Vec<(usize, usize, String)> = Vec::new();

        // Walk the AST to find identifier references
        collect_identifier_rewrites(&ret.program, source, &local_to_key, &mut rewrites);

        // Apply rewrites if any found (empty rewrites means all props are shadowed or unused)
        if !rewrites.is_empty() {
            // Apply rewrites in reverse order to preserve positions
            rewrites.sort_by(|a, b| b.0.cmp(&a.0));

            let mut result = source.to_string();
            for (start, end, replacement) in rewrites {
                result.replace_range(start..end, &replacement);
            }
            return result;
        }

        // AST parsing succeeded but no rewrites needed (props are shadowed or unused)
        return source.to_string();
    }

    // Fallback: Simple text-based transformation
    // This handles cases where AST parsing failed
    transform_props_text_based(source, &local_to_key)
}

/// Text-based transformation fallback
fn transform_props_text_based(source: &str, local_to_key: &FxHashMap<&str, &str>) -> String {
    let mut result = source.to_string();

    // Sort by length (longest first) to avoid partial replacements
    let mut props: Vec<(&str, &str)> = local_to_key.iter().map(|(k, v)| (*k, *v)).collect();
    props.sort_by(|a, b| b.0.len().cmp(&a.0.len()));

    for (local, key) in props {
        result = replace_identifier(&result, local, &gen_props_access_exp(key));
    }

    result
}

/// Replace identifier occurrences with proper word boundary checking
fn replace_identifier(source: &str, name: &str, replacement: &str) -> String {
    let mut result = String::new();
    let chars: Vec<char> = source.chars().collect();
    let name_chars: Vec<char> = name.chars().collect();
    let mut i = 0;

    while i < chars.len() {
        // Check if we're at the start of the identifier
        if i + name_chars.len() <= chars.len() {
            let potential_match: String = chars[i..i + name_chars.len()].iter().collect();
            if potential_match == name {
                // Check word boundaries
                let before_ok = i == 0 || !is_identifier_char(chars[i - 1]);
                let after_ok = i + name_chars.len() >= chars.len()
                    || !is_identifier_char(chars[i + name_chars.len()]);

                // Check not preceded by . (member access) or __props already
                let not_member = i == 0 || chars[i - 1] != '.';

                if before_ok && after_ok && not_member {
                    result.push_str(replacement);
                    i += name_chars.len();
                    continue;
                }
            }
        }
        result.push(chars[i]);
        i += 1;
    }

    result
}

/// Check if character can be part of an identifier
fn is_identifier_char(c: char) -> bool {
    c.is_alphanumeric() || c == '_' || c == '$'
}

/// Collect identifier rewrites from AST
fn collect_identifier_rewrites<'a>(
    program: &Program<'a>,
    source: &str,
    local_to_key: &FxHashMap<&str, &str>,
    rewrites: &mut Vec<(usize, usize, String)>,
) {
    // Track local bindings that shadow destructured props
    let mut local_bindings: FxHashMap<String, bool> = FxHashMap::default();

    // Walk statements
    for stmt in program.body.iter() {
        collect_from_statement(stmt, source, local_to_key, &mut local_bindings, rewrites);
    }
}

fn collect_from_statement<'a>(
    stmt: &Statement<'a>,
    source: &str,
    local_to_key: &FxHashMap<&str, &str>,
    local_bindings: &mut FxHashMap<String, bool>,
    rewrites: &mut Vec<(usize, usize, String)>,
) {
    match stmt {
        Statement::VariableDeclaration(decl) => {
            for declarator in decl.declarations.iter() {
                // Register local bindings
                register_binding_pattern(&declarator.id, local_bindings);

                // Check initializer for identifier references
                if let Some(init) = &declarator.init {
                    collect_from_expression(init, source, local_to_key, local_bindings, rewrites);
                }
            }
        }
        Statement::ExpressionStatement(expr_stmt) => {
            collect_from_expression(
                &expr_stmt.expression,
                source,
                local_to_key,
                local_bindings,
                rewrites,
            );
        }
        Statement::ReturnStatement(ret) => {
            if let Some(arg) = &ret.argument {
                collect_from_expression(arg, source, local_to_key, local_bindings, rewrites);
            }
        }
        Statement::IfStatement(if_stmt) => {
            collect_from_expression(
                &if_stmt.test,
                source,
                local_to_key,
                local_bindings,
                rewrites,
            );
        }
        Statement::FunctionDeclaration(func) => {
            // Register function name as local binding
            if let Some(id) = &func.id {
                local_bindings.insert(id.name.to_string(), true);
            }
            // TODO: Walk function body with new scope
        }
        _ => {}
    }
}

fn collect_from_expression<'a>(
    expr: &Expression<'a>,
    source: &str,
    local_to_key: &FxHashMap<&str, &str>,
    local_bindings: &FxHashMap<String, bool>,
    rewrites: &mut Vec<(usize, usize, String)>,
) {
    match expr {
        Expression::Identifier(id) => {
            let name = id.name.as_str();
            // Check if this is a destructured prop and not shadowed
            if let Some(key) = local_to_key.get(name) {
                if !local_bindings.contains_key(name) {
                    rewrites.push((
                        id.span.start as usize,
                        id.span.end as usize,
                        gen_props_access_exp(key),
                    ));
                }
            }
        }
        Expression::CallExpression(call) => {
            // Check arguments
            for arg in call.arguments.iter() {
                if let Some(expr) = arg.as_expression() {
                    collect_from_expression(expr, source, local_to_key, local_bindings, rewrites);
                }
            }
            // Check callee
            collect_from_expression(&call.callee, source, local_to_key, local_bindings, rewrites);
        }
        Expression::ArrowFunctionExpression(arrow) => {
            // Create new scope for arrow function
            let mut inner_bindings = local_bindings.clone();
            // Register parameters
            for param in arrow.params.items.iter() {
                register_binding_pattern(&param.pattern, &mut inner_bindings);
            }
            // Walk body statements - for expression bodies, OXC wraps the expression in a statement
            for stmt in arrow.body.statements.iter() {
                collect_from_statement(stmt, source, local_to_key, &mut inner_bindings, rewrites);
            }
        }
        Expression::FunctionExpression(func) => {
            // Create new scope for function
            let mut inner_bindings = local_bindings.clone();
            // Register parameters
            for param in func.params.items.iter() {
                register_binding_pattern(&param.pattern, &mut inner_bindings);
            }
            // Walk body statements
            if let Some(body) = &func.body {
                for stmt in body.statements.iter() {
                    collect_from_statement(
                        stmt,
                        source,
                        local_to_key,
                        &mut inner_bindings,
                        rewrites,
                    );
                }
            }
        }
        Expression::BinaryExpression(bin) => {
            collect_from_expression(&bin.left, source, local_to_key, local_bindings, rewrites);
            collect_from_expression(&bin.right, source, local_to_key, local_bindings, rewrites);
        }
        _ if expr.is_member_expression() => {
            // Handle MemberExpression via helper method
            if let Some(member) = expr.as_member_expression() {
                collect_from_expression(
                    member.object(),
                    source,
                    local_to_key,
                    local_bindings,
                    rewrites,
                );
            }
        }
        Expression::ObjectExpression(obj) => {
            for prop in obj.properties.iter() {
                match prop {
                    oxc_ast::ast::ObjectPropertyKind::ObjectProperty(p) => {
                        // Check for shorthand: { foo } should become { foo: __props.foo }
                        if p.shorthand {
                            if let oxc_ast::ast::PropertyKey::StaticIdentifier(id) = &p.key {
                                let name = id.name.as_str();
                                if let Some(key) = local_to_key.get(name) {
                                    if !local_bindings.contains_key(name) {
                                        // For shorthand, we need to expand it
                                        // { foo } -> { foo: __props.foo }
                                        let end = p.span.end as usize;
                                        rewrites.push((
                                            end,
                                            end,
                                            format!(": {}", gen_props_access_exp(key)),
                                        ));
                                    }
                                }
                            }
                        } else {
                            collect_from_expression(
                                &p.value,
                                source,
                                local_to_key,
                                local_bindings,
                                rewrites,
                            );
                        }
                    }
                    oxc_ast::ast::ObjectPropertyKind::SpreadProperty(spread) => {
                        collect_from_expression(
                            &spread.argument,
                            source,
                            local_to_key,
                            local_bindings,
                            rewrites,
                        );
                    }
                }
            }
        }
        Expression::ArrayExpression(arr) => {
            for elem in arr.elements.iter() {
                match elem {
                    oxc_ast::ast::ArrayExpressionElement::SpreadElement(spread) => {
                        collect_from_expression(
                            &spread.argument,
                            source,
                            local_to_key,
                            local_bindings,
                            rewrites,
                        );
                    }
                    oxc_ast::ast::ArrayExpressionElement::Elision(_) => {}
                    _ => {
                        if let Some(e) = elem.as_expression() {
                            collect_from_expression(
                                e,
                                source,
                                local_to_key,
                                local_bindings,
                                rewrites,
                            );
                        }
                    }
                }
            }
        }
        Expression::TemplateLiteral(template) => {
            for expr in template.expressions.iter() {
                collect_from_expression(expr, source, local_to_key, local_bindings, rewrites);
            }
        }
        Expression::ConditionalExpression(cond) => {
            collect_from_expression(&cond.test, source, local_to_key, local_bindings, rewrites);
            collect_from_expression(
                &cond.consequent,
                source,
                local_to_key,
                local_bindings,
                rewrites,
            );
            collect_from_expression(
                &cond.alternate,
                source,
                local_to_key,
                local_bindings,
                rewrites,
            );
        }
        Expression::LogicalExpression(log) => {
            collect_from_expression(&log.left, source, local_to_key, local_bindings, rewrites);
            collect_from_expression(&log.right, source, local_to_key, local_bindings, rewrites);
        }
        Expression::UnaryExpression(unary) => {
            collect_from_expression(
                &unary.argument,
                source,
                local_to_key,
                local_bindings,
                rewrites,
            );
        }
        Expression::ParenthesizedExpression(paren) => {
            collect_from_expression(
                &paren.expression,
                source,
                local_to_key,
                local_bindings,
                rewrites,
            );
        }
        _ => {}
    }
}

fn register_binding_pattern(pattern: &BindingPattern<'_>, bindings: &mut FxHashMap<String, bool>) {
    match &pattern.kind {
        BindingPatternKind::BindingIdentifier(id) => {
            bindings.insert(id.name.to_string(), true);
        }
        BindingPatternKind::ObjectPattern(obj) => {
            for prop in obj.properties.iter() {
                register_binding_pattern(&prop.value, bindings);
            }
            if let Some(rest) = &obj.rest {
                register_binding_pattern(&rest.argument, bindings);
            }
        }
        BindingPatternKind::ArrayPattern(arr) => {
            for elem in arr.elements.iter().flatten() {
                register_binding_pattern(elem, bindings);
            }
            if let Some(rest) = &arr.rest {
                register_binding_pattern(&rest.argument, bindings);
            }
        }
        BindingPatternKind::AssignmentPattern(assign) => {
            register_binding_pattern(&assign.left, bindings);
        }
    }
}

/// Generate prop access expression
pub fn gen_props_access_exp(key: &str) -> String {
    if is_simple_identifier(key) {
        format!("__props.{}", key)
    } else {
        format!("__props[{:?}]", key)
    }
}

/// Check if string is a simple identifier
fn is_simple_identifier(s: &str) -> bool {
    if s.is_empty() {
        return false;
    }

    let mut chars = s.chars();
    match chars.next() {
        Some(c) if c.is_alphabetic() || c == '_' || c == '$' => {}
        _ => return false,
    }

    chars.all(|c| c.is_alphanumeric() || c == '_' || c == '$')
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_gen_props_access_exp() {
        assert_eq!(gen_props_access_exp("msg"), "__props.msg");
        assert_eq!(gen_props_access_exp("my-prop"), "__props[\"my-prop\"]");
    }

    #[test]
    fn test_transform_simple() {
        let mut bindings = PropsDestructuredBindings::default();
        bindings.bindings.insert(
            "msg".to_string(),
            PropsDestructureBinding {
                local: "msg".to_string(),
                default: None,
            },
        );

        let source = "console.log(msg)";
        let result = transform_destructured_props(source, &bindings);
        assert!(result.contains("__props.msg"), "Got: {}", result);
    }

    #[test]
    fn test_transform_with_shadowing() {
        let mut bindings = PropsDestructuredBindings::default();
        bindings.bindings.insert(
            "msg".to_string(),
            PropsDestructureBinding {
                local: "msg".to_string(),
                default: None,
            },
        );

        // msg is shadowed by the arrow function parameter
        let source = "const fn = (msg) => console.log(msg)";
        let result = transform_destructured_props(source, &bindings);
        // The msg inside the arrow function should NOT be rewritten
        assert!(!result.contains("__props"), "Got: {}", result);
    }

    #[test]
    fn test_transform_in_computed() {
        let mut bindings = PropsDestructuredBindings::default();
        bindings.bindings.insert(
            "count".to_string(),
            PropsDestructureBinding {
                local: "count".to_string(),
                default: None,
            },
        );

        // count inside computed arrow function should be rewritten
        let source = "const double = computed(() => count * 2)";
        let result = transform_destructured_props(source, &bindings);
        println!("Input:  {}", source);
        println!("Output: {}", result);
        assert!(
            result.contains("__props.count"),
            "Expected __props.count, got: {}",
            result
        );
        assert_eq!(result, "const double = computed(() => __props.count * 2)");
    }

    #[test]
    fn test_transform_multiple_refs() {
        let mut bindings = PropsDestructuredBindings::default();
        bindings.bindings.insert(
            "foo".to_string(),
            PropsDestructureBinding {
                local: "foo".to_string(),
                default: None,
            },
        );
        bindings.bindings.insert(
            "bar".to_string(),
            PropsDestructureBinding {
                local: "bar".to_string(),
                default: None,
            },
        );

        let source = "const result = foo + bar";
        let result = transform_destructured_props(source, &bindings);
        assert!(result.contains("__props.foo"), "Got: {}", result);
        assert!(result.contains("__props.bar"), "Got: {}", result);
    }
}
