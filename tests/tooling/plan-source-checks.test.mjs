import assert from "node:assert/strict";
import { test } from "node:test";

import { planSourceChecks } from "../../tools/support/compat/github/plan-source-checks.mjs";

test("compiler and CI changes run both source gates", () => {
  for (const path of [
    "crates/vize_croquis_cf/src/rules/provide_inject/index.rs",
    ".github/workflows/check.yml",
    "Cargo.lock",
  ]) {
    assert.deepEqual(planSourceChecks([path]), { rust: true, js: true }, path);
  }
});

test("package changes run package tests while documentation stays fast", () => {
  assert.deepEqual(planSourceChecks(["npm/builder/rspack/src/scoped-css.test.ts"]), {
    rust: false,
    js: true,
  });
  assert.deepEqual(planSourceChecks(["docs/guide/example.md", "README.md"]), {
    rust: false,
    js: false,
  });
});

test("unknown source directories fail closed", () => {
  assert.deepEqual(planSourceChecks(["new-runtime/src/index.ts"]), { rust: true, js: true });
});
