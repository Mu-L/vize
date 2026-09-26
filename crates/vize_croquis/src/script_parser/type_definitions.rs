//! Local type declaration metadata collected directly from OXC nodes.

use super::ScriptParseResult;
use oxc_ast::ast::{Declaration, TSInterfaceDeclaration, TSTypeAliasDeclaration};
use oxc_span::GetSpan;

impl ScriptParseResult {
    /// Register a top-level `interface Name { ... }` or `type Name = ...`
    /// declaration into the [`TypeResolver`] by name, keyed to its body source
    /// text (`{ ... }` for interfaces, the RHS for aliases). This is the
    /// AST-backed replacement for canon's old raw-text interface scanner:
    /// `defineProps<Name>()` and template-binding analysis recover the type's
    /// fields by resolving the name here, which handles nested braces,
    /// generics, and comments correctly.
    pub(crate) fn register_local_type(&mut self, decl: &Declaration<'_>, source: &str) {
        match decl {
            Declaration::TSInterfaceDeclaration(interface) => {
                self.register_local_interface(interface, source);
            }
            Declaration::TSTypeAliasDeclaration(alias) => {
                self.register_local_type_alias(alias, source);
            }
            _ => {}
        }
    }

    pub(crate) fn register_local_interface(
        &mut self,
        interface: &TSInterfaceDeclaration<'_>,
        source: &str,
    ) {
        let extends = interface
            .extends
            .iter()
            .filter_map(|heritage| normalize_interface_heritage(heritage.span.source_text(source)))
            .collect();
        self.types.definitions_mut().set_type_parameters(
            interface.id.name.as_str(),
            interface
                .type_parameters
                .as_ref()
                .map(|parameters| parameters.span.source_text(source)),
        );
        self.types.add_interface_with_extends(
            interface.id.name.as_str(),
            interface.body.span.source_text(source),
            extends,
        );
    }

    pub(crate) fn register_local_type_alias(
        &mut self,
        alias: &TSTypeAliasDeclaration<'_>,
        source: &str,
    ) {
        self.types.definitions_mut().set_type_parameters(
            alias.id.name.as_str(),
            alias
                .type_parameters
                .as_ref()
                .map(|parameters| parameters.span.source_text(source)),
        );
        self.types.add_type_alias(
            alias.id.name.as_str(),
            alias.type_annotation.span().source_text(source).trim(),
        );
    }
}

fn normalize_interface_heritage(raw: &str) -> Option<vize_carton::CompactString> {
    let mut heritage = raw.trim();
    if let Some(rest) = heritage.strip_prefix("extends") {
        let starts_like_keyword = rest
            .chars()
            .next()
            .map(|c| c.is_whitespace())
            .unwrap_or(true);
        if starts_like_keyword {
            heritage = rest.trim_start();
        }
    }
    heritage = heritage.trim_start_matches(',').trim();
    if heritage.is_empty() {
        None
    } else {
        Some(vize_carton::CompactString::new(heritage))
    }
}
