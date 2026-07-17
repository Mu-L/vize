use std::path::{Path, PathBuf};

use serde_json::Value;
use vize_carton::{CompactString, cstr};

use super::comparable_path;

const PACKAGE_EXTENSIONS: &[&str] = &[
    "d.ts", "d.mts", "d.cts", "ts", "tsx", "mts", "cts", "js", "jsx", "mjs", "cjs",
];

pub(super) fn resolve_package_import(importer_dir: &Path, specifier: &str) -> Option<PathBuf> {
    let (package, subpath) = split_package_specifier(specifier)?;
    let package_root = importer_dir
        .ancestors()
        .map(|directory| directory.join("node_modules").join(package))
        .find(|candidate| candidate.is_dir())?;
    let manifest = std::fs::read_to_string(package_root.join("package.json"))
        .ok()
        .and_then(|content| serde_json::from_str::<Value>(&content).ok());
    let has_exports = manifest
        .as_ref()
        .is_some_and(|manifest| manifest.get("exports").is_some());

    if let Some(target) = manifest
        .as_ref()
        .and_then(|manifest| package_export_target(manifest, subpath))
        .and_then(|target| resolve_package_target(&package_root, target.as_str()))
    {
        return Some(comparable_path(&target));
    }

    if has_exports {
        return None;
    }

    if let Some(subpath) = subpath {
        return resolve_package_candidate(package_root.join(subpath))
            .map(|path| comparable_path(&path));
    }

    manifest
        .as_ref()
        .and_then(|manifest| {
            ["types", "typings", "module", "main"]
                .iter()
                .find_map(|key| manifest.get(key).and_then(Value::as_str))
        })
        .and_then(|target| resolve_package_target(&package_root, target))
        .or_else(|| resolve_package_candidate(package_root.join("index")))
        .map(|path| comparable_path(&path))
}

fn split_package_specifier(specifier: &str) -> Option<(&str, Option<&str>)> {
    let mut parts = specifier.split('/');
    let first = parts.next()?;
    if first.is_empty() {
        return None;
    }

    if first.starts_with('@') {
        if first.len() == 1 {
            return None;
        }
        let name = parts.next()?;
        if name.is_empty() {
            return None;
        }
        let package_len = first.len() + 1 + name.len();
        let subpath = specifier
            .get(package_len + 1..)
            .filter(|value| !value.is_empty());
        return Some((&specifier[..package_len], subpath));
    }

    let subpath = specifier
        .get(first.len() + 1..)
        .filter(|value| !value.is_empty());
    Some((first, subpath))
}

fn package_export_target(manifest: &Value, subpath: Option<&str>) -> Option<CompactString> {
    let exports = manifest.get("exports")?;
    let key = subpath.map_or_else(|| cstr!("."), |subpath| cstr!("./{subpath}"));
    match exports.get(key.as_str()) {
        Some(entry) => return conditional_export_target(entry).map(CompactString::from),
        None if subpath.is_none()
            && exports.as_object().is_none_or(|conditions| {
                conditions
                    .keys()
                    .all(|condition| !condition.starts_with('.'))
            }) =>
        {
            return conditional_export_target(exports).map(CompactString::from);
        }
        None => {}
    }

    exports
        .as_object()?
        .iter()
        .filter_map(|(pattern, entry)| {
            let capture = export_pattern_capture(pattern, key.as_str())?;
            let prefix_len = pattern.find('*')?;
            Some((prefix_len, pattern.len(), entry, capture))
        })
        .max_by_key(|(prefix_len, pattern_len, _, _)| (*prefix_len, *pattern_len))
        .and_then(|(_, _, entry, capture)| {
            conditional_export_target(entry)
                .map(|target| CompactString::from(target.replace('*', capture)))
        })
}

fn export_pattern_capture<'a>(pattern: &str, requested: &'a str) -> Option<&'a str> {
    let (prefix, suffix) = pattern.split_once('*')?;
    if !pattern.starts_with("./")
        || suffix.contains('*')
        || requested.len() < prefix.len() + suffix.len()
        || !requested.starts_with(prefix)
        || !requested.ends_with(suffix)
    {
        return None;
    }
    requested.get(prefix.len()..requested.len() - suffix.len())
}

fn conditional_export_target(value: &Value) -> Option<&str> {
    match value {
        Value::String(target) => Some(target),
        Value::Array(targets) => targets.iter().find_map(conditional_export_target),
        Value::Object(conditions) => ["types", "import", "require", "default"]
            .iter()
            .find_map(|condition| {
                conditions
                    .get(*condition)
                    .and_then(conditional_export_target)
            })
            .or_else(|| conditions.values().find_map(conditional_export_target)),
        _ => None,
    }
}

fn resolve_package_target(package_root: &Path, target: &str) -> Option<PathBuf> {
    let target = target.strip_prefix("./").unwrap_or(target);
    resolve_package_candidate(package_root.join(target))
}

