//! Execute complete emitted modules under the official pinned Vue runtime.
#![expect(
    clippy::expect_used,
    clippy::disallowed_methods,
    clippy::disallowed_types,
    reason = "integration fixtures use process/JSON strings and assert compiler output"
)]

#[path = "authored_modules/scope.rs"]
mod scope;

use oxc_sourcemap::SourceMap;
use std::{
    io::Write,
    path::Path,
    process::{Command, Stdio},
};
use vize_atelier_jsx::{JsxCompileConfig, JsxLang, compile_jsx};
use vize_s0::Allocator;

fn compile(source: &str) -> vize_s0::String {
    let arena = Allocator::new();
    let out = compile_jsx(&arena, source, JsxLang::Tsx, &JsxCompileConfig::default());
    assert!(!out.has_errors(), "{:?}", out.diagnostics);
    let module = out.module_code();
    let parsed = vize_atelier_jsx::parse_module(arena.as_oxc(), &module, JsxLang::Tsx);
    assert!(
        !parsed.has_errors(),
        "emitted module: {module}\n{:?}",
        parsed.diagnostics
    );
    module
}

#[test]
fn complete_tsx_modules_execute_with_imports_defaults_and_mixed_roots() {
    let cases = [
        (
            "expression",
            r#"
            import Child from "./Child";
            export const suffix = "!";
            export function Card(props: { label: string }) {
                const label = props.label + suffix;
                return <Child label={label + arguments[0].label.slice(0, 0)}/>;
            }
            export default <T extends string,>(props: { label: T }) => <Card label={props.label}/>;
        "#,
        ),
        (
            "mixed",
            r#"
            import { ref } from "vue";
            export const Stateful = () => {
                const count = ref(0);
                const increment = () => count.value++;
                return <button onClick={increment}>{count.value}</button>;
            };
            export const Pure = (props: {label:string}) => <i>{props.label}</i>;
            export default Stateful;
        "#,
        ),
        (
            "default",
            r#"
            export const App = ({ slot = <i data-kind="fallback"/> }: {slot?: any}) => {
                const kind = slot.type;
                return <div>{kind}</div>;
            };
            export default App;
        "#,
        ),
        (
            "typed",
            r#"
            export default function marker() { return "retained"; }
            export const Typed = (props: { label: string; amount?: number }) => {
                function readLabel(this: { prefix: string }, label: string) {
                    return this.prefix + arguments[0];
                }
                const read = () => readLabel.call({ prefix: "" }, props.label);
                return <p>{read()}</p>;
            }; export const afterTyped = "retained-after-setup";
        "#,
        ),
        (
            "options",
            r#"
            export const widgets = { marker: "kept", render: () => { return <i>helper</i>; } };
            export default {
                data() { return { label: "lexical" }; },
                render() { return <p>{this.label}:{arguments[0].label}</p>; }
            };
        "#,
        ),
        (
            "factory",
            r#"
            export const make = function (label: string) {
                return () => { return <p>{label}</p>; };
            };
            export default make("retained-factory");
        "#,
        ),
    ];
    let modules: serde_json::Map<_, _> = cases
        .into_iter()
        .map(|(name, source)| {
            (
                name.to_owned(),
                serde_json::Value::String(compile(source).to_string()),
            )
        })
        .collect();
    let root = Path::new(env!("CARGO_MANIFEST_DIR")).join("../..");
    let mut child = Command::new("node")
        .arg(root.join("tests/tooling/support/tsx-authored-module-runtime.mjs"))
        .current_dir(&root)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .expect("Node and installed runtime dependencies are required");
    child
        .stdin
        .take()
        .expect("stdin")
        .write_all(&serde_json::to_vec(&modules).expect("payload"))
        .expect("write payload");
    let output = child.wait_with_output().expect("runtime process");
    assert!(
        output.status.success(),
        "{}\n{}",
        std::string::String::from_utf8_lossy(&output.stdout),
        std::string::String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(
        std::string::String::from_utf8_lossy(&output.stdout).trim(),
        "6 mounted TSX module scenarios passed"
    );
}

#[test]
fn composed_module_maps_keep_full_unicode_source_and_authored_coordinates() {
    let source = "// 😀 日本語\r\nexport const marker = '保全';\r\nexport default (props: {label:string}) => <p title=\"😀\">{props.label}</p>;\r\nexport const Other = () => <i>{marker}</i>;\r\n";
    let arena = Allocator::new();
    let mut config = JsxCompileConfig::default();
    config.vdom.source_map = true;
    let out = compile_jsx(&arena, source, JsxLang::Tsx, &config);
    assert!(!out.has_errors(), "{:?}", out.diagnostics);
    let module = out.module_code();
    let map = SourceMap::from_json_string(out.source_map().expect("complete module map"))
        .expect("valid map");
    assert_eq!(
        map.get_source_contents().collect::<Vec<_>>(),
        [Some(source)]
    );
    let retained = module.find("export const marker").expect("retained export");
    let (line, col) = position(&module, retained);
    assert!(
        map.get_source_view_tokens()
            .any(|token| token.get_dst_line() == line
                && token.get_dst_col() == col
                && token.get_src_line() == 1
                && token.get_src_col() == 0)
    );
    let expression = source.lines().nth(2).expect("line");
    let original_column = expression
        .get(..expression.find("props.label").expect("authored expression"))
        .expect("boundary")
        .encode_utf16()
        .count() as u32;
    let (generated_line, generated_column) = position(
        &module,
        module.find("props.label").expect("generated expression"),
    );
    assert!(map.get_source_view_tokens().any(|token| {
        token.get_dst_line() == generated_line
            && token.get_dst_col() == generated_column
            && token.get_src_line() == 2
            && token.get_src_col() == original_column
    }));
    assert!(
        map.get_source_view_tokens()
            .all(|token| token.get_src_line() < 5)
    );
}

fn position(source: &str, offset: usize) -> (u32, u32) {
    let prefix = source.get(..offset).expect("boundary");
    let line = prefix.bytes().filter(|&b| b == b'\n').count() as u32;
    let column = prefix
        .rsplit('\n')
        .next()
        .expect("last line")
        .encode_utf16()
        .count() as u32;
    (line, column)
}
