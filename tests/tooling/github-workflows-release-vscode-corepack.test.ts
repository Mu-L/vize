import assert from "node:assert/strict";
import { test } from "node:test";

import { readRepoFile, workflowJobBody } from "./support/github-workflows.ts";

test("release VS Code publication hydrates corepack pnpm before publishing", () => {
  const workflow = readRepoFile(".github", "workflows", "release.yml");
  const publishJob = workflowJobBody(workflow, "release-vscode-extension");
  const hydrateStepIndex = publishJob.indexOf("name: Hydrate pnpm for VS Code extension tooling");
  const publishStepIndex = publishJob.indexOf("name: Publish VS Code extension");

  assert.notEqual(hydrateStepIndex, -1, "missing pnpm hydration step");
  assert.notEqual(publishStepIndex, -1, "missing VS Code publish step");
  assert.ok(hydrateStepIndex < publishStepIndex);
  assert.match(
    publishJob,
    /package_manager="\$\(node -p "require\('\.\/package\.json'\)\.packageManager"\)"/,
  );
  assert.match(publishJob, /corepack enable/);
  assert.match(publishJob, /corepack prepare "\$package_manager" --activate/);
  assert.match(publishJob, /corepack pnpm --version/);
});
