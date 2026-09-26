//! Authored runtime validator signatures, separate from inferred payload types.

use super::{EmitCall, EmitDefinition, MacroTracker};
use vize_carton::CompactString;

impl MacroTracker {
    /// Add an emit call (actual emit() invocation in code).
    #[inline]
    pub fn add_emit_call(
        &mut self,
        event_name: CompactString,
        is_dynamic: bool,
        start: u32,
        end: u32,
    ) {
        self.emit_calls.push(EmitCall {
            event_name,
            is_dynamic,
            start,
            end,
        });
    }

    /// Get all emit calls.
    #[inline]
    pub fn emit_calls(&self) -> &[EmitCall] {
        &self.emit_calls
    }

    /// Check if an event is actually emitted (called).
    #[inline]
    pub fn is_event_emitted(&self, event_name: &str) -> bool {
        self.emit_calls
            .iter()
            .any(|call| call.event_name.as_str() == event_name && !call.is_dynamic)
    }

    /// Get emit calls for a specific event.
    pub fn emit_calls_for_event<'a>(
        &'a self,
        event_name: &'a str,
    ) -> impl Iterator<Item = &'a EmitCall> + 'a {
        self.emit_calls
            .iter()
            .filter(move |call| call.event_name.as_str() == event_name)
    }

    /// Add an emit definition.
    #[inline]
    pub fn add_emit(&mut self, emit: EmitDefinition) {
        self.emits.push(emit);
    }

    /// Get all emits, including each authored overload in source order.
    #[inline]
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

    /// Authored cast and `satisfies` constraint types around runtime validators.
    /// A constraint records validation; it does not infer or change a value's type.
    /// Types are retained in outer-to-inner wrapper order, without expression bodies.
    pub fn emit_validator_type_annotations(&self, name: &str) -> &[CompactString] {
        self.emit_validator_type_annotations
            .get(name)
            .map_or(&[], Vec::as_slice)
    }

    pub(crate) fn add_emit_validator_type_annotation(
        &mut self,
        name: &str,
        annotation: CompactString,
    ) {
        self.emit_validator_type_annotations
            .entry(CompactString::new(name))
            .or_default()
            .push(annotation);
    }
}
