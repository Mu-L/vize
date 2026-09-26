//! The final SFC route preserves authored nesting and complete diagnostics.

use crate::diagnostic::{HelpLevel, Severity};
use crate::linter::Linter;
use crate::markup::{MarkupContext, MarkupDocument, MarkupRule};
use crate::rule::{Rule, RuleRegistry};
use crate::rules::vue::PermittedContents;
use vize_s0::cstr;
use vize_s0::i18n::Locale;

#[test]
fn authored_nesting_preserves_full_diagnostics_in_every_locale() {
    for locale in [Locale::En, Locale::Ja, Locale::Zh] {
        for help in [HelpLevel::Full, HelpLevel::None] {
            let linter = super::linter()
                .with_locale(locale)
                .with_help_level(help)
                .with_rule_severity_overrides(vec![(
                    "vue/permitted-contents".into(),
                    Severity::Warning,
                )]);
            for source in [
                r#"<span>&#32;{{ text }}日本語😀</span><table>&#32;
<tr><td>row</td></tr></table>"#,
                r##"<a href="#"><span><a href="#">日本語😀</a></span></a>"##,
                r#"<button><span><button>nested</button></span></button>"#,
                r#"<table><template v-if="ok"><tr><td>row</td></tr></template></table>"#,
                r#"<p><template v-for="item in items"><div>{{ item }}</div></template></p>"#,
                r#"<ul><Comp/><template #footer><div/></template><slot/></ul>"#,
                r#"<svg><foreignObject><p><div>block</div></p></foreignObject></svg>"#,
                r#"<!-- eslint-disable-next-line vue/permitted-contents -->
<p><div>suppressed</div></p><span><div>reported</div></span>"#,
            ] {
                let prefix = "<script setup>const note = '日本語😀'</script>\r\n<template>";
                let sfc = cstr!("{prefix}{source}</template>");
                let mut expected = linter.lint_template(source, "test.vue");
                crate::linter::engine::offset_result(&mut expected, prefix.len() as u32);
                let actual = linter.lint_sfc(&sfc, "test.vue");
                assert_eq!(
                    cstr!("{:?}", actual.diagnostics),
                    cstr!("{:?}", expected.diagnostics),
                    "{source}; {locale:?}; {help:?}"
                );
                assert_eq!(actual.error_count, expected.error_count);
                assert_eq!(actual.warning_count, expected.warning_count);
            }
        }
    }
}

struct DocumentOnly;
impl MarkupRule for DocumentOnly {
    fn name(&self) -> &'static str {
        "vue/permitted-contents"
    }
    fn enter_document(&self, ctx: &mut MarkupContext<'_, '_>, document: &MarkupDocument) {
        assert!(document.is_s2());
        PermittedContents.enter_document(ctx, document);
    }
}
impl Rule for DocumentOnly {
    fn meta(&self) -> &'static crate::rule::RuleMeta {
        PermittedContents.meta()
    }
    fn as_markup_rule(&self) -> Option<&dyn MarkupRule> {
        Some(self)
    }
    fn run_on_template<'a>(
        &self,
        _: &mut crate::context::LintContext<'a>,
        _: &vize_relief::RootNode<'a>,
    ) {
        panic!("permitted-contents reached the legacy template hook");
    }
}

#[test]
fn permitted_contents_runs_only_from_the_s2_document_hook() {
    let mut registry = RuleRegistry::new();
    registry.register(Box::new(DocumentOnly));
    let result = Linter::with_registry(registry).lint_sfc(
        "<template><span><div>block</div></span></template>",
        "test.vue",
    );
    assert_eq!(result.diagnostics.len(), 1);
    let [diagnostic] = result.diagnostics.as_slice() else {
        panic!("one diagnostic")
    };
    assert_eq!(diagnostic.rule_name, "vue/permitted-contents");
    assert_eq!((diagnostic.start, diagnostic.end), (16, 20));
    assert_eq!(diagnostic.labels.len(), 1);
}
