import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { VizePluginState } from "./state.ts";
import { transformHook } from "./load.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseState: VizePluginState = {
  cache: new Map(),
  ssrCache: new Map(),
  collectedCss: new Map(),
  precompileMetadata: new Map(),
  pendingHmrUpdateTypes: new Map(),
  isProduction: false,
  root: "/src",
  clientViteBase: "/",
  serverViteBase: "/",
  server: {} as never,
  filter: () => true,
  scanPatterns: ["**/*.vue"],
  precompileBatchSize: 128,
  ignorePatterns: [],
  mergedOptions: {},
  initialized: true,
  dynamicImportAliasRules: [],
  cssAliasRules: [],
  extractCss: false,
  componentsCssFileName: "assets/vize-components.css",
  clientViteDefine: {},
  serverViteDefine: {},
  logger: {
    log() {},
    info() {},
    warn() {},
    error() {},
  } as never,
};

// A real .jsx file Vize fixture flows through the transform hook and compiles
// to render code through Vize (the headline acceptance of #1500).
const jsxFixturePath = path.resolve(__dirname, "..", "test", "fixtures", "jsx", "App.jsx");
const jsxFixtureSource = fs.readFileSync(jsxFixturePath, "utf8");

const jsxState: VizePluginState = {
  ...baseState,
  cache: new Map(),
  ssrCache: new Map(),
  mergedOptions: { vapor: false, include: /\.[jt]sx$/ },
};

const jsxTransform = await transformHook(jsxState, jsxFixtureSource, jsxFixturePath, {
  ssr: false,
});
assert.ok(
  jsxTransform && typeof jsxTransform === "object",
  "Vite should hand .jsx files to Vize and receive a transform result",
);
assert.match(
  jsxTransform.code,
  /_createElementBlock\("div"/,
  "VDOM .jsx components should compile to Vize render code through the transform hook",
);
// The render code's runtime helpers must be imported (the preamble is no longer
// dropped, #1533).
assert.match(
  jsxTransform.code,
  /import \{[^}]*createElementBlock[^}]*\} from "vue"/,
  "VDOM .jsx output should carry the runtime-helper import preamble",
);
// Source maps are on in dev (isProduction === false), so a single-component
// .jsx transform surfaces a v3 map (parsed to the object form Vite expects) for
// the bundler to consume (#1533).
assert.ok(
  jsxTransform.map && typeof jsxTransform.map === "object",
  "JSX transform should surface a source map object in dev",
);
assert.equal(
  (jsxTransform.map as { version?: number }).version,
  3,
  "the surfaced JSX source map should be v3",
);

const jsxVaporState: VizePluginState = {
  ...jsxState,
  mergedOptions: { ...jsxState.mergedOptions, vapor: true },
};

const jsxVaporTransform = await transformHook(
  jsxVaporState,
  'const App = () => <div class="greeting">standalone</div>;',
  jsxFixturePath,
  { ssr: false },
);
assert.ok(
  jsxVaporTransform && typeof jsxVaporTransform === "object",
  "Vapor .jsx transforms should also produce a result",
);
assert.match(
  jsxVaporTransform.code,
  /_template\(/,
  "Vapor .jsx components should compile to hoisted templates through the transform hook",
);
// The Vapor backend does not emit a source map yet, so the transform reports none.
assert.equal(
  jsxVaporTransform.map,
  null,
  "Vapor .jsx transform has no source map (Vapor codegen does not emit one yet)",
);
await assert.rejects(
  () => transformHook(jsxVaporState, jsxFixtureSource, jsxFixturePath, { ssr: false }),
  {
    name: "VizeSfcCompileError",
    message: `[vize] Compilation failed in ${jsxFixturePath}:\n  - Vapor/SSR authored module preservation is not supported for imports, exports or captured setup bindings; use VDOM output or consume the per-component renderer`,
  },
);

const tsxFsTransform = await transformHook(
  jsxState,
  `const T = () => <span class="t">x</span>;\nexport default T;\n`,
  "/@fs/abs/src/Widget.tsx",
  { ssr: false },
);
assert.ok(
  tsxFsTransform && typeof tsxFsTransform === "object",
  "/@fs-prefixed .tsx requests should be claimed and compiled through Vize",
);
assert.match(
  tsxFsTransform.code,
  /render|_createElementBlock/,
  "/@fs .tsx requests should emit Vize render code",
);

const nonJsxTransform = await transformHook(jsxState, "export default 1;", "/src/plain.ts", {
  ssr: false,
});
assert.equal(
  nonJsxTransform,
  null,
  "Plain non-JSX modules should bypass the Vize JSX transform path",
);

const rawJsxTransform = await transformHook(jsxState, jsxFixtureSource, `${jsxFixturePath}?raw`, {
  ssr: false,
});
assert.equal(
  rawJsxTransform,
  null,
  "?raw imports of a .jsx file should keep Vite's default asset handling, not Vize compilation",
);

// A .tsx component's `<style scoped>` becomes emitted CSS through the transform
// hook, mirroring the SFC plain-CSS inline-injection path (#1495, #1533).
const scopedTsxTransform = await transformHook(
  jsxState,
  `const Scoped = () => (\n  <div class="box">\n    <style scoped>{\`.box { color: red }\`}</style>\n  </div>\n);\nexport default Scoped;\n`,
  "/src/Scoped.tsx",
  { ssr: false },
);
assert.ok(
  scopedTsxTransform && typeof scopedTsxTransform === "object",
  "a .tsx with <style scoped> should produce a transform result",
);
assert.match(
  scopedTsxTransform.code,
  /__vize_css__/,
  "the transform hook should emit JSX <style scoped> CSS through the inline-style injection path",
);
assert.match(
  scopedTsxTransform.code,
  /\.box\[data-v-[0-9a-f]+\]/,
  "the emitted JSX CSS should apply the scope id to the .box selector",
);

console.log("✅ vite-plugin-vize load boundary tests passed!");
