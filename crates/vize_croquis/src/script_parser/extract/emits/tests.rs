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
