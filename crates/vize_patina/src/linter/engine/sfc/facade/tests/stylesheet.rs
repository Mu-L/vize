//! The SFC stylesheet exception has the same result on both dispatch paths.

use crate::context::LintContext;
use crate::linter::Linter;
use crate::rule::{Rule, RuleMeta, RuleRegistry};
use crate::rules::a11y::NoRedundantRoles;
use vize_relief::ElementNode;

struct Legacy;

impl Rule for Legacy {
    fn meta(&self) -> &'static RuleMeta {
        NoRedundantRoles.meta()
    }

    fn enter_element<'a>(&self, ctx: &mut LintContext<'a>, element: &ElementNode<'a>) {
        Rule::enter_element(&NoRedundantRoles, ctx, element);
    }
}

#[test]
fn markerless_list_styles_preserve_complete_diagnostics() {
    let mut registry = RuleRegistry::new();
    registry.register(Box::new(Legacy));
    let legacy = Linter::with_registry(registry);
    let mut registry = RuleRegistry::new();
    registry.register(Box::new(NoRedundantRoles));
    let facade = Linter::with_registry(registry);
    for source in [
        r#"<template><ul class="plain" role="list"><li>a</li></ul></template><style>.plain { list-style: none }</style>"#,
        r#"<template><ol :class="'plain'" role="list"><li>a</li></ol></template><style scoped>@media screen { .plain { list-style-type: none !important } }</style>"#,
        r#"<template><ul class="plain" role="list"/></template><style>@supports (display: grid) { .plain { list-style: none } }</style>"#,
        r#"<template><ul class="other" role="list"/></template><style>.plain { list-style: none }</style>"#,
        r#"<template><ul class="plain" role="list"/></template><style>.plain { list-style: disc }</style>"#,
        r#"<template><ul class="plain" role="list"/></template><style lang="scss">.plain { list-style: none }</style>"#,
        r#"<template><ul class="plain" role="list"/></template><style src="./plain.css"/>"#,
        r#"<template><ul :[class]="'plain'" role="list"/></template><style>.plain { list-style: none }</style>"#,
        r#"<template><ul class :class="'plain'" role="list"/></template><style>.plain { list-style: none }</style>"#,
    ] {
        let expected = legacy.lint_sfc(source, "List.vue");
        let actual = facade.lint_sfc(source, "List.vue");
        assert_eq!(actual.warning_count, expected.warning_count, "{source}");
        assert_eq!(
            format!("{:?}", actual.diagnostics),
            format!("{:?}", expected.diagnostics),
            "{source}"
        );
    }
}
