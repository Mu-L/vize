use serde::{Deserialize, Serialize};

pub(super) const SCHEMA: u32 = 1;
pub(super) const STAGE: &str = "s2-precanonical-static-attributes";

#[derive(Debug, Clone)]
pub(crate) struct Identity {
    pub name: String,
    pub version: String,
    pub fingerprint: String,
    pub cache_inputs: Option<Vec<(String, String)>>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub(super) struct Reply {
    pub schema: u32,
    pub edits: Vec<Edit>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(tag = "kind", deny_unknown_fields)]
pub(super) enum Edit {
    #[serde(rename = "replace-static-attribute")]
    Replace {
        node: u32,
        name: String,
        #[serde(deserialize_with = "required_value")]
        value: Option<String>,
    },
}

fn required_value<'de, D: serde::Deserializer<'de>>(
    input: D,
) -> std::result::Result<Option<String>, D::Error> {
    Option::<String>::deserialize(input)
}

#[derive(Debug, Serialize)]
pub(super) struct Batch<'a> {
    pub schema: u32,
    pub stage: &'static str,
    pub plugin: &'a str,
    pub file: &'a str,
    pub nodes: Vec<Node>,
}

#[derive(Debug, Serialize)]
pub(super) struct Node {
    pub id: u32,
    pub kind: &'static str,
    pub tag: String,
    pub namespace: &'static str,
    pub attrs: Vec<Attribute>,
}

#[derive(Debug, Serialize)]
pub(super) struct Attribute {
    pub name: String,
    pub value: Option<String>,
}

#[derive(Debug, Clone)]
pub(crate) struct Cost {
    pub name: String,
    pub content_key: String,
    pub nodes: u32,
    pub edits: u32,
    pub cached: bool,
    pub elapsed_ns: f64,
    pub js_ns: f64,
}
