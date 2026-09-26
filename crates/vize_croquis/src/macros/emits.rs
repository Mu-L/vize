//! Authored runtime validator signatures, separate from inferred payload types.

use super::{EmitDefinition, MacroTracker};
use vize_carton::CompactString;

impl MacroTracker {
    /// Add an emit definition.
    pub fn add_emit(&mut self, emit: EmitDefinition) {
        self.emits.push(emit);
    }

    /// Get all emits, including each authored overload in source order.
    pub fn emits(&self) -> &[EmitDefinition] {
        &self.emits
    }

    /// Type-only headers of runtime validators for this declared event.
    /// Missing annotations stay absent; these headers do not infer a type.
    /// Default initializer expressions and validator bodies are excluded.
    pub fn emit_validator_signatures(&self, name: &str) -> &[CompactString] {
        self.emit_validator_signatures
            .get(name)
            .map_or(&[], Vec::as_slice)
    }

    pub(crate) fn add_emit_validator_signature(&mut self, name: &str, signature: CompactString) {
        self.emit_validator_signatures
            .entry(CompactString::new(name))
            .or_default()
            .push(signature);
    }
}
