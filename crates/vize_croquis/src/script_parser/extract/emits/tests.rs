use crate::script_parser::parse_script_setup;

fn payload(source: &str, name: &str) -> Option<vize_carton::CompactString> {
    parse_script_setup(source)
        .macros
        .emits()
        .iter()
        .find(|event| event.name == name)
        .expect("declared event")
        .payload_type
        .clone()
}

#[test]
fn typed_tuple_payload_tracks_edits_and_preserves_authored_literals() {
    let source = "defineEmits<{ select: [value: number]; 'quoted': [label: 'a  b', count?: number, ...rest: string[]]; closed: []; alias: Payload }>();";
    assert_eq!(
        payload(source, "select").as_deref(),
        Some("[value: number]")
    );
    assert_eq!(
        payload(&source.replace("value: number", "value: string"), "select").as_deref(),
        Some("[value: string]")
    );
    assert_eq!(
        payload(source, "quoted").as_deref(),
        Some("[label: 'a  b', count?: number, ...rest: string[]]")
    );
    assert_eq!(payload(source, "closed").as_deref(), Some("[]"));
    assert_eq!(payload(source, "alias").as_deref(), Some("Payload"));
    let result = parse_script_setup(source);
    let (start, end) = result.macros.emit_declaration("select").unwrap();
    assert_eq!(source.get(start as usize..end as usize), Some("select"));
}

#[test]
fn typed_call_and_method_payloads_preserve_optional_rest_and_unicode() {
    let source = "defineEmits<{ (event: 'save', 雪: 'a  b', count?: number, ...rest: boolean[]): void; (event: 'close'): void; update(value: string, ...rest: number[]): void; ['static'](value: number): void }>();";
    assert_eq!(
        payload(source, "save").as_deref(),
        Some("[雪: 'a  b', count?: number, ...rest: boolean[]]")
    );
    assert_eq!(payload(source, "close").as_deref(), Some("[]"));
    assert_eq!(
        payload(source, "update").as_deref(),
        Some("[value: string, ...rest: number[]]")
    );
    assert_eq!(
        payload(source, "static").as_deref(),
        Some("[value: number]")
    );
}

#[test]
fn generic_and_untyped_payloads_stay_unknown() {
    let source = "defineEmits<{ <T>(event: 'generic', value: T): void; method<T>(value: T): void; (event: 'untyped', value): void; missing; [dynamic]: [value: number] }>();";
    for event in ["generic", "method", "untyped", "missing"] {
        assert_eq!(payload(source, event), None, "{event}");
    }
    assert!(
        !parse_script_setup(source)
            .macros
            .emits()
            .iter()
            .any(|event| event.name == "dynamic")
    );
}

#[test]
fn overloads_keep_each_authored_payload_in_source_order() {
    let source = "defineEmits<{ (event: 'save', value: string): void; (event: 'save', value: number): void; <T>(event: 'save', value: T): void }>();";
    let result = parse_script_setup(source);
    let payloads = result
        .macros
        .emits()
        .iter()
        .filter(|event| event.name == "save")
        .map(|event| event.payload_type.as_deref())
        .collect::<Vec<_>>();
    assert_eq!(
        payloads,
        [Some("[value: string]"), Some("[value: number]"), None]
    );
}

#[test]
fn runtime_payloads_omit_bodies_defaults_and_generic_binders() {
    let source = "defineEmits({ save: (value: 'a  b', count: number = 1) => true, generic: <T>(value: T) => true });";
    assert_eq!(
        payload(source, "save").as_deref(),
        Some("[value: 'a  b', count?: number]")
    );
    assert_eq!(
        payload(source, "save"),
        payload(
            &source.replace("=> true", "=> false").replace("= 1", "= 2"),
            "save"
        )
    );
    assert_eq!(payload(source, "generic"), None);
}

#[test]
fn runtime_validator_headers_track_type_edits_and_exclude_implementation() {
    let source = "defineEmits({ save: <T extends 'a  b'>(value: T, count: number = 1): boolean => { return true }, untyped: (value) => true, destructured: function(this: Context, { value = privateCall() }: Payload, ...rest: string[]): boolean { return true } });";
    let signatures = |source: &str, event: &str| {
        parse_script_setup(source)
            .macros
            .emit_validator_signatures(event)
            .to_vec()
    };
    assert_eq!(
        signatures(source, "save"),
        ["<T extends 'a  b'>(value: T, count?: number): boolean"]
    );
    assert_eq!(signatures(source, "untyped"), ["(value)"]);
    assert_eq!(
        signatures(source, "destructured"),
        ["(this: Context, __destructured: Payload, ...rest: string[]): boolean"]
    );
    let implementation = source
        .replace("return true", "return false")
        .replace("= 1", "= 2")
        .replace("privateCall()", "anotherPrivateCall()");
    for event in ["save", "untyped", "destructured"] {
        assert_eq!(
            signatures(source, event),
            signatures(&implementation, event)
        );
    }
    assert_ne!(
        signatures(source, "save"),
        signatures(&source.replace("value: T", "value: string"), "save")
    );
    assert_ne!(
        signatures(source, "untyped"),
        signatures(&source.replace("(value)", "(value: string)"), "untyped")
    );
}

#[test]
fn spread_validator_headers_follow_only_the_exposed_runtime_literal() {
    let source = "const unused = { save: <T>(value: T) => false }; const events = { save: <T>(value: T): boolean => true }; const copied = { ...events }; defineEmits({ ...copied });";
    let signatures = |source: &str| {
        parse_script_setup(source)
            .macros
            .emit_validator_signatures("save")
            .to_vec()
    };
    assert_eq!(signatures(source), ["<T>(value: T): boolean"]);
    assert_eq!(
        signatures(source),
        signatures(&source.replace(
            "<T>(value: T) => false",
            "<T>(value: string) => { return false }"
        ))
    );
    assert_ne!(
        signatures(source),
        signatures(&source.replace("value: T): boolean", "value: string): boolean"))
    );
}

#[test]
fn validator_cast_and_constraint_types_track_edits_without_bodies() {
    let source = "const unused = { save: ((value) => false) as (value: boolean) => boolean }; const validators = { save: ((value) => true) as (value: 'a  b') => boolean, angle: <(value: number) => boolean>((value) => true), constrained: ((value: string) => true) satisfies (value: string) => boolean }; defineEmits({ ...validators });";
    let annotations = |source: &str, event: &str| {
        parse_script_setup(source)
            .macros
            .emit_validator_type_annotations(event)
            .to_vec()
    };
    assert_eq!(annotations(source, "save"), ["(value: 'a  b') => boolean"]);
    assert_eq!(annotations(source, "angle"), ["(value: number) => boolean"]);
    assert_eq!(
        annotations(source, "constrained"),
        ["(value: string) => boolean"]
    );
    assert_eq!(payload(source, "save"), None);
    assert_eq!(payload(source, "angle"), None);
    assert_eq!(
        payload(source, "constrained").as_deref(),
        Some("[value: string]")
    );
    let implementation = source
        .replace("=> true", "=> { return false }")
        .replace("value: boolean", "value: Date");
    for event in ["save", "angle", "constrained"] {
        assert_eq!(
            annotations(source, event),
            annotations(&implementation, event)
        );
    }
    assert_ne!(
        annotations(source, "save"),
        annotations(&source.replace("'a  b'", "number"), "save")
    );
    assert_ne!(
        annotations(source, "constrained"),
        annotations(
            &source.replace("satisfies (value: string)", "satisfies (value: number)"),
            "constrained"
        )
    );
}
