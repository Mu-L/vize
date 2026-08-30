import { spawn, spawnSync } from "node:child_process";
import { createWriteStream, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { appendFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const artifactDir = "real-project-davinci-dom-corpus";
export const corpusRoot = "tests/_fixtures/_git";
export const expectedGitlinks = 146;

const ansiEscapePattern = new RegExp(`${String.fromCharCode(27)}\\[[0-?]*[ -/]*[@-~]`, "g");

function stripAnsi(value) {
  return value.replace(ansiEscapePattern, "");
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}`);
  }
  return result.stdout ?? "";
}

export function parseFixtureGitlinks(indexOutput) {
  return indexOutput
    .split(/\r?\n/)
    .flatMap((line) => {
      const match = /^160000 [0-9a-f]{40} 0\t(.+)$/.exec(line);
      return match ? [match[1]] : [];
    })
    .sort((left, right) => left.localeCompare(right));
}

function selectedGitlinks() {
  return parseFixtureGitlinks(run("git", ["ls-files", "--stage", "--", corpusRoot]));
}

export function verdictFor(outcome, mode) {
  return mode === "record-only" && outcome === "failure" ? "success" : outcome;
}

export function corpusEvidenceLines(logText) {
  return logText
    .split(/\r?\n/)
    .filter((line) =>
      /davinci-differential corpus scope|davinci DOM corpus sweep/.test(stripAnsi(line)),
    );
}

export function hydrateCorpus() {
  mkdirSync(artifactDir, { recursive: true });
  const fixturePaths = selectedGitlinks();
  if (fixturePaths.length !== expectedGitlinks) {
    console.error(
      `::error title=Unexpected fixture gitlinks::expected ${expectedGitlinks}, got ${fixturePaths.length}`,
    );
    return 1;
  }
  writeFileSync(`${artifactDir}/selected-gitlinks.txt`, `${fixturePaths.join("\n")}\n`);
  run("git", [
    "submodule",
    "update",
    "--init",
    "--checkout",
    "--depth",
    "1",
    "--jobs",
    "8",
    "--",
    ...fixturePaths,
  ]);
  const status = run("git", ["submodule", "status", "--", corpusRoot]);
  writeFileSync(`${artifactDir}/submodule-status.txt`, status);
  return 0;
}

export async function runCorpus() {
  mkdirSync(artifactDir, { recursive: true });
  const log = createWriteStream(`${artifactDir}/dom-corpus.log`, { flags: "w" });
  const child = spawn(
    "cargo",
    [
      "test",
      "-p",
      "vize_s1_to_s2",
      "--features",
      "davinci-differential",
      "--test",
      "davinci_dom_corpus",
      "--",
      "--nocapture",
    ],
    {
      env: {
        ...process.env,
        VIZE_DAVINCI_DIFFERENTIAL_CORPUS: corpusRoot,
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  child.stdout.on("data", (chunk) => {
    process.stdout.write(chunk);
    log.write(chunk);
  });
  child.stderr.on("data", (chunk) => {
    process.stderr.write(chunk);
    log.write(chunk);
  });
  return await new Promise((resolvePromise) => {
    child.on("close", (code) => {
      log.end();
      resolvePromise(code ?? 1);
    });
    child.on("error", (error) => {
      log.end();
      console.error(error instanceof Error ? error.message : String(error));
      resolvePromise(1);
    });
  });
}

export async function finalizeCorpus(environment = process.env) {
  mkdirSync(artifactDir, { recursive: true });
  const mode = environment.VIZE_DAVINCI_DOM_CORPUS_MODE ?? "enforce";
  const outcome = environment.VIZE_DAVINCI_DOM_CORPUS_OUTCOME ?? "failure";
  const verdict = verdictFor(outcome, mode);
  writeFileSync(`${artifactDir}/summary.json`, `${JSON.stringify({ mode, outcome, verdict })}\n`);
  await appendCorpusSummary(mode, outcome, verdict, environment.GITHUB_STEP_SUMMARY);
  if (verdict !== "success") {
    console.error(`::error title=Davinci S2 DOM corpus failed::mode=${mode} verdict=${verdict}`);
    return 1;
  }
  return 0;
}

async function appendCorpusSummary(mode, outcome, verdict, summaryPath) {
  if (!summaryPath) return;
  const gitlinkCount = readOptional(`${artifactDir}/selected-gitlinks.txt`)
    .trim()
    .split(/\r?\n/)
    .filter(Boolean).length;
  const logText = readOptional(`${artifactDir}/dom-corpus.log`);
  const evidence = corpusEvidenceLines(logText);
  await appendFile(
    summaryPath,
    [
      "## Davinci S2 DOM Corpus",
      "",
      `- mode: \`${mode}\``,
      `- outcome: \`${outcome}\``,
      `- verdict: \`${verdict}\``,
      `- gitlinks: \`${gitlinkCount}\``,
      "",
      ...evidence,
      "",
    ].join("\n"),
  );
}

function readOptional(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

async function main() {
  const command = process.argv[2];
  if (command === "hydrate") return hydrateCorpus();
  if (command === "run") return await runCorpus();
  if (command === "finalize") return await finalizeCorpus();
  console.error("usage: davinci-dom-corpus-workflow.mjs hydrate|run|finalize");
  return 1;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  process.exitCode = await main();
}
