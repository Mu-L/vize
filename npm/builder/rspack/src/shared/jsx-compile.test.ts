import { test } from "node:test";
import assert from "node:assert/strict";
import { compileJsxModule } from "./compiler.ts";

const SOURCE = "const App = () => <div>{message}</div>;\nexport default App;\n";

void test("compileJsxModule includes the runtime-helper preamble in the emitted module", (t) => {
  // The VDOM render code references `_createElementBlock` / `_toDisplayString`,
  // so the emitted module must import them — the preamble is no longer dropped
  // (#1533).
  const { code } = compileJsxModule("/src/App.tsx", SOURCE, { jsxMode: "vdom" });
  const source = "const A = () => <input disabled/>;";
  const native = compileJsxModule("/src/App.jsx", source, { jsxMode: "vdom" });
  const babel = compileJsxModule("/src/App.jsx", source, {
    jsxMode: "vdom",
    jsxCompat: "babel",
  });
  // Preserve complete native/Babel compatibility output alongside the authored
  // module, including their different boolean attribute semantics.
  t.assert.snapshot({ module: code, nativeCompat: native.code, babelCompat: babel.code });
});

void test("compileJsxModule surfaces a v3 source map when sourceMap is requested", (t) => {
  const { map } = compileJsxModule("/src/App.tsx", SOURCE, { jsxMode: "vdom", sourceMap: true });
  assert.equal(typeof map, "string", "a source map is surfaced when requested");
  t.assert.snapshot(String(map));
});

void test("compileJsxModule omits the source map when sourceMap is off", () => {
  const { map } = compileJsxModule("/src/App.tsx", SOURCE, { jsxMode: "vdom", sourceMap: false });
  assert.equal(map, null, "no source map unless requested");
});

void test("compileJsxModule has no source map for Vapor output", () => {
  // The Vapor backend does not emit a source map yet, so even with `sourceMap`
  // requested the result carries none (#1533).
  const { map } = compileJsxModule("/src/App.tsx", "const App = () => <div>static</div>;", {
    vapor: true,
    sourceMap: true,
  });
  assert.equal(map, null, "Vapor output reports no source map");
});

void test("compileJsxModule diagnoses authored Vapor exports instead of dropping them", () => {
  assert.throws(() => compileJsxModule("/src/App.tsx", SOURCE, { vapor: true }), {
    name: "Error",
    message:
      "[vize] Compilation failed for /src/App.tsx:\nVapor/SSR authored module preservation is not supported for imports, exports or captured setup bindings; use VDOM output or consume the per-component renderer",
  });
});
