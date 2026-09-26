use super::parse_script_setup;
use crate::macros::{MacroTracker, PropDefinition};
use vize_carton::CompactString;

fn props(source: &str) -> Vec<(CompactString, bool, Option<CompactString>)> {
    parse_script_setup(source)
        .macros
        .props()
        .iter()
        .map(|prop| (prop.name.clone(), prop.required, prop.default_value.clone()))
        .collect()
}

#[test]
fn expression_and_const_calls_retain_defaults_and_declared_optionality() {
    let expression = "withDefaults(defineProps<{ count: number; label?: string }>(), { count: 41, label: 'ready' })";
    let binding = vize_carton::cstr!("const props = {expression}");
    let expected = vec![
        (
            CompactString::new("count"),
            true,
            Some(CompactString::new("41")),
        ),
        (
            CompactString::new("label"),
            false,
            Some(CompactString::new("'ready'")),
        ),
    ];
    for source in [expression, binding.as_str()] {
        assert_eq!(props(source), expected);
        assert_eq!(
            parse_script_setup(source).macros.with_defaults_expression(),
            Some("{ count: 41, label: 'ready' }")
        );
    }
}

#[test]
fn function_defaults_retain_exact_authored_values() {
    let source = "withDefaults(defineProps<{ items?: string[]; run?: () => number }>(), { items: () => [ 'a',  'b' ], run: function () { return 41 } })";
    assert_eq!(
        props(source),
        vec![
            (
                CompactString::new("items"),
                false,
                Some(CompactString::new("() => [ 'a',  'b' ]"))
            ),
            (
                CompactString::new("run"),
                false,
                Some(CompactString::new("function () { return 41 }"))
            ),
        ]
    );
}

#[test]
fn rightmost_keys_and_unknown_overrides_keep_only_proven_final_values() {
    let source = "withDefaults(defineProps<{ before?: number; after?: number; dynamic?: number; final?: number }>(), { before: 1, after: 2, ...unknown, after: 3, dynamic: 4, [key]: 5, final: 6, final: 7 })";
    assert_eq!(
        props(source),
        vec![
            (CompactString::new("before"), false, None),
            (CompactString::new("after"), false, None),
            (CompactString::new("dynamic"), false, None),
            (
                CompactString::new("final"),
                false,
                Some(CompactString::new("7"))
            ),
        ]
    );
    assert_eq!(
        props(
            "withDefaults(defineProps<{ before?: number; after?: number }>(), { before: 1, ...unknown, after: 2 })"
        ),
        vec![
            (CompactString::new("before"), false, None),
            (
                CompactString::new("after"),
                false,
                Some(CompactString::new("2"))
            ),
        ]
    );
}

#[test]
fn opaque_defaults_remain_authored_without_invented_values() {
    let result = parse_script_setup("withDefaults(defineProps<{ count: number }>(), defaults)");
    assert_eq!(result.macros.with_defaults_expression(), Some("defaults"));
    assert_eq!(
        props("withDefaults(defineProps<{ count: number }>(), defaults)"),
        vec![(CompactString::new("count"), true, None)]
    );
}

#[test]
fn legacy_existing_only_default_marker_does_not_create_pending_values() {
    let mut tracker = MacroTracker::new();
    assert!(!tracker.mark_prop_default_value("count", CompactString::new("41")));
    tracker.add_prop_with_declaration(
        PropDefinition {
            name: CompactString::new("count"),
            prop_type: None,
            required: true,
            default_value: None,
        },
        0,
        5,
    );
    assert_eq!(tracker.props()[0].default_value, None);
    assert!(tracker.mark_prop_default_value("count", CompactString::new("42")));
    assert_eq!(tracker.props()[0].default_value.as_deref(), Some("42"));
    assert!(tracker.props()[0].required);
}
