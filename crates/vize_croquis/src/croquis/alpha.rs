//! Production interface export from Croquis to the six Davinci α facets.
//!
//! Contracts are compact JSON with fixed field order. Type spellings and
//! defaults are kept verbatim, including whitespace inside literal types.
//! Declaration offsets, private bindings, function bodies, and template
//! expression text never enter these pages.

mod environment;
#[cfg(test)]
mod environment_tests;
mod exports;
mod schema;
#[cfg(test)]
mod tests;
mod type_refs;
mod types;

pub use environment::{TypeDependency, TypeEnvironment};
pub use schema::{ALPHA_CONTRACT_SCHEMA, AlphaSchema};
pub use types::{
    ComponentContract, EmitContract, ExposeContract, PropContract, ReactivityContract,
    SignatureContract, SlotContract,
};

use std::collections::BTreeMap;

use serde::Serialize;
use vize_carton::{CompactString, cstr};
use vize_davinci::summary::{AlphaEntry, AlphaPages, Signature};

use super::{ComponentShape, Croquis};
use crate::BindingType;

impl Croquis {
    /// Version of the structured JSON contracts this producer exports.
    pub const ALPHA_CONTRACT_SCHEMA: u16 = ALPHA_CONTRACT_SCHEMA;

    /// Export this component's declared interface from authoritative facts.
    ///
    /// Unknown types stay null. Options API props known only through binding
    /// metadata have unknown required/default/type facts. Reactivity exports
    /// only explicitly exposed members and model bindings, so changing private
    /// setup state cannot invalidate a consuming component's interface.
    ///
    /// # Errors
    ///
    /// Returns the serializer error if a contract cannot be encoded.
    pub fn alpha_pages(
        &self,
        signature_name: &str,
        generic: Option<&str>,
    ) -> Result<AlphaPages, serde_json::Error> {
        let mut props = BTreeMap::new();
        for prop in self.macros.props() {
            props
                .entry(prop.name.clone())
                .or_insert_with(|| PropContract {
                    schema: AlphaSchema,
                    name: prop.name.clone(),
                    prop_type: prop.prop_type.clone(),
                    required: Some(prop.required),
                    default_value: prop.default_value.clone(),
                    model_modifiers: None,
                    type_dependencies: self.type_environment(prop.prop_type.as_deref(), generic),
                });
        }
        let mut emits = BTreeMap::new();
        for emit in self.macros.emits() {
            emits
                .entry(emit.name.clone())
                .or_insert_with(|| EmitContract {
                    schema: AlphaSchema,
                    name: emit.name.clone(),
                    payload: emit.payload_type.clone(),
                    type_dependencies: self.type_environment(emit.payload_type.as_deref(), generic),
                });
        }
        for model in self.macros.models() {
            props
                .entry(model.name.clone())
                .or_insert_with(|| PropContract {
                    schema: AlphaSchema,
                    name: model.name.clone(),
                    prop_type: model.model_type.clone(),
                    required: Some(model.required),
                    default_value: model.default_value.clone(),
                    model_modifiers: self
                        .macros
                        .model_modifier_type(&model.name)
                        .map(CompactString::new),
                    type_dependencies: self.type_environment(model.model_type.as_deref(), generic),
                });
            let name = cstr!("update:{}", model.name);
            emits.entry(name.clone()).or_insert_with(|| EmitContract {
                schema: AlphaSchema,
                name,
                payload: model.model_type.clone(),
                type_dependencies: self.type_environment(model.model_type.as_deref(), generic),
            });
        }
        for (name, kind) in self.bindings.iter() {
            if kind == BindingType::Props {
                props
                    .entry(CompactString::new(name))
                    .or_insert_with(|| PropContract {
                        schema: AlphaSchema,
                        name: CompactString::new(name),
                        prop_type: None,
                        required: None,
                        default_value: None,
                        model_modifiers: None,
                        type_dependencies: self.type_environment(None, generic),
                    });
            }
        }
        let mut slots = BTreeMap::new();
        for slot in self.macros.slots() {
            slots
                .entry(slot.name.clone())
                .or_insert_with(|| SlotContract {
                    schema: AlphaSchema,
                    name: slot.name.clone(),
                    props: slot.props_type.clone(),
                    type_dependencies: self.type_environment(slot.props_type.as_deref(), generic),
                });
        }
        Ok(AlphaPages {
            signature: Signature {
                name: declaration_key(signature_name),
                params: serialize(&self.signature_contract(signature_name, generic))?,
            },
            props: entries(props)?,
            emits: entries(emits)?,
            slots: entries(slots)?,
            reactivity: self.export_reactivity(generic)?,
            components: self.export_components()?,
        })
    }

    fn signature_contract(&self, name: &str, generic: Option<&str>) -> SignatureContract {
        let exposes: BTreeMap<_, _> = self
            .macros
            .exposes()
            .iter()
            .map(|expose| {
                (
                    expose.name.clone(),
                    ExposeContract {
                        name: expose.name.clone(),
                        expose_type: expose.expose_type.clone(),
                    },
                )
            })
            .collect();
        SignatureContract {
            schema: AlphaSchema,
            name: CompactString::new(name),
            declared_name: self.macros.define_options_name().map(CompactString::new),
            generic: generic.map(CompactString::new),
            component_shape: CompactString::new(match self.component_shape {
                ComponentShape::Unspecified => "unspecified",
                ComponentShape::ClassApi => "class-api",
            }),
            script_setup: self.bindings.is_script_setup,
            prop_type_arguments: self
                .macros
                .define_props()
                .and_then(|call| call.type_args.clone()),
            emit_type_arguments: self
                .macros
                .define_emits()
                .and_then(|call| call.type_args.clone()),
            slot_type_arguments: self
                .macros
                .define_slots()
                .and_then(|call| call.type_args.clone()),
            exposes_complete: self.macros.expose_is_complete(),
            exposes: exposes.into_values().collect(),
            type_dependencies: self.signature_type_environment(generic),
        }
    }
}

/// An injective folio-safe key; contracts retain the original name.
///
/// Ordinary names are unchanged. Empty names, whitespace, `=`, and the
/// reserved `%` prefix are encoded as `%` followed by hexadecimal UTF-8.
#[must_use]
pub fn declaration_key(name: &str) -> CompactString {
    if !name.is_empty()
        && !name.starts_with('%')
        && !name.chars().any(|ch| ch.is_whitespace() || ch == '=')
    {
        return CompactString::new(name);
    }
    let mut encoded = CompactString::new("%");
    for byte in name.bytes() {
        for nibble in [byte >> 4, byte & 15] {
            encoded.push(char::from(if nibble < 10 {
                b'0' + nibble
            } else {
                b'A' + nibble - 10
            }));
        }
    }
    encoded
}

fn serialize(value: &impl Serialize) -> Result<CompactString, serde_json::Error> {
    serde_json::to_string(value).map(CompactString::from)
}

fn entries<T: Serialize>(
    contracts: BTreeMap<CompactString, T>,
) -> Result<Vec<AlphaEntry>, serde_json::Error> {
    contracts
        .into_iter()
        .map(|(name, contract)| {
            Ok(AlphaEntry {
                name: declaration_key(&name),
                contract: serialize(&contract)?,
            })
        })
        .collect()
}
