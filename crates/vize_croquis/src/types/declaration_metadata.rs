//! AST-recorded metadata in the existing definitions store.
//!
//! Reserved keys keep the constructible public `TypeDefinitions` layout
//! compatible, as the existing interface heritage representation does.

use super::TypeDefinitions;
use vize_carton::{CompactString, cstr};

const PARAMETERS: &str = "\0vize:type_parameters:";
const IMPORT_EXPORT: &str = "\0vize:imported_type_export:";

impl TypeDefinitions {
    /// Store the exact authored `<...>` parameter declaration, without a body.
    pub fn set_type_parameters(&mut self, name: &str, parameters: Option<&str>) {
        let key = cstr!("{PARAMETERS}{name}");
        if let Some(parameters) = parameters {
            self.type_aliases
                .insert(key, CompactString::new(parameters));
        } else {
            self.type_aliases.remove(key.as_str());
        }
    }

    /// Authored generic parameters for one local alias or interface.
    pub fn type_parameters(&self, name: &str) -> Option<&str> {
        self.type_aliases
            .get(cstr!("{PARAMETERS}{name}").as_str())
            .map(CompactString::as_str)
    }

    /// Record an import's local alias and the module's actual exported name.
    /// Namespace imports use `*`; default imports use `default`.
    pub fn add_imported_identity(&mut self, local: &str, source: &str, exported: &str) {
        self.add_imported_type(local, source);
        self.type_aliases.insert(
            cstr!("{IMPORT_EXPORT}{local}"),
            CompactString::new(exported),
        );
    }

    /// The exported type name, independently of its local import alias.
    pub fn imported_type_export(&self, local: &str) -> Option<&str> {
        self.type_aliases
            .get(cstr!("{IMPORT_EXPORT}{local}").as_str())
            .map(CompactString::as_str)
    }
}
