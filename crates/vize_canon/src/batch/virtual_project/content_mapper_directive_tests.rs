#![expect(clippy::string_slice, reason = "tests assert by panicking")]
use std::path::Path;

use super::generate_vue_content_mapper_transform;
use super::protocol::{DIRECTIVE_POLICY_EXPECT, DIRECTIVE_POLICY_IGNORE};

fn transform(source: &str) -> super::ContentMapperTransform {
    generate_vue_content_mapper_transform(Path::new("/project/App.vue"), source).unwrap()
}

#[test]
fn expect_directive_targets_the_next_template_line() {
    let source = "<script setup lang=\"ts\">\nconst count = 1\n</script>\n<template>\n  <!-- @vue-expect-error -->\n  {{ count.bad }}\n</template>\n";
    let result = transform(source);
    let directives = result.diagnostic_directives.unwrap();

    assert_eq!(
        directives.unused_expect_directive_diagnostics.len(),
        1,
        "{directives:?}"
    );
    assert_eq!(directives.unused_expect_directive_diagnostics[0].code, 4);
    assert_eq!(directives.directives.len(), 1, "{directives:?}");
    let [
        original_start,
        original_len,
        virtual_start,
        virtual_end,
        policy,
        unused_index,
    ] = directives.directives[0].0;
    assert_eq!(policy, DIRECTIVE_POLICY_EXPECT);
    assert_eq!(unused_index, 0);
    assert_eq!(
        &source[original_start..original_start + original_len],
        "@vue-expect-error"
    );
    let suppressed = &result.text.as_str()[virtual_start..virtual_end];
    assert!(suppressed.contains("count"), "{suppressed}");
}

#[test]
fn ignore_directive_suppresses_without_an_unused_report() {
    let source = "<script setup lang=\"ts\">\nconst count = 1\n</script>\n<template>\n  <!-- @vue-ignore -->\n  {{ count.bad }}\n</template>\n";
    let directives = transform(source).diagnostic_directives.unwrap();

    assert!(directives.unused_expect_directive_diagnostics.is_empty());
    assert!(!directives.directives.is_empty());
    for directive in &directives.directives {
        let [_, _, virtual_start, virtual_end, policy, _] = directive.0;
        assert_eq!(policy, DIRECTIVE_POLICY_IGNORE);
        assert!(virtual_start < virtual_end);
    }
}

#[test]
fn ignore_directive_owns_parent_checks_without_hiding_child_checks() {
    let source = "<script setup lang=\"ts\">const child = 1</script>\n<template>\n  <!-- @vue-ignore -->\n  <div :id=\"child.bad\">{{ child.bad }}</div>\n</template>\n";
    let result = transform(source);
    let directives = result.diagnostic_directives.unwrap();
    let parent = source.find("child.bad").unwrap();
    let child = source.find("{{ child.bad }}").unwrap() + 3;
    let parent_positions = mapped_positions(&result.mappings, parent);
    let child_positions = mapped_positions(&result.mappings, child);
    assert!(!parent_positions.is_empty(), "parent check has no mapping");
    assert!(!child_positions.is_empty(), "child check has no mapping");
    assert!(
        parent_positions
            .iter()
            .all(|position| covered(&directives.directives, *position))
    );
    assert!(
        child_positions
            .iter()
            .all(|position| !covered(&directives.directives, *position))
    );
}

#[test]
fn skip_directive_owns_parent_and_child_checks() {
    let source = "<script setup lang=\"ts\">const child = 1</script>\n<template>\n  <!-- @vue-skip -->\n  <div :id=\"child.bad\">{{ child.bad }}</div>\n</template>\n";
    let result = transform(source);
    let directives = result.diagnostic_directives.unwrap();
    let parent = source.find("child.bad").unwrap();
    let child = source.find("{{ child.bad }}").unwrap() + 3;
    let parent_positions = mapped_positions(&result.mappings, parent);
    let child_positions = mapped_positions(&result.mappings, child);
    assert!(!parent_positions.is_empty(), "parent check has no mapping");
    assert!(!child_positions.is_empty(), "child check has no mapping");
    assert!(
        parent_positions
            .iter()
            .all(|position| covered(&directives.directives, *position))
    );
    assert!(
        child_positions
            .iter()
            .all(|position| covered(&directives.directives, *position))
    );
}

fn mapped_positions(spans: &[super::protocol::ContentMapperSpan], original: usize) -> Vec<usize> {
    spans
        .iter()
        .filter_map(
            |super::protocol::ContentMapperSpan(
                [generated, length, start, original_length, _, _],
            )| {
                (*start <= original && original < start + original_length)
                    .then_some(*generated + (*length / 2))
            },
        )
        .collect()
}

fn covered(
    directives: &[super::protocol::ContentMapperDiagnosticDirective],
    position: usize,
) -> bool {
    directives.iter().any(|directive| {
        let [_, _, start, end, _, _] = directive.0;
        start <= position && position < end
    })
}

#[test]
fn expect_directive_covers_content_on_its_own_line() {
    let source = "<script setup lang=\"ts\">\nconst count = 1\n</script>\n<template>\n  <!-- @vue-expect-error -->{{ count.bad }}\n</template>\n";
    let directives = transform(source).diagnostic_directives.unwrap();

    let [_, _, virtual_start, virtual_end, policy, _] = directives.directives[0].0;
    assert_eq!(policy, DIRECTIVE_POLICY_EXPECT);
    assert!(virtual_start < virtual_end);
}

#[test]
fn unmapped_expect_directive_keeps_an_empty_virtual_range() {
    let source = "<template>\n  <div />\n  <!-- @vue-expect-error -->\n</template>\n";
    let directives = transform(source).diagnostic_directives.unwrap();

    let [_, _, virtual_start, virtual_end, policy, _] = directives.directives[0].0;
    assert_eq!(policy, DIRECTIVE_POLICY_EXPECT);
    assert_eq!((virtual_start, virtual_end), (0, 0));
}

#[test]
fn unmapped_ignore_directive_is_dropped() {
    let source = "<template>\n  <div />\n  <!-- @vue-ignore -->\n</template>\n";
    assert!(transform(source).diagnostic_directives.is_none());
}

#[test]
fn templates_without_directives_emit_none() {
    let source = "<script setup lang=\"ts\">\nconst count = 1\n</script>\n<template>\n  <!-- plain comment -->\n  {{ count }}\n</template>\n";
    assert!(transform(source).diagnostic_directives.is_none());
}

#[test]
fn longer_words_do_not_match_directive_tokens() {
    let source = "<template>\n  <!-- @vue-ignores nothing here -->\n  <div />\n</template>\n";
    assert!(transform(source).diagnostic_directives.is_none());
}
