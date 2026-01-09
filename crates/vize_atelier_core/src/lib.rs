//! # vize_atelier_core
//!
//! Atelier Core - The core workshop for Vize.
//! Vue template transforms and code generation.
//!
//! ## Name Origin
//!
//! **Atelier** (/ˌætəlˈjeɪ/) is an artist's workshop or studio where creative work
//! is produced. The "core" atelier is the foundational workshop where the essential
//! Vue template processing happens - transforming and code generation.
//! `vize_atelier_core` provides the foundational infrastructure
//! that all other Vize compilers build upon.

pub mod codegen;
pub mod runtime_helpers;
#[macro_use]
pub mod test_macros;
pub mod transform;
pub mod transforms;

// Re-export from vize_relief (AST, errors, options)
pub use vize_relief::*;

// Re-export from vize_armature (parser, tokenizer)
pub use vize_armature as parser;
pub use vize_armature::tokenizer;
pub use vize_armature::{parse, parse_with_options, Parser};

pub use codegen::*;
pub use runtime_helpers::*;
pub use transform::*;
pub use transforms::*;

/// Re-export allocator types for convenience
pub use vize_carton::{Allocator, Box as AllocBox, CloneIn, Vec as AllocVec};
