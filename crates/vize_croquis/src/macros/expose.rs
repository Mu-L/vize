//! The authored public-instance surface of `defineExpose`.

use super::MacroTracker;
use vize_carton::CompactString;

/// Expose definition from defineExpose.
#[derive(Debug, Clone)]
pub struct ExposeDefinition {
    /// Exposed property name.
    pub name: CompactString,
    /// Authored type or fully annotated function signature, when known.
    pub expose_type: Option<CompactString>,
}

/// A public property and the setup binding its value directly references.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ExposeBinding {
    /// Public-instance property name, which may differ from the binding.
    pub name: CompactString,
    /// Resolved setup binding. Expressions and unresolved identifiers stay None.
    pub local_name: Option<CompactString>,
    /// Exact declaration identifier range in script coordinates.
    pub declaration_span: Option<(u32, u32)>,
}

impl MacroTracker {
    /// Add an expose definition without claiming its binding identity.
    pub fn add_expose(&mut self, expose: ExposeDefinition) {
        self.exposes.push(expose);
    }

    /// Known public-instance properties in authored order.
    pub fn exposes(&self) -> &[ExposeDefinition] {
        &self.exposes
    }

    /// Resolved aliases for properties produced from the object AST.
    pub fn expose_bindings(&self) -> &[ExposeBinding] {
        &self.expose_bindings
    }

    /// Whether every public property name was resolved. None types remain unknown.
    pub fn expose_is_complete(&self) -> bool {
        !self.expose_incomplete
    }

    pub(crate) fn add_expose_binding(&mut self, expose: ExposeDefinition, binding: ExposeBinding) {
        self.add_expose(expose);
        self.expose_bindings.push(binding);
    }

    pub(crate) fn mark_expose_incomplete(&mut self) {
        self.expose_incomplete = true;
    }
}
