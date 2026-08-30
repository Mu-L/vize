import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createRealProjectSurfaceResultsFromWorkflow,
  createRealProjectSurfaceVerdict,
  realProjectSurfaceNames,
} from "../../tools/fixtures/real-project-surface-verdict.mjs";

const successfulResults = realProjectSurfaceNames.map((name) => ({ name, outcome: "success" }));

test("the real-project surface verdict accepts only a complete successful set", () => {
  const verdict = createRealProjectSurfaceVerdict(successfulResults, {
    GITHUB_SHA: "0123456789abcdef",
    FIXTURE_SHARD_INDEX: "7",
  });
  assert.equal(verdict.status, "success");
  assert.equal(verdict.sourceCommit, "0123456789abcdef");
  assert.equal(verdict.shardIndex, "7");
  assert.deepEqual(verdict.failedSurfaceNames, []);
  assert.deepEqual(verdict.surfaces, successfulResults);
});

for (const outcome of ["failure", "cancelled", "skipped"] as const) {
  test(`the real-project surface verdict fails closed on ${outcome}`, () => {
    const verdict = createRealProjectSurfaceVerdict(
      successfulResults.map((result) =>
        result.name === "core-tools" ? { ...result, outcome } : result,
      ),
    );
    assert.equal(verdict.status, "failure");
    assert.deepEqual(verdict.failedSurfaceNames, ["core-tools"]);
  });
}

test("the real-project surface verdict rejects missing, duplicate, unknown, and empty outcomes", () => {
  assert.throws(
    () => createRealProjectSurfaceVerdict(successfulResults.slice(1)),
    /missing real-project surface verdict.*waiver-audit/,
  );
  assert.throws(
    () => createRealProjectSurfaceVerdict([...successfulResults, successfulResults[0]]),
    /duplicate real-project surface/,
  );
  assert.throws(
    () =>
      createRealProjectSurfaceVerdict([
        ...successfulResults.slice(1),
        { name: "unknown", outcome: "success" },
      ]),
    /unknown real-project surface/,
  );
  assert.throws(
    () =>
      createRealProjectSurfaceVerdict(
        successfulResults.map((result) =>
          result.name === "glyph" ? { ...result, outcome: "" } : result,
        ),
      ),
    /invalid outcome for glyph/,
  );
});

test("workflow surface inputs preserve enforce modes and soften only record-only failures", () => {
  const results = createRealProjectSurfaceResultsFromWorkflow({
    VIZE_WAIVER_AUDIT_OUTCOME: "success",
    TYPECHECK_DEPENDENCIES_MODE: "record-only",
    VIZE_TYPECHECK_DEPENDENCIES_OUTCOME: "failure",
    CORE_TOOLS_MODE: "enforce",
    VIZE_CORE_TOOLS_OUTCOME: "success",
    LSP_MODE: "record-only",
    VIZE_LSP_OUTCOME: "cancelled",
    LINT_DIVERGENCE_MODE: "record-only",
    VIZE_LINT_DIVERGENCE_OUTCOME: "failure",
    VIZE_SYNTAX_HIGHLIGHTER_OUTCOME: "success",
    VIZE_GLYPH_OUTCOME: "success",
    TYPECHECK_DIVERGENCE_MODE: "record-only",
    VIZE_TYPECHECK_DIVERGENCE_OUTCOME: "failure",
  });

  assert.deepEqual(results, [
    { name: "waiver-audit", outcome: "success" },
    { name: "typecheck-dependencies", outcome: "success" },
    { name: "core-tools", outcome: "success" },
    { name: "lsp", outcome: "cancelled" },
    { name: "lint-divergence", outcome: "success" },
    { name: "syntax-highlighter", outcome: "success" },
    { name: "glyph", outcome: "success" },
    { name: "typecheck-divergence", outcome: "success" },
  ]);
});
