//! Preserve CompactString's full inline capacity; share only long owned keys.

use std::{
    borrow::Borrow,
    hash::{Hash, Hasher},
    ops::Deref,
};

use ecow::EcoString;
use vize_carton::CompactString;

#[derive(Debug, Clone)]
pub(super) enum ModuleKey {
    Inline(CompactString),
    Shared(EcoString),
}

impl Default for ModuleKey {
    fn default() -> Self {
        Self::Inline(CompactString::default())
    }
}

impl ModuleKey {
    pub(super) fn as_str(&self) -> &str {
        match self {
            Self::Inline(text) => text.as_str(),
            Self::Shared(text) => text.as_str(),
        }
    }

    pub(super) fn push_str(&mut self, suffix: &str) {
        match self {
            Self::Inline(text) => {
                let capacity = text.len().saturating_add(suffix.len());
                if capacity <= text.capacity() {
                    text.push_str(suffix);
                } else {
                    let mut shared = EcoString::with_capacity(capacity);
                    shared.push_str(text);
                    shared.push_str(suffix);
                    *self = Self::Shared(shared);
                }
            }
            Self::Shared(text) => text.push_str(suffix),
        }
    }

    pub(super) fn push(&mut self, character: char) {
        let mut bytes = [0; 4];
        self.push_str(character.encode_utf8(&mut bytes));
    }
}

impl Deref for ModuleKey {
    type Target = str;

    fn deref(&self) -> &Self::Target {
        self.as_str()
    }
}

impl Borrow<str> for ModuleKey {
    fn borrow(&self) -> &str {
        self.as_str()
    }
}

impl Hash for ModuleKey {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.as_str().hash(state);
    }
}

impl PartialEq for ModuleKey {
    fn eq(&self, other: &Self) -> bool {
        self.as_str() == other.as_str()
    }
}

impl Eq for ModuleKey {}

#[cfg(test)]
mod tests;
