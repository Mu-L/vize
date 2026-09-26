//! Authored defaults retained before imported prop declarations are expanded.

use super::{MacroTracker, PropDefinition};
use vize_carton::{CompactString, FxHashMap};

#[derive(Default)]
pub(super) struct WithDefaults {
    expression: Option<CompactString>,
    values: FxHashMap<CompactString, CompactString>,
}

impl MacroTracker {
    /// The exact authored second argument of `withDefaults`, including opaque
    /// expressions for which individual default values cannot be proven.
    pub fn with_defaults_expression(&self) -> Option<&str> {
        self.with_defaults.expression.as_deref()
    }

    pub(crate) fn set_with_defaults(
        &mut self,
        expression: CompactString,
        values: FxHashMap<CompactString, CompactString>,
    ) {
        self.with_defaults = WithDefaults {
            expression: Some(expression),
            values,
        };
        for prop in &mut self.props {
            if let Some(value) = self.with_defaults.values.get(&prop.name) {
                prop.default_value = Some(value.clone());
            }
        }
    }

    pub(super) fn apply_with_default(&self, prop: &mut PropDefinition) {
        if let Some(value) = self.with_defaults.values.get(&prop.name) {
            prop.default_value = Some(value.clone());
        }
    }
}
