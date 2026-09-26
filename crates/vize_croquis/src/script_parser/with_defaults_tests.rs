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

#[test]
fn constant_defaults_and_aliases_match_literal_public_values() {
    for value in ["'a b'", "'ab'"] {
        let literal = vize_carton::cstr!(
            "withDefaults(defineProps<{{ label?: string; count?: number }}>(), {{ label: {value}, count: () => 2 }})"
        );
        for declaration in [
            vize_carton::cstr!("const defaults = {{ label: {value}, count: () => 2 }};"),
            vize_carton::cstr!(
                "const base = {{ label: {value}, count: () => 2 }}; const defaults = base;"
            ),
            vize_carton::cstr!(
                "const base = {{ label: {value} }}; const defaults = {{ ...base, count: () => 2 }};"
            ),
        ] {
            let source = vize_carton::cstr!(
                "{declaration} withDefaults(defineProps<{{ label?: string; count?: number }}>(), defaults)"
            );
            assert_eq!(props(&source), props(&literal));
            assert_eq!(
                parse_script_setup(&source)
                    .macros
                    .with_defaults_expression(),
                Some("defaults")
            );
        }
    }
}

#[test]
fn constant_spreads_propagate_unknown_overrides_before_later_known_keys() {
    let source = "const base = { before: 1, ...unknown, after: 2 }; const defaults = { before: 3, ...base, final: 4, final: 5 }; withDefaults(defineProps<{ before?: number; after?: number; final?: number }>(), defaults)";
    assert_eq!(
        props(source),
        vec![
            (CompactString::new("before"), false, None),
            (
                CompactString::new("after"),
                false,
                Some(CompactString::new("2"))
            ),
            (
                CompactString::new("final"),
                false,
                Some(CompactString::new("5"))
            ),
        ]
    );
}

#[test]
fn constant_default_facts_refuse_mutation_escape_and_mutable_bindings() {
    for declarations in [
        "const defaults = { count: 41 }; defaults.count = 42;",
        "const defaults = { count: 41 }; defaults.count++;",
        "const defaults = { count: 41 }; const alias = defaults; alias.count = 42;",
        "const defaults = { count: 41 }; mutate(defaults);",
        "const defaults = { count: 41 }, result = mutate(defaults);",
        "const defaults = { count: 41 }; function mutate() { defaults.count = 42 }; mutate();",
        "let defaults = { count: 41 };",
    ] {
        let source = vize_carton::cstr!(
            "{declarations} withDefaults(defineProps<{{ count?: number }}>(), defaults)"
        );
        assert_eq!(
            props(&source),
            vec![(CompactString::new("count"), false, None)]
        );
        assert_eq!(
            parse_script_setup(&source)
                .macros
                .with_defaults_expression(),
            Some("defaults")
        );
    }
}

#[test]
fn unused_nested_same_named_objects_never_replace_top_level_defaults() {
    let source = "const defaults = { count: 41 }; function privateBody() { const defaults = { count: 99 }; mutate(defaults) }; const privateArrow = () => { const defaults = { count: 98 }; defaults.count++ }; withDefaults(defineProps<{ count: number }>(), defaults)";
    assert!(
        parse_script_setup(source)
            .macros
            .default_object("defaults")
            .is_none()
    );
    assert_eq!(
        props(source),
        vec![(
            CompactString::new("count"),
            true,
            Some(CompactString::new("41"))
        )]
    );
    assert_eq!(
        props(
            "withDefaults(defineProps<{ count?: number }>(), defaults); const defaults = { count: 41 };"
        ),
        vec![(CompactString::new("count"), false, None)]
    );
}
