//! Reject authored lexical bindings that shadow the backend's helper aliases.
//! This uses binding nodes, so property names, comments and strings are harmless.

use super::{JsxComponent, Renderer, error};
use crate::{JsxDiagnostic, JsxLang};
use oxc_ast::ast::{BindingIdentifier, Declaration, Function, IdentifierReference, Statement};
use oxc_ast_visit::Visit;
use vize_s0::FxHashMap;

pub(super) fn check(
    components: &[JsxComponent],
    spans: &[(u32, u32)],
    preamble: &str,
    source: &str,
    lang: JsxLang,
) -> Result<Vec<Renderer>, JsxDiagnostic> {
    let allocator = oxc_allocator::Allocator::default();
    let generated = crate::parse_module(&allocator, preamble, JsxLang::Jsx);
    let authored = crate::parse_module(&allocator, source, lang);
    let mut helpers = Bindings {
        top_level_only: true,
        ..Default::default()
    };
    helpers.visit_program(&generated.program);
    let mut bindings = Bindings::default();
    bindings.visit_program(&authored.program);
    for (name, &(start, end)) in &bindings.names {
        if helpers.names.contains_key(name) {
            return Err(JsxDiagnostic::error(
                vize_s0::cstr!(
                    "JSX authored binding `{name}` shadows a generated runtime helper; rename the binding"
                ),
                start,
                end,
            ));
        }
    }
    components.iter().zip(spans).map(|(component, &(start, end))| {
        let allocator = oxc_allocator::Allocator::default();
        let parsed = crate::parse_module(&allocator, component.code(), JsxLang::Jsx);
        let mut generated = Bindings::default();
        generated.visit_program(&parsed.program);
        // The emitted renderer is anonymous, so this declaration cannot capture
        // an authored `render` binding. Its parameters and body locals can.
        generated.names.remove("render");
        let mut references = References { start, end, generated: &generated.names, missing: None };
        references.visit_program(&authored.program);
        if let Some((name, start, end)) = references.missing {
            return Err(JsxDiagnostic::error(
                vize_s0::cstr!("JSX authored reference `{name}` is shadowed by a generated renderer binding; rename the reference"), start, end,
            ));
        }
        renderer(&parsed)
    }).collect()
}

#[derive(Default)]
struct Bindings<'a> {
    top_level_only: bool,
    names: FxHashMap<&'a str, (u32, u32)>,
}

impl<'a> Visit<'a> for Bindings<'a> {
    fn visit_function(&mut self, function: &Function<'a>, flags: oxc_syntax::scope::ScopeFlags) {
        if self.top_level_only {
            if let Some(identifier) = &function.id {
                self.visit_binding_identifier(identifier);
            }
        } else {
            oxc_ast_visit::walk::walk_function(self, function, flags);
        }
    }

    fn visit_binding_identifier(&mut self, identifier: &BindingIdentifier<'a>) {
        self.names.insert(
            identifier.name.as_str(),
            (identifier.span.start, identifier.span.end),
        );
    }
}

fn renderer(parsed: &crate::ParsedModule<'_>) -> Result<Renderer, JsxDiagnostic> {
    if !parsed.has_errors() {
        for statement in &parsed.program.body {
            if let Statement::ExportNamedDeclaration(export) = statement
                && let Some(Declaration::FunctionDeclaration(function)) = &export.declaration
                && let Some(name) = &function.id
                && name.name == "render"
            {
                return Ok(Renderer {
                    prefix_end: export.span.start as usize,
                    name_end: name.span.end as usize,
                    function_end: function.span.end as usize,
                });
            }
        }
    }
    Err(error(
        0,
        0,
        "JSX backend did not produce a supported render declaration",
    ))
}

struct References<'a, 'g> {
    start: u32,
    end: u32,
    generated: &'g FxHashMap<&'g str, (u32, u32)>,
    missing: Option<(&'a str, u32, u32)>,
}

impl<'a> Visit<'a> for References<'a, '_> {
    fn visit_identifier_reference(&mut self, identifier: &IdentifierReference<'a>) {
        if self.start <= identifier.span.start
            && identifier.span.end <= self.end
            && self.generated.contains_key(identifier.name.as_str())
        {
            self.missing = Some((
                identifier.name.as_str(),
                identifier.span.start,
                identifier.span.end,
            ));
        }
    }
}
