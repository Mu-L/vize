import { execFileSync } from "node:child_process";
import { appendFileSync } from "node:fs";

export function planSourceChecks(paths) {
  // A new source directory must be validated until its dependencies are known.
  // Compiler changes can affect the native JS binding and its package tests.
  const result = { rust: false, js: false, tooling: false };
  for (const path of paths) {
    if (/^(docs\/|\.changeset\/)/.test(path) || /(^|\/)README\.md$/.test(path)) continue;
    if (
      /^(tests\/tooling\/|tools\/support\/release\/|tools\/commands\/release\/|tools\/moon\/cmd\/release\/|tools\/support\/compat\/github\/|\.github\/workflows\/release[^/]*\.yml$)/.test(
        path,
      )
    ) {
      result.tooling = true;
      continue;
    }
    if (/^(crates\/|\.cargo\/|Cargo\.(toml|lock)$|rust-toolchain\.toml$)/.test(path)) {
      result.rust = true;
      result.js = true;
    } else if (
      /^(npm\/|tests\/|playground\/|editors\/|package\.json$|pnpm-|tools\/config\/)/.test(path)
    ) {
      result.js = true;
    } else {
      result.rust = true;
      result.js = true;
      result.tooling = true;
    }
  }
  return result;
}

export function changedPaths(base, head, cwd = process.cwd()) {
  return execFileSync(
    "git",
    ["diff", "--no-renames", "--name-only", "--diff-filter=ACDMRT", "-z", base, head],
    {
      cwd,
      encoding: "utf8",
    },
  )
    .split("\0")
    .filter(Boolean);
}

if (process.argv[1]?.endsWith("/plan-source-checks.mjs")) {
  const [base, head] = process.argv.slice(2);
  if (!/^[0-9a-f]{40}$/.test(base ?? "") || !/^[0-9a-f]{40}$/.test(head ?? "")) {
    throw new Error("expected full base and head commit SHAs");
  }
  // A new branch or an unavailable predecessor gets both gates, never a pass.
  const paths = /^0+$/.test(base) ? [".github/workflows/check.yml"] : changedPaths(base, head);
  const plan = paths.length ? planSourceChecks(paths) : { rust: true, js: true, tooling: true };
  const output = `rust=${plan.rust}\njs=${plan.js}\ntooling=${plan.tooling}\n`;
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, output);
  process.stdout.write(
    `Changed paths: ${paths.length}; Rust: ${plan.rust}; JS packages: ${plan.js}; tooling: ${plan.tooling}\n`,
  );
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `### Source checks\n\n| Check | Run |\n| --- | --- |\n| Rust Clippy and tests | ${plan.rust} |\n| JS package build and tests | ${plan.js} |\n| Tooling scripts | ${plan.tooling} |\n\nChanged paths: ${paths.length}.\n`,
    );
  }
}
