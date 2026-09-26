//! Produce the scoped declaration world used by public Alpha summaries.

mod parse;
#[cfg(test)]
mod tests;

use oxc_span::SourceType;
use std::path::{Path, PathBuf};
use vize_carton::{CompactString, FxHashSet, String, cstr};
use vize_croquis::types::ResolvedTypeWorld;
use vize_croquis::types::world::{TypeExportBinding, TypeModule, TypeModuleReference};

use super::ScriptCompileContext;
use super::external_types::resolution::{canonical_base_file, path_key, resolve_import_path};

const MAX_MODULES: usize = 512;

impl ScriptCompileContext {
    /// Retain real module/export identities separately from the compatibility
    /// resolver's flat name maps. The root is the current in-memory script.
    pub fn resolve_type_world(
        &self,
        filename: &str,
        normal_script: Option<&str>,
    ) -> ResolvedTypeWorld {
        self.resolve_type_world_with_syntax(filename, normal_script, filename.ends_with(".tsx"))
    }

    pub fn resolve_type_world_with_syntax(
        &self,
        filename: &str,
        normal_script: Option<&str>,
        is_tsx: bool,
    ) -> ResolvedTypeWorld {
        let path = canonical_base_file(filename);
        let root_module = path_key(&path);
        let source = normal_script.map_or_else(
            || self.source.clone(),
            |normal| cstr!("{normal}\n{}", self.source),
        );
        let mut world = ResolvedTypeWorld {
            root_module: root_module.clone(),
            ..ResolvedTypeWorld::default()
        };
        let mut pending = vec![(path, Some((source, is_tsx)))];
        let mut visited = FxHashSet::default();
        while let Some((path, source)) = pending.pop() {
            let identity = path_key(&path);
            if !visited.insert(identity.clone()) {
                continue;
            }
            if world.modules.len() >= MAX_MODULES {
                world.modules.insert(identity, TypeModule::default());
                continue;
            }
            let source = source.or_else(|| read_module_source(&path));
            let Some((source, is_tsx)) = source else {
                world.modules.insert(identity, TypeModule::default());
                continue;
            };
            let source_type = if is_tsx {
                SourceType::tsx()
            } else {
                SourceType::ts()
            };
            let (mut module, needed_imports) = parse::parse_module(&source, source_type);
            for (local, import) in &mut module.imports {
                resolve_target(
                    &mut import.target,
                    &path,
                    &mut pending,
                    needed_imports.contains(local),
                );
            }
            for export in module.exports.values_mut() {
                match export {
                    TypeExportBinding::Forward { target, .. }
                    | TypeExportBinding::Namespace(target) => {
                        resolve_target(target, &path, &mut pending, true);
                    }
                    TypeExportBinding::Local(local) => {
                        if let Some(import) = module.imports.get(local)
                            && let Some(target) = &import.target.module
                        {
                            pending.push((PathBuf::from(target.as_str()), None));
                        }
                    }
                }
            }
            for target in &mut module.star_exports {
                resolve_target(target, &path, &mut pending, true);
            }
            for target in module.direct_imports.values_mut() {
                resolve_target(target, &path, &mut pending, true);
            }
            world.modules.insert(identity, module);
        }
        world
    }
}

fn resolve_target(
    target: &mut TypeModuleReference,
    current: &Path,
    pending: &mut Vec<(PathBuf, Option<(String, bool)>)>,
    follow: bool,
) {
    if let Some(path) = resolve_import_path(current, &target.specifier) {
        target.module = Some(path_key(&path));
        if follow {
            pending.push((path, None));
        }
    }
}

fn read_module_source(path: &Path) -> Option<(String, bool)> {
    let source = std::fs::read_to_string(path).ok()?;
    if path.extension().is_some_and(|ext| ext == "vue") {
        let descriptor = crate::parse_sfc(&source, crate::SfcParseOptions::default()).ok()?;
        let is_tsx = descriptor
            .script
            .as_ref()
            .is_some_and(|script| script.lang.as_deref() == Some("tsx"))
            || descriptor
                .script_setup
                .as_ref()
                .is_some_and(|script| script.lang.as_deref() == Some("tsx"));
        return Some((
            cstr!(
                "{}\n{}",
                descriptor
                    .script
                    .as_ref()
                    .map_or("", |script| script.content.as_ref()),
                descriptor
                    .script_setup
                    .as_ref()
                    .map_or("", |script| script.content.as_ref()),
            ),
            is_tsx,
        ));
    }
    Some((
        CompactString::new(source),
        path.extension()
            .is_some_and(|ext| ext == "tsx" || ext == "jsx"),
    ))
}
