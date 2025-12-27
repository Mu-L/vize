//! Vue Single File Component (.vue) compiler.
//!
//! This module provides parsing and compilation of Vue SFCs, including:
//! - Template block parsing and compilation
//! - Script/script setup processing
//! - Style block processing with scoped CSS support
//! - CSS compilation with LightningCSS

#![allow(clippy::collapsible_match)]
#![allow(clippy::type_complexity)]
#![allow(clippy::redundant_field_names)]
#![allow(clippy::unnecessary_lazy_evaluations)]
#![allow(clippy::field_reassign_with_default)]
#![allow(clippy::only_used_in_recursion)]

pub mod compile;
pub mod css;
pub mod parse;
pub mod script;
pub mod style;
pub mod types;

pub use compile::*;
pub use css::{compile_css, compile_style_block, CssCompileOptions, CssCompileResult, CssTargets};
pub use parse::*;
pub use types::*;

// Re-export key types from dependencies
pub use vue_compiler_core::CompilerError;
pub use vue_compiler_dom::compile_template;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_simple_sfc() {
        let source = r#"
<template>
  <div>Hello World</div>
</template>

<script>
export default {
  name: 'HelloWorld'
}
</script>

<style>
.hello { color: red; }
</style>
"#;
        let descriptor = parse_sfc(source, Default::default()).unwrap();

        assert!(descriptor.template.is_some());
        assert!(descriptor.script.is_some());
        assert_eq!(descriptor.styles.len(), 1);
    }

    #[test]
    fn test_parse_script_setup() {
        let source = r#"
<template>
  <div>{{ msg }}</div>
</template>

<script setup>
import { ref } from 'vue'
const msg = ref('Hello')
</script>
"#;
        let descriptor = parse_sfc(source, Default::default()).unwrap();

        assert!(descriptor.template.is_some());
        assert!(descriptor.script_setup.is_some());
    }

    #[test]
    fn test_parse_scoped_style() {
        let source = r#"
<template>
  <div class="container">Scoped</div>
</template>

<style scoped>
.container { background: blue; }
</style>
"#;
        let descriptor = parse_sfc(source, Default::default()).unwrap();

        assert_eq!(descriptor.styles.len(), 1);
        assert!(descriptor.styles[0].scoped);
    }

    #[test]
    fn test_compile_sfc_with_define_emits() {
        let source = r#"
<template>
  <button @click="onClick">{{ count }}</button>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['update'])
const count = ref(0)
function onClick() {
    emit('update', count.value)
}
</script>
"#;
        let descriptor = parse_sfc(source, Default::default()).unwrap();
        let result = compile_sfc(&descriptor, SfcCompileOptions::default()).unwrap();

        println!("Full SFC output:\n{}", result.code);

        // defineEmits should NOT be in the output
        assert!(
            !result.code.contains("defineEmits"),
            "defineEmits should be removed"
        );
        // emits should be defined at component level
        assert!(
            result.code.contains("emits:"),
            "emits should be at component level"
        );
        // emit should be bound to __emit
        assert!(
            result.code.contains("const emit = __emit"),
            "emit should be bound to __emit"
        );
    }
}