fn resolve_package_candidate(base: PathBuf) -> Option<PathBuf> {
    if let Some(sidecar) = declaration_sidecar(&base) {
        return Some(sidecar);
    }
    if base.is_file() {
        return Some(base);
    }
    if base.extension().is_none() {
        for extension in PACKAGE_EXTENSIONS {
            let candidate = base.with_extension(extension);
            if candidate.is_file() {
                return Some(candidate);
            }
        }
        for extension in PACKAGE_EXTENSIONS {
            let candidate = base.join("index").with_extension(extension);
            if candidate.is_file() {
                return Some(candidate);
            }
        }
    }
    None
}

fn declaration_sidecar(base: &Path) -> Option<PathBuf> {
    let extensions: &[&str] = match base.extension().and_then(|extension| extension.to_str()) {
        Some("mjs") => &["d.mts", "d.ts"],
        Some("cjs") => &["d.cts", "d.ts"],
        Some("js" | "jsx") => &["d.ts"],
        _ => &[],
    };
    extensions
        .iter()
        .map(|extension| base.with_extension(extension))
        .find(|candidate| candidate.is_file())
}

#[cfg(test)]
mod tests {
    use super::{package_export_target, resolve_package_import, split_package_specifier};

    #[test]
    fn package_specifiers_preserve_scopes_and_subpaths() {
        assert_eq!(split_package_specifier("vue"), Some(("vue", None)));
        assert_eq!(
            split_package_specifier("vue-router/auto-routes"),
            Some(("vue-router", Some("auto-routes")))
        );
        assert_eq!(
            split_package_specifier("@vue/language-core/lib/types"),
            Some(("@vue/language-core", Some("lib/types")))
        );
        assert_eq!(
            split_package_specifier("@vue/language-core"),
            Some(("@vue/language-core", None))
        );
        assert_eq!(split_package_specifier(""), None);
        assert_eq!(split_package_specifier("@vue"), None);
        assert_eq!(split_package_specifier("@/invalid"), None);
    }

    #[test]
    fn package_exports_select_types_without_guessing_a_root_subpath() {
        let manifest = serde_json::json!({
            "exports": {
                ".": {
                    "types": "./dist/index.d.mts",
                    "import": "./dist/index.mjs"
                },
                "./auto-routes": [
                    null,
                    { "types": "./routes.d.cts", "default": "./routes.cjs" }
                ]
            }
        });
        assert_eq!(
            package_export_target(&manifest, None).as_deref(),
            Some("./dist/index.d.mts")
        );
        assert_eq!(
            package_export_target(&manifest, Some("auto-routes")).as_deref(),
            Some("./routes.d.cts")
        );
        assert_eq!(package_export_target(&manifest, Some("missing")), None);

        let conditional_root = serde_json::json!({
            "exports": {
                "types": "./index.d.ts",
                "default": "./index.js"
            }
        });
        assert_eq!(
            package_export_target(&conditional_root, None).as_deref(),
            Some("./index.d.ts")
        );

        let subpaths_only = serde_json::json!({
            "exports": { "./feature": { "types": "./feature.d.ts" } }
        });
        assert_eq!(package_export_target(&subpaths_only, None), None);
    }

    #[test]
    fn package_exports_are_authoritative_and_support_nested_wildcards() {
        let dir = tempfile::tempdir().unwrap();
        let package = dir.path().join("node_modules/@scope/router");
        let nested_declaration = package.join("types/features/admin.d.mts");
        std::fs::create_dir_all(nested_declaration.parent().unwrap()).unwrap();
        std::fs::write(&nested_declaration, "export declare const route: unknown").unwrap();
        std::fs::write(
            package.join("private.d.ts"),
            "export declare const secret: unknown",
        )
        .unwrap();
        std::fs::write(
            package.join("package.json"),
            r#"{
  "types": "./private.d.ts",
  "exports": {
    "./features/*": { "types": "./types/features/*.d.mts" },
    "./*": { "types": "./types/*.d.ts" }
  }
}"#,
        )
        .unwrap();

        assert_eq!(
            resolve_package_import(dir.path(), "@scope/router/features/admin"),
            Some(std::fs::canonicalize(&nested_declaration).unwrap())
        );
        assert_eq!(
            resolve_package_import(dir.path(), "@scope/router/private"),
            None
        );
        assert_eq!(resolve_package_import(dir.path(), "@scope/router"), None);
    }

    #[test]
    fn package_runtime_exports_prefer_declaration_sidecars() {
        let dir = tempfile::tempdir().unwrap();
        let package = dir.path().join("node_modules/runtime-package");
        let runtime = package.join("dist/index.mjs");
        let declaration = package.join("dist/index.d.mts");
        std::fs::create_dir_all(runtime.parent().unwrap()).unwrap();
        std::fs::write(&runtime, "export const value = 1").unwrap();
        std::fs::write(&declaration, "export declare const value: number").unwrap();
        std::fs::write(
            package.join("package.json"),
            r#"{ "exports": { ".": { "import": "./dist/index.mjs" } } }"#,
        )
        .unwrap();

        assert_eq!(
            resolve_package_import(dir.path(), "runtime-package"),
            Some(std::fs::canonicalize(&declaration).unwrap())
        );
    }
}
