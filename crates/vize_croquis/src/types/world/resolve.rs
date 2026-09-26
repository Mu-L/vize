use super::{
    ResolvedTypeWorld, TypeDeclarationId, TypeExportBinding, TypeLookup, TypeModuleReference,
    UnknownTypeReason, UnknownTypeReference,
};
use vize_carton::{CompactString, FxHashSet, cstr};

const MAX_RESOLUTION_DEPTH: usize = 256;

impl ResolvedTypeWorld {
    /// Resolve a lexical type reference, including namespace imports, without
    /// consulting declarations in unrelated modules with matching names.
    pub fn resolve(&self, module: &str, name: &str) -> TypeLookup {
        self.resolve_local(module, name, &mut FxHashSet::default(), 0)
    }

    /// Resolve an authored `import('module').Export` type expression.
    pub fn resolve_import(&self, module: &str, specifier: &str, name: &str) -> TypeLookup {
        let Some(target) = self
            .modules
            .get(module)
            .and_then(|scope| scope.direct_imports.get(specifier))
        else {
            return self.unknown(specifier, name, UnknownTypeReason::MissingModule);
        };
        self.follow(target, name, &mut FxHashSet::default(), 0)
    }

    fn unknown(&self, module: &str, name: &str, reason: UnknownTypeReason) -> TypeLookup {
        TypeLookup::Unknown(UnknownTypeReference {
            module: CompactString::new(module),
            name: CompactString::new(name),
            reason,
        })
    }

    fn resolve_local(
        &self,
        module: &str,
        name: &str,
        visited: &mut FxHashSet<(CompactString, CompactString)>,
        depth: usize,
    ) -> TypeLookup {
        if depth >= MAX_RESOLUTION_DEPTH {
            return self.unknown(module, name, UnknownTypeReason::ResolutionLimit);
        }
        let Some(scope) = self.modules.get(module) else {
            return self.unknown(module, name, UnknownTypeReason::MissingModule);
        };
        if !scope.complete {
            return self.unknown(module, name, UnknownTypeReason::IncompleteModule);
        }
        if scope.unsupported_declarations.contains(name) {
            return self.unknown(module, name, UnknownTypeReason::UnsupportedDeclaration);
        }
        if scope.declarations.contains_key(name) {
            return TypeLookup::Found(TypeDeclarationId {
                module: CompactString::new(module),
                name: CompactString::new(name),
            });
        }
        let (binding, member) = name
            .split_once('.')
            .map_or((name, None), |(binding, member)| (binding, Some(member)));
        let Some(import) = scope.imports.get(binding) else {
            return self.unknown(module, name, UnknownTypeReason::Unbound);
        };
        let exported = match (&import.exported, member) {
            (Some(exported), None) => exported.as_str(),
            (None, Some(member)) => member,
            (Some(exported), Some(member)) => {
                return self.follow(
                    &import.target,
                    &cstr!("{exported}.{member}"),
                    visited,
                    depth + 1,
                );
            }
            _ => {
                return self.unknown(module, name, UnknownTypeReason::UnsupportedQualification);
            }
        };
        self.follow(&import.target, exported, visited, depth + 1)
    }

    fn follow(
        &self,
        target: &TypeModuleReference,
        name: &str,
        visited: &mut FxHashSet<(CompactString, CompactString)>,
        depth: usize,
    ) -> TypeLookup {
        match target.module.as_deref() {
            Some(module) => self.resolve_export(module, name, visited, depth),
            None => self.unknown(&target.specifier, name, UnknownTypeReason::MissingModule),
        }
    }

    fn resolve_export(
        &self,
        module: &str,
        name: &str,
        visited: &mut FxHashSet<(CompactString, CompactString)>,
        depth: usize,
    ) -> TypeLookup {
        if depth >= MAX_RESOLUTION_DEPTH {
            return self.unknown(module, name, UnknownTypeReason::ResolutionLimit);
        }
        let key = (CompactString::new(module), CompactString::new(name));
        if !visited.insert(key.clone()) {
            return self.unknown(module, name, UnknownTypeReason::ResolutionCycle);
        }
        let result = self.resolve_export_inner(module, name, visited, depth);
        visited.remove(&key);
        result
    }

    fn resolve_export_inner(
        &self,
        module: &str,
        name: &str,
        visited: &mut FxHashSet<(CompactString, CompactString)>,
        depth: usize,
    ) -> TypeLookup {
        let Some(scope) = self.modules.get(module) else {
            return self.unknown(module, name, UnknownTypeReason::MissingModule);
        };
        if !scope.complete {
            return self.unknown(module, name, UnknownTypeReason::IncompleteModule);
        }
        if let Some(export) = scope.exports.get(name) {
            return match export {
                TypeExportBinding::Local(local) => {
                    self.resolve_local(module, local, visited, depth + 1)
                }
                TypeExportBinding::Forward { target, exported } => {
                    self.follow(target, exported, visited, depth + 1)
                }
                TypeExportBinding::Namespace(_) => {
                    self.unknown(module, name, UnknownTypeReason::UnsupportedQualification)
                }
            };
        }
        if let Some((namespace, member)) = name.split_once('.')
            && let Some(export) = scope.exports.get(namespace)
        {
            return match export {
                TypeExportBinding::Namespace(target) => {
                    self.follow(target, member, visited, depth + 1)
                }
                TypeExportBinding::Local(local) => {
                    self.resolve_local(module, &cstr!("{local}.{member}"), visited, depth + 1)
                }
                TypeExportBinding::Forward { target, exported } => {
                    self.follow(target, &cstr!("{exported}.{member}"), visited, depth + 1)
                }
            };
        }
        let mut found = None;
        let mut unknown = self.unknown(module, name, UnknownTypeReason::Unbound);
        let mut uncertain = None;
        // Default exports are never forwarded by `export *`.
        if name != "default" {
            for target in &scope.star_exports {
                match self.follow(target, name, visited, depth + 1) {
                    TypeLookup::Found(id) => {
                        if found.as_ref().is_some_and(|previous| previous != &id) {
                            return self.unknown(module, name, UnknownTypeReason::AmbiguousExport);
                        }
                        found = Some(id);
                    }
                    TypeLookup::Unknown(reference) => {
                        if reference.reason != UnknownTypeReason::Unbound {
                            uncertain = Some(TypeLookup::Unknown(reference.clone()));
                        }
                        unknown = TypeLookup::Unknown(reference);
                    }
                }
            }
        }
        uncertain.unwrap_or_else(|| found.map_or(unknown, TypeLookup::Found))
    }
}
