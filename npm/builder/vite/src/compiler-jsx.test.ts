import assert from "node:assert/strict";
import { compileJsxModule } from "./compiler.ts";

const jsxSource = `const App = () => <div class="greeting">{message}</div>;\nexport default App;\n`;

const jsxVdomCompiled = compileJsxModule("/src/App.jsx", jsxSource, { vapor: false });
assert.match(
  jsxVdomCompiled.code,
  /_createElementBlock\("div"/,
  "VDOM JSX compilation should emit the element block factory",
);
assert.deepEqual(
  jsxVdomCompiled.warnings,
  [],
  "VDOM JSX compilation of a valid component should emit no warnings",
);

const standaloneVaporSource = 'const App = () => <div class="greeting">standalone</div>;';
const jsxVaporCompiled = compileJsxModule("/src/App.jsx", standaloneVaporSource, { vapor: true });
assert.match(
  jsxVaporCompiled.code,
  /_template\(/,
  "Vapor JSX compilation should hoist a static template",
);
assert.doesNotMatch(
  jsxVaporCompiled.code,
  /_createElementBlock/,
  "Vapor JSX compilation should not emit the VDOM element block factory",
);
assert.throws(() => compileJsxModule("/src/App.jsx", jsxSource, { vapor: true }), {
  name: "VizeSfcCompileError",
  message:
    "[vize] Compilation failed in /src/App.jsx:\n  - Vapor/SSR authored module preservation is not supported for imports, exports or captured setup bindings; use VDOM output or consume the per-component renderer",
});

const tsxCompiled = compileJsxModule(
  "/src/Typed.tsx",
  `const Typed = (props: { label: string }) => <span>{props.label}</span>;\nexport default Typed;\n`,
  { vapor: false },
);
assert.match(
  tsxCompiled.code,
  /_createElementBlock\("span"|_createBlock|render/,
  "TSX compilation should infer the tsx language from the .tsx filename and emit render code",
);

assert.throws(
  () => compileJsxModule("/src/Broken.jsx", `const Broken = () => <div>{;`, { vapor: false }),
  /Compilation failed in \/src\/Broken\.jsx/,
  "JSX compilation errors should fail the Vite plugin instead of emitting broken code",
);

// A `.tsx` component with `<style scoped>` emits its (scope-rewritten) CSS
// through the same inline-injection path plain SFC `<style>` blocks use, with
// the `data-v-<hash>` scope id already applied (#1495, #1533).
const scopedJsxSource = `const Scoped = () => (\n  <div class="box">\n    <style scoped>{\`.box { color: red }\`}</style>\n  </div>\n);\nexport default Scoped;\n`;
const scopedJsxCompiled = compileJsxModule("/src/Scoped.tsx", scopedJsxSource, { vapor: false });
assert.match(
  scopedJsxCompiled.code,
  /__vize_css__/,
  "JSX <style scoped> CSS should be emitted through the inline-style injection path",
);
const jsxScopeMatch = scopedJsxCompiled.code.match(/data-v-[0-9a-f]+/);
assert.ok(jsxScopeMatch, "the emitted JSX CSS should carry a data-v- scope id");
assert.ok(
  scopedJsxCompiled.code.includes(`.box[${jsxScopeMatch[0]}]`),
  "the emitted JSX CSS should apply the scope id to the .box selector",
);

// Under SSR the inline `document`-based injection is skipped, mirroring the SFC
// inline-CSS path (the scope id still rides the render output).
const scopedJsxSsr = compileJsxModule("/src/Scoped.tsx", scopedJsxSource, {
  vapor: false,
  ssr: true,
});
assert.doesNotMatch(
  scopedJsxSsr.code,
  /__vize_css__/,
  "SSR JSX compilation should not emit the client-only inline-style injection",
);

console.log("✅ vite-plugin-vize JSX compiler tests passed!");
