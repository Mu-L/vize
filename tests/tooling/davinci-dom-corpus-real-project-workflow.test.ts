import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  corpusEvidenceLines,
  parseFixtureGitlinks,
  verdictFor,
} from "../../tools/fixtures/davinci-dom-corpus-workflow.mjs";
import { findStep, readRealProjectMatrixWorkflow } from "./support/real-project-matrix-workflow.ts";

const helperSource = readFileSync("tools/fixtures/davinci-dom-corpus-workflow.mjs", "utf8");

test("real-project workflow carries a full-canonical S2 DOM corpus job", () => {
  const workflow = readRealProjectMatrixWorkflow();
  const job = workflow.jobs?.["davinci-dom-corpus"];
  assert.ok(job, "missing davinci-dom-corpus job");
  const steps = job.steps ?? [];

  assert.equal(job.name, "s2 dom corpus");
  assert.equal(job["runs-on"], "blacksmith-32vcpu-ubuntu-2404");
  assert.equal(job["timeout-minutes"], 120);
  assert.equal(
    job.env?.VIZE_DAVINCI_DOM_CORPUS_MODE,
    "${{ inputs.davinci_dom_corpus_mode || 'enforce' }}",
  );

  const checkout = steps.find((step) => step.uses?.startsWith("actions/checkout@"));
  assert.match(checkout?.uses ?? "", /de0fac2e4500dabe0009e67214ff5f5447ce83dd/);
  assert.deepEqual(checkout?.with, { "persist-credentials": false });
  assert.ok(steps.some((step) => step.uses?.startsWith("dtolnay/rust-toolchain@")));
  assert.ok(steps.some((step) => step.uses === "./.github/actions/setup-rust-sticky-cache"));

  const hydrate = findStep(steps, "Select and hydrate full fixture corpus");
  assert.equal(hydrate.run, "node tools/fixtures/davinci-dom-corpus-workflow.mjs hydrate");
  for (const pattern of [
    /git", \["ls-files", "--stage", "--", corpusRoot\]/,
    /expectedGitlinks = 146/,
    /artifactDir = "real-project-davinci-dom-corpus"/,
    /selected-gitlinks\.txt/,
    /"submodule",\s+"update",\s+"--init",\s+"--checkout",\s+"--depth",\s+"1",\s+"--jobs",\s+"8"/,
    /"submodule", "status", "--", corpusRoot/,
  ]) {
    assert.match(helperSource, pattern);
  }

  const corpus = findStep(steps, "Run S2 DOM differential corpus");
  assert.equal(corpus.id, "davinci_dom_corpus");
  assert.equal(corpus["continue-on-error"], true);
  assert.equal(corpus.run, "node tools/fixtures/davinci-dom-corpus-workflow.mjs run");
  assert.match(helperSource, /VIZE_DAVINCI_DIFFERENTIAL_CORPUS: corpusRoot/);
  assert.match(helperSource, /"cargo",/);
  assert.match(helperSource, /"test",\s+"-p",\s+"vize_s1_to_s2"/);
  assert.match(helperSource, /"davinci-differential"/);
  assert.match(helperSource, /"davinci_dom_corpus"/);
  assert.match(helperSource, /dom-corpus\.log/);

  const finalize = findStep(steps, "Finalize S2 DOM corpus evidence");
  assert.equal(finalize.if, "${{ always() }}");
  assert.deepEqual(finalize.env, {
    VIZE_DAVINCI_DOM_CORPUS_OUTCOME: "${{ steps.davinci_dom_corpus.outcome }}",
  });
  assert.equal(finalize.run, "node tools/fixtures/davinci-dom-corpus-workflow.mjs finalize");
  assert.match(helperSource, /"record-only"/);
  assert.match(helperSource, /summary\.json/);
  assert.match(helperSource, /davinci-differential corpus scope\|davinci DOM corpus sweep/);
  assert.match(helperSource, /Davinci S2 DOM corpus failed/);

  const upload = findStep(steps, "Upload S2 DOM corpus evidence");
  assert.equal(upload.if, "${{ always() }}");
  assert.equal(upload.uses, "actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a");
  assert.deepEqual(upload.with, {
    name: "real-project-davinci-dom-corpus",
    path: "real-project-davinci-dom-corpus",
    "if-no-files-found": "error",
    "retention-days": 30,
  });
});

test("S2 DOM corpus workflow helper extracts canonical evidence", () => {
  assert.deepEqual(
    parseFixtureGitlinks(
      [
        "100644 0123456789012345678901234567890123456789 0\tignored.txt",
        "160000 b6011381bc34a6b85ad669363513cb1a2eea6438 0\ttests/_fixtures/_git/airi",
        "160000 3ee62adffdcdfa4a37b2ed4e9c30636655d5fcd1 0\ttests/_fixtures/_git/create-vue",
      ].join("\n"),
    ),
    ["tests/_fixtures/_git/airi", "tests/_fixtures/_git/create-vue"],
  );
  assert.deepEqual(
    corpusEvidenceLines("\u001B[32mdavinci DOM corpus sweep: compared=1\u001B[0m\nx"),
    ["\u001B[32mdavinci DOM corpus sweep: compared=1\u001B[0m"],
  );
  assert.equal(verdictFor("failure", "record-only"), "success");
  assert.equal(verdictFor("cancelled", "record-only"), "cancelled");
});
