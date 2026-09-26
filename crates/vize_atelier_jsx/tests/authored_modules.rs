//! Execute complete emitted modules under the official pinned Vue runtime.
#![expect(
    clippy::expect_used,
    clippy::disallowed_methods,
    clippy::disallowed_types,
    reason = "integration fixtures use process/JSON strings and assert compiler output"
)]

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
                return <Child label={label}/>;
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
                const read = () => props.label;
                return <p>{read()}</p>;
            };
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
        "4 mounted TSX module scenarios passed"
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

#[test]
fn lexical_component_bindings_respect_shadowing_and_leave_unbound_globals() {
    let module = compile(
        "import Child from './Child'; export const App = (Child: any) => <Child/>; export const Global = () => <Unknown/>;",
    );
    assert!(
        module.contains("_resolveDynamicComponent(Child)"),
        "{module}"
    );
    assert!(
        module.contains("_resolveComponent(\"Unknown\")"),
        "{module}"
    );
    assert!(!module.contains("_resolveComponent(\"Child\")"), "{module}");
}

#[test]
fn authored_runtime_helper_bindings_are_diagnosed_without_emitting_broken_modules() {
    for source in [
        "const _openBlock = 1; export const App = () => <p/>;",
        "export default (_openBlock: number) => <p/>;",
    ] {
        let arena = Allocator::new();
        let out = compile_jsx(&arena, source, JsxLang::Tsx, &JsxCompileConfig::default());
        assert!(out.has_errors(), "{source}");
        let diagnostic = out
            .diagnostics
            .iter()
            .find(|d| d.message.contains("shadows a generated runtime helper"))
            .expect("helper collision");
        assert_eq!(
            source.get(diagnostic.start as usize..diagnostic.end as usize),
            Some("_openBlock")
        );
        assert!(out.module_code().is_empty());
    }
    let module = compile(
        "// _openBlock\nconst metadata = { _openBlock: 'safe' }; export default () => <p>{metadata._openBlock}</p>;",
    );
    assert!(module.contains("const metadata = { _openBlock: 'safe' }"));
}

#[test]
fn standalone_vapor_and_ssr_reject_authored_bindings_and_exports_they_would_drop() {
    for source in [
        "import { ref } from 'vue'; const App = () => <p/>;",
        "export default () => <p/>;",
        "const App = (props: {label:string}) => <p>{props.label}</p>;",
        "const App = () => { const label = 'value'; return <p>{label}</p>; };",
    ] {
        for ssr in [false, true] {
            let arena = Allocator::new();
            let config = JsxCompileConfig {
                ssr,
                default_mode: vize_atelier_jsx::JsxOutputMode::Vapor,
                ..Default::default()
            };
            let out = compile_jsx(&arena, source, JsxLang::Tsx, &config);
            assert!(out.has_errors(), "{source} (ssr={ssr})");
            assert!(
                out.diagnostics
                    .iter()
                    .any(|d| d.message.contains("authored module preservation")),
                "{:?}",
                out.diagnostics
            );
            assert!(out.module_code().is_empty());
            assert!(
                !out.components[0].code().is_empty(),
                "per-component backend remains available"
            );
        }
    }
    for ssr in [false, true] {
        let arena = Allocator::new();
        let out = compile_jsx(
            &arena,
            "const App = () => <p>static</p>;",
            JsxLang::Tsx,
            &JsxCompileConfig {
                ssr,
                default_mode: vize_atelier_jsx::JsxOutputMode::Vapor,
                ..Default::default()
            },
        );
        assert!(!out.has_errors(), "{:?}", out.diagnostics);
        assert!(!out.module_code().is_empty());
    }
}

#[test]
fn renderer_parameters_do_not_silently_shadow_authored_context_references() {
    let source = "export const App = (props: any, _ctx: any) => <p>{_ctx.attrs.title}</p>;";
    let arena = Allocator::new();
    let out = compile_jsx(&arena, source, JsxLang::Tsx, &JsxCompileConfig::default());
    assert!(out.has_errors());
    let diagnostic = out
        .diagnostics
        .iter()
        .find(|d| {
            d.message
                .contains("shadowed by a generated renderer binding")
        })
        .expect("renderer capture");
    assert_eq!(
        source.get(diagnostic.start as usize..diagnostic.end as usize),
        Some("_ctx")
    );
    assert!(out.module_code().is_empty());
}
