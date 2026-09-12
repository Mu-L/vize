import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

void test("runs when invoked through a symlinked pnpm bin entrypoint", async (t) => {
  const workspace = await fs.promises.mkdtemp(path.join(os.tmpdir(), "musea-vrt-bin-"));
  t.after(() => fs.promises.rm(workspace, { force: true, recursive: true }));

  const entrypoint = path.join(packageRoot, "src", "cli", "index.ts");
  const shimEntrypoint = path.join(
    workspace,
    "node_modules",
    "@vizejs",
    "vite-plugin-musea",
    "dist",
    "cli",
    "index.ts",
  );
  await fs.promises.mkdir(path.dirname(shimEntrypoint), { recursive: true });
  await fs.promises.symlink(entrypoint, shimEntrypoint);

  const result = spawnSync(process.execPath, ["--import", "tsx", shimEntrypoint, "--help"], {
    cwd: packageRoot,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Musea VRT - Visual Regression Testing for Component Gallery/u);
  assert.match(result.stdout, /Usage:\n\s+musea-vrt \[command\] \[options\]/u);
});
