// The second argument of Vue 3.6.0-rc.9's next() is `isText`. Passing the old
// sibling index shifts hydration targets after the input (#6727).
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";

import { installDom, vaporRuntime } from "./support/upstream/pattern-runtime.ts";

const require = createRequire(import.meta.url);
const { compileSfc } =
  require("../../npm/native/index.js") as typeof import("../../npm/native/index.js");

test("Vapor reuses SSR siblings around v-model with Vue 3.6.0-rc.9", async () => {
  await installDom();
  const vue = await import(vaporRuntime);
  const source = `<script setup vapor>
import { ref } from "vue"
const a = ref("A")
const q = ref("")
const b = ref("B")
</script>
<template><div><h1>{{ a }}</h1><input v-model="q"><p>{{ b }}</p></div></template>`;
  const compiled = compileSfc(source, { filename: "App.vue", vapor: true });
  assert.deepEqual(compiled.errors, []);

  const directory = mkdtempSync(path.join(tmpdir(), "vize-vapor-next-"));
  const modulePath = path.join(directory, "App.mjs");
  const moduleSource = compiled.code.replaceAll(
    /from ['"]vue['"]/g,
    `from ${JSON.stringify(vaporRuntime)}`,
  );
  writeFileSync(modulePath, moduleSource);
  try {
    const { default: App } = await import(pathToFileURL(modulePath).href);
    const host = document.body.appendChild(document.createElement("div"));
    host.innerHTML = '<div><h1>A</h1><input value=""><p>B</p></div>';
    const serverElements = [...host.querySelectorAll("*")];
    const warnings: string[] = [];
    const originalWarn = console.warn;
    const app = vue.createVaporSSRApp(App);
    app.config.errorHandler = (error: Error) => warnings.push(error.message);
    console.warn = (...args) => warnings.push(args.join(" "));
    try {
      app.mount(host);
      assert.deepEqual(warnings, []);
      assert.deepEqual([...host.querySelectorAll("*")], serverElements);
      assert.equal(host.querySelector("h1")?.textContent, "A");
      assert.equal(host.querySelector("p")?.textContent, "B");
    } finally {
      console.warn = originalWarn;
      app.unmount();
      host.remove();
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
