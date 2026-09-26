//! Per-module lookup for authored external declarations.

use super::super::type_refs::{self, References};
use super::{PendingTypeRef, TypeDependency};
use crate::Croquis;
use crate::types::world::{TypeDeclarationKind, TypeLookup, UnknownTypeReason};
use vize_carton::{CompactString, cstr};

impl Croquis {
    pub(super) fn world_type_dependency(
        &self,
        item: &PendingTypeRef,
        generic: Option<&str>,
    ) -> Option<(TypeDependency, References, Option<CompactString>)> {
        let world = self.types.resolved_world()?;
        let context = item.context.as_deref().unwrap_or(&world.root_module);
        let reference = &item.reference;
        let found = match reference.module.as_deref() {
            Some(specifier) => world.resolve_import(context, specifier, &reference.name),
            None => world.resolve(context, &reference.name),
        };
        match found {
            TypeLookup::Found(id) => {
                let declaration = world.declaration(&id)?;
                // Imported declarations cannot capture an SFC's own generic
                // parameters just because both happen to be spelled `T`.
                let generic = (id.module == world.root_module)
                    .then_some(generic)
                    .flatten();
                let references =
                    type_refs::collect_declaration(&declaration.declaration_source, generic);
                Some((
                    TypeDependency {
                        name: id.name,
                        kind: CompactString::new(match declaration.kind {
                            TypeDeclarationKind::Alias => "alias",
                            TypeDeclarationKind::Interface => "interface",
                        }),
                        module: Some(id.module.clone()),
                        // The resolved key is the declaration's lexical binding,
                        // which need not share the public re-export's spelling.
                        export: None,
                        body: Some(declaration.body.clone()),
                        parameters: declaration.type_parameters.clone(),
                        extends: declaration.extends.clone(),
                        unresolved_reason: None,
                    },
                    references,
                    Some(id.module),
                ))
            }
            TypeLookup::Unknown(unknown) => {
                let parts = world.unknown_contract(&unknown);
                let mut references = References {
                    refs: Default::default(),
                    complete: false,
                };
                let generic = (unknown.module == world.root_module)
                    .then_some(generic)
                    .flatten();
                for part in parts.into_iter().flatten() {
                    references
                        .refs
                        .extend(type_refs::collect_declaration(part, generic).refs);
                }
                // Retain every authored type-only part without claiming that
                // unsupported declaration merging has been elaborated.
                // Each part is framed by its UTF-8 byte length and a colon;
                // concatenation is injective and needs no fallible serializer.
                let body = parts.map(|parts| {
                    let mut framed = CompactString::default();
                    for part in parts {
                        framed.push_str(&cstr!("{}:{part}", part.len()));
                    }
                    framed
                });
                Some((
                    TypeDependency {
                        name: unknown.name,
                        kind: CompactString::new("unresolved"),
                        module: Some(unknown.module.clone()),
                        export: None,
                        body,
                        parameters: None,
                        extends: Vec::new(),
                        unresolved_reason: Some(CompactString::new(reason_name(unknown.reason))),
                    },
                    references,
                    Some(unknown.module),
                ))
            }
        }
    }
}

fn reason_name(reason: UnknownTypeReason) -> &'static str {
    match reason {
        UnknownTypeReason::Unbound => "unbound",
        UnknownTypeReason::MissingModule => "missing-module",
        UnknownTypeReason::IncompleteModule => "incomplete-module",
        UnknownTypeReason::UnsupportedDeclaration => "unsupported-declaration",
        UnknownTypeReason::UnsupportedQualification => "unsupported-qualification",
        UnknownTypeReason::AmbiguousExport => "ambiguous-export",
        UnknownTypeReason::ResolutionCycle => "resolution-cycle",
        UnknownTypeReason::ResolutionLimit => "resolution-limit",
    }
}
