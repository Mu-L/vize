import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import {
  changedPaths,
  planSourceChecks,
} from "../../tools/support/compat/github/plan-source-checks.mjs";

void test("compiler and CI changes run both source gates", () => {
  for (const path of [
    "crates/vize_croquis_cf/src/rules/provide_inject/index.rs",
    ".github/workflows/check.yml",
    "Cargo.lock",
  ]) {
    assert.deepEqual(
      planSourceChecks([path]),
      { rust: true, js: true, tooling: path === ".github/workflows/check.yml" },
      path,
    );
  }
});

void test("package changes run package tests while documentation stays fast", () => {
  assert.deepEqual(planSourceChecks(["npm/builder/rspack/src/scoped-css.test.ts"]), {
    rust: false,
    js: true,
    tooling: false,
  });
  assert.deepEqual(planSourceChecks(["docs/guide/example.md", "README.md"]), {
    rust: false,
    js: false,
    tooling: false,
  });
});

void test("unknown source directories fail closed", () => {
  assert.deepEqual(planSourceChecks(["new-runtime/src/index.ts"]), {
    rust: true,
    js: true,
    tooling: true,
  });
});

void test("release sources and tooling tests require the script gate", () => {
  for (const path of [
    "tools/support/release/pr_watch.rs",
    "tools/commands/release/promote.rs",
    "tests/tooling/release/release-pr.test.ts",
    ".github/workflows/release.yml",
  ]) {
    assert.deepEqual(planSourceChecks([path]), { rust: false, js: false, tooling: true }, path);
  }
});

void test("deleted source files still select both gates", () => {
  const cwd = mkdtempSync(join(tmpdir(), "vize-source-checks-"));
  const git = (...args) => execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
  try {
    git("init", "-q");
    git("config", "user.name", "CI Test");
    git("config", "user.email", "ci@example.invalid");
    mkdirSync(join(cwd, "crates"));
    writeFileSync(join(cwd, "crates", "lib.rs"), "pub fn example() {}\n");
    git("add", ".");
    git("commit", "-qm", "add source");
    const base = git("rev-parse", "HEAD");
    unlinkSync(join(cwd, "crates", "lib.rs"));
    git("add", "-u");
    git("commit", "-qm", "remove source");
    const paths = changedPaths(base, git("rev-parse", "HEAD"), cwd);
    assert.deepEqual(paths, ["crates/lib.rs"]);
    assert.deepEqual(planSourceChecks(paths), { rust: true, js: true, tooling: false });
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});
