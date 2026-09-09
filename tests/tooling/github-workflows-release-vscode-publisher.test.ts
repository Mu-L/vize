import assert from "node:assert/strict";
import { test } from "node:test";

import { readRepoFile, workflowJobBody } from "./support/github-workflows.ts";

test("release VS Code publication uses npx without corepack hydration", () => {
  const workflow = readRepoFile(".github", "workflows", "release.yml");
  const publishJob = workflowJobBody(workflow, "release-vscode-extension");
  const publishStepIndex = publishJob.indexOf("name: Publish VS Code extension");

  assert.notEqual(publishStepIndex, -1, "missing VS Code publish step");
  assert.match(publishJob, /VSCE_DLX_BIN:\s*npx/);
  assert.doesNotMatch(publishJob, /Cache pnpm store for VS Code extension tooling/);
  assert.doesNotMatch(publishJob, /Hydrate pnpm for VS Code extension tooling/);
  assert.doesNotMatch(publishJob, /corepack (enable|prepare|pnpm)/);
});
