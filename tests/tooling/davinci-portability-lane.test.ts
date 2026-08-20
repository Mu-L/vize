import assert from "node:assert/strict";
import { test } from "node:test";

import { readRepoFile, workflowJobBody } from "./support/github-workflows.ts";

// TS-24 (davinci-road/plan/test-suites.md): the wasm32-wasip2 portability
// lanes for the Davinci `no_std` core crates. The lanes ride `clippy-and-test`
// as steps rather than as their own job because `.github/workflows/check.yml`
// is over the 350-line ratchet and must not grow
// (davinci-road/plan/phase-2-records/p2-14.md); this file is what keeps that
// placement from silently dissolving. The approved `std` dependency edges are
// recorded in davinci-road/plan/no-std-boundary.md.

test("TS-24: the wasm32-wasip2 lanes ride the required clippy-and-test job", () => {
  const workflow = readRepoFile(".github", "workflows", "check.yml");
  const job = workflowJobBody(workflow, "clippy-and-test");

  // Required on every pull request: clippy-and-test carries no event guard,
  // and it sits in the `needs:` list of test-report, the required status
  // check (tests/tooling/github-workflows-check-gate.test.ts deep-equals that
  // list, so membership cannot drift without failing there too).
  assert.doesNotMatch(
    job,
    /^ {4}if:/m,
    "clippy-and-test must stay unconditional: TS-24 is required for the core crates",
  );
  assert.match(workflowJobBody(workflow, "test-report"), /- clippy-and-test\b/);

  // The toolchain step must install the wasip2 std through the action's
  // `targets:` input - the machine recipe. (The local nix flake's Rust
  // carries only wasm32-unknown-unknown; the sysroot-overlay workaround is
  // recorded in no-std-boundary.md, and CI must never need it.)
  assert.match(job, /targets:\s*wasm32-wasip2$/m);

  // The two lane commands, exactly as TS-24's row states them: the default
  // build and the `--no-default-features` build, both on the 32-bit target.
  assert.match(
    job,
    /^ {8}run: cargo build -p vize_davinci -p vize_disegno --target wasm32-wasip2 && cargo build -p vize_davinci -p vize_disegno --target wasm32-wasip2 --no-default-features$/m,
  );
});

test("the no_std claim's attributes stay on exactly the audited crates", () => {
  // The lane's target carries std (wasm32-wasip2 is not a std-less build), so
  // the `no_std` half of the claim is held by these attributes; the build
  // proves they are honest (a `std::` path in either crate stops compiling).
  // A crate joining the claim must appear here, in both lane commands above,
  // and in no-std-boundary.md's ledger.
  for (const crate of ["vize_davinci", "vize_disegno"]) {
    const lib = readRepoFile("crates", crate, "src", "lib.rs");
    assert.match(lib, /^#!\[no_std\]$/m, `${crate} must keep #![no_std]`);
    assert.match(lib, /^extern crate alloc;$/m, `${crate} must keep extern crate alloc`);
  }
});
