import { test, expect, type Page } from "@playwright/test";
import { execSync, spawn, type ChildProcess } from "node:child_process";
import { createConnection } from "node:net";
import * as path from "node:path";
import * as fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOT_DIR = path.resolve(__dirname, "screenshots");
const VITE_PLUS_BIN = path.join(
  process.env.HOME ?? "",
  ".vite-plus",
  "bin",
);
const VIZE_BIN = path.resolve(__dirname, "../target/release/vize");
const TSGO_BIN = path.resolve(__dirname, "../node_modules/.bin/tsgo");
const NPM_DIR = path.resolve(__dirname, "../npm");
const E2E_DIR = path.resolve(__dirname);

interface AppConfig {
  name: string;
  cwd: string;
  command: string;
  args: string[];
  port: number;
  url: string;
  mountSelector: string;
  /** Pattern in stdout/stderr that indicates the server is ready */
  readyPattern: RegExp;
  /** If true, the dev server doesn't serve an HTML page by itself */
  noHtmlFallback?: boolean;
  /** Allow non-200 responses (e.g. proxy errors when backend is missing) */
  allowNon200?: boolean;
  /** Playwright waitUntil strategy for page.goto (default: "networkidle") */
  waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit";
  startupTimeout: number;
  /** Extra environment variables for the dev server */
  env?: Record<string, string>;
  /** Setup function to run before starting the dev server */
  setup?: () => void;
  /** Setup Playwright page before navigation (e.g., mock API routes) */
  setupPage?: (page: Page) => Promise<void>;
  /** Extra delay (ms) after readyPattern matches before considering server ready */
  readyDelay?: number;
  /** Canon (type checker) configuration */
  canon?: {
    cwd: string;
    patterns: string[];
  };
}

// --- Helper functions ---

const VIZE_SYMLINK_TARGETS: Record<string, string> = {
  native: path.join(NPM_DIR, "vize-native"),
  "vite-plugin": path.join(NPM_DIR, "vite-plugin-vize"),
  nuxt: path.join(NPM_DIR, "nuxt"),
  "vite-plugin-musea": path.join(NPM_DIR, "vite-plugin-musea"),
  "musea-nuxt": path.join(NPM_DIR, "musea-nuxt"),
};

function createVizeSymlinks(nodeModulesDir: string): void {
  const vizejsDir = path.join(nodeModulesDir, "@vizejs");
  fs.mkdirSync(vizejsDir, { recursive: true });
  for (const [name, target] of Object.entries(VIZE_SYMLINK_TARGETS)) {
    const link = path.join(vizejsDir, name);
    if (!fs.existsSync(link)) {
      fs.symlinkSync(target, link, "dir");
    }
  }
}

function patchNuxtConfig(configPath: string): void {
  let config = fs.readFileSync(configPath, "utf-8");
  if (!config.includes("@vizejs/nuxt")) {
    config = config.replace(
      "modules: [",
      "modules: [\n    '@vizejs/nuxt',",
    );
    config = config.replace(
      "compatibilityDate:",
      "vize: {\n    musea: false,\n  },\n\n  compatibilityDate:",
    );
    fs.writeFileSync(configPath, config);
  }
}

/** Symlink a transitive dep from pnpm store into node_modules root so SSR can find it */
function hoistPnpmPackage(nodeModulesDir: string, packageName: string): void {
  const link = path.join(nodeModulesDir, packageName);
  if (fs.existsSync(link)) return;
  const pnpmDir = path.join(nodeModulesDir, ".pnpm");
  if (!fs.existsSync(pnpmDir)) return;
  const candidates = fs.readdirSync(pnpmDir)
    .filter(d => d.startsWith(`${packageName}@`));
  for (const candidate of candidates) {
    const target = path.join(pnpmDir, candidate, "node_modules", packageName);
    if (fs.existsSync(target)) {
      fs.symlinkSync(target, link, "dir");
      return;
    }
  }
}

function addPnpmOverrides(packageJsonPath: string, overrides: Record<string, string>): void {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  if (!pkg.pnpm) pkg.pnpm = {};
  if (!pkg.pnpm.overrides) pkg.pnpm.overrides = {};
  let changed = false;
  for (const [key, value] of Object.entries(overrides)) {
    if (pkg.pnpm.overrides[key] !== value) {
      pkg.pnpm.overrides[key] = value;
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, "\t") + "\n");
  }
}

// --- App configurations ---

const apps: AppConfig[] = [
  {
    name: "elk",
    cwd: path.join(E2E_DIR, "elk"),
    command: "npx",
    args: ["pnpm@10", "dev"],
    port: 5314,
    url: "http://localhost:5314",
    mountSelector: "#__nuxt",
    readyPattern: /Local:\s+http:\/\/localhost:5314/,
    // Nuxt SSR may return 503 due to esbuild dep optimization issues (unrelated to vize)
    allowNon200: true,
    // Nuxt SSR dev server never reaches networkidle due to continuous HMR/module requests
    waitUntil: "load",
    // Nuxt announces URL before Nitro finishes building; wait extra for SSR readiness
    readyDelay: 15_000,
    startupTimeout: 120_000,
    setup() {
      const elkDir = path.join(E2E_DIR, "elk");

      // 1. Add vite 8 override
      addPnpmOverrides(path.join(elkDir, "package.json"), {
        vite: "^8.0.0-beta.0",
      });

      // 2. Install dependencies
      console.log("[elk:setup] pnpm install...");
      execSync("npx pnpm@10 install --no-frozen-lockfile", {
        cwd: elkDir,
        stdio: "inherit",
        timeout: 300_000,
      });

      // 3. Create @vizejs symlinks
      createVizeSymlinks(path.join(elkDir, "node_modules"));

      // 4. Patch nuxt.config.ts
      patchNuxtConfig(path.join(elkDir, "nuxt.config.ts"));
    },
    canon: {
      cwd: path.join(E2E_DIR, "elk"),
      patterns: ["app/**/*.vue"],
    },
  },
  {
    name: "misskey",
    cwd: path.join(E2E_DIR, "misskey", "packages", "frontend"),
    command: "npx",
    args: ["pnpm@10", "exec", "vite"],
    port: 5173,
    url: "http://localhost:5173/vite/",
    mountSelector: "#misskey_app",
    readyPattern: /Local:\s+http:\/\//,
    // Boot process calls /api/meta which fails without backend
    allowNon200: true,
    // Streaming WebSocket prevents networkidle
    waitUntil: "domcontentloaded",
    startupTimeout: 90_000,
    setup() {
      const misskeyDir = path.join(E2E_DIR, "misskey");
      const frontendDir = path.join(misskeyDir, "packages", "frontend");

      // 1. Create .config/default.yml (required by vite.config.ts)
      const configDir = path.join(misskeyDir, ".config");
      const configFile = path.join(configDir, "default.yml");
      if (!fs.existsSync(configFile)) {
        fs.mkdirSync(configDir, { recursive: true });
        fs.writeFileSync(configFile, "url: http://localhost:3000\nport: 3000\n");
      }

      // 2. Generate index.html (backend normally provides it)
      const indexHtml = path.join(frontendDir, "index.html");
      fs.writeFileSync(
        indexHtml,
        `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta property="instance_url" content="http://localhost:3000">
<meta property="og:site_name" content="Misskey">
</head>
<body>
<div id="misskey_app"></div>
<script type="module" src="/src/_boot_.ts"></script>
</body>
</html>
`,
      );

      // 3. Add vite 8 override
      addPnpmOverrides(path.join(misskeyDir, "package.json"), {
        vite: "^8.0.0-beta.0",
      });

      // 4. Install dependencies
      console.log("[misskey:setup] pnpm install...");
      execSync("npx pnpm@10 install --no-frozen-lockfile", {
        cwd: misskeyDir,
        stdio: "inherit",
        timeout: 300_000,
      });

      // 5. Build workspace packages needed by frontend
      console.log("[misskey:setup] building i18n package...");
      execSync("npx pnpm@10 --filter i18n build", {
        cwd: misskeyDir,
        stdio: "inherit",
        timeout: 120_000,
      });
      console.log("[misskey:setup] building icons-subsetter package...");
      execSync("npx pnpm@10 --filter icons-subsetter build", {
        cwd: misskeyDir,
        stdio: "inherit",
        timeout: 120_000,
      });

      // 6. Create @vizejs symlinks
      createVizeSymlinks(path.join(misskeyDir, "node_modules"));

      // 7. Patch vite.config.ts: replace @vitejs/plugin-vue with @vizejs/vite-plugin
      const viteConfigPath = path.join(frontendDir, "vite.config.ts");
      let viteConfig = fs.readFileSync(viteConfigPath, "utf-8");
      if (!viteConfig.includes("@vizejs/vite-plugin")) {
        viteConfig = viteConfig.replace(
          "import pluginVue from '@vitejs/plugin-vue';",
          "import { vize as pluginVue } from '@vizejs/vite-plugin';",
        );
        fs.writeFileSync(viteConfigPath, viteConfig);
      }
    },
    async setupPage(page) {
      // Mock misskey backend API and assets at JS level
      await page.addInitScript(() => {
        const _origFetch = window.fetch;
        window.fetch = function (input, init) {
          const url =
            typeof input === "string"
              ? input
              : input instanceof URL
                ? input.toString()
                : input.url;
          if (url.includes("/api/")) {
            let body = "{}";
            if (url.includes("/api/meta")) {
              body = JSON.stringify({
                name: "Misskey",
                uri: "http://localhost:3000",
                version: "2024.11.0",
                description: "A Misskey instance",
                disableRegistration: false,
                federation: "all",
                iconUrl: null,
                backgroundImageUrl: null,
                defaultDarkTheme: null,
                defaultLightTheme: null,
                clientOptions: {},
                policies: { ltlAvailable: true, gtlAvailable: true },
                maxNoteTextLength: 3000,
                features: {
                  registration: true,
                  localTimeline: true,
                  globalTimeline: true,
                  miauth: true,
                },
              });
            } else if (url.includes("/api/emojis")) {
              body = JSON.stringify({ emojis: [] });
            }
            return Promise.resolve(
              new Response(body, {
                status: 200,
                headers: { "Content-Type": "application/json" },
              }),
            );
          }
          // Locale JSON files (not available in dev mode)
          if (url.includes("/assets/locales/")) {
            return Promise.resolve(
              new Response(JSON.stringify({}), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              }),
            );
          }
          return _origFetch.call(window, input, init);
        } as typeof window.fetch;
      });
    },
    canon: {
      cwd: path.join(E2E_DIR, "misskey", "packages", "frontend"),
      patterns: ["src/**/*.vue"],
    },
  },
  {
    name: "npmx.dev",
    cwd: path.join(E2E_DIR, "npmx.dev"),
    command: "npx",
    args: ["pnpm@10", "exec", "nuxt", "dev", "--port", "3001"],
    port: 3001,
    url: "http://127.0.0.1:3001",
    mountSelector: "#__nuxt",
    readyPattern: /Local:\s+http:\/\/(localhost|127\.0\.0\.1):3001/,
    // Nuxt SSR may return non-200 during initial dev compilation
    allowNon200: true,
    // Nuxt SSR dev server never reaches networkidle due to continuous HMR/module requests
    waitUntil: "load",
    // Nuxt announces URL before Nitro finishes building; wait extra for SSR readiness
    readyDelay: 15_000,
    env: {
      // Required by npmx.dev for session management
      NUXT_SESSION_PASSWORD: "e2e-test-dummy-session-password-32chars!",
    },
    startupTimeout: 120_000,
    setup() {
      const nmDir = path.join(E2E_DIR, "npmx.dev", "node_modules");
      createVizeSymlinks(nmDir);
      patchNuxtConfig(path.join(E2E_DIR, "npmx.dev", "nuxt.config.ts"));
      // Hoist transitive deps hidden by pnpm strict hoisting (needed by Nuxt SSR)
      hoistPnpmPackage(nmDir, "vue-i18n");
    },
    canon: {
      cwd: path.join(E2E_DIR, "npmx.dev"),
      patterns: ["app/**/*.vue"],
    },
  },
];

function waitForServerReady(
  proc: ChildProcess,
  port: number,
  readyPattern: RegExp,
  timeout: number,
  readyDelay?: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeout;
    let resolved = false;
    let processExited = false;
    let exitCode: number | null = null;

    function checkDone() {
      if (resolved) return;
      resolved = true;
      resolve();
    }

    function checkFailed(reason: string) {
      if (resolved) return;
      resolved = true;
      reject(new Error(reason));
    }

    // Watch stdout/stderr for ready pattern (strip ANSI codes before matching)
    const stripAnsi = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, "");
    const onData = (data: Buffer) => {
      const text = stripAnsi(data.toString());
      if (readyPattern.test(text)) {
        // Give a delay for the server to fully initialize
        // Nuxt SSR needs extra time for Nitro to finish building
        setTimeout(checkDone, readyDelay ?? 1000);
      }
    };
    proc.stdout?.on("data", onData);
    proc.stderr?.on("data", onData);

    // Watch for process exit (server crashed)
    proc.on("exit", (code) => {
      processExited = true;
      exitCode = code;
      checkFailed(`Dev server process exited with code ${code} before becoming ready`);
    });

    // Also try TCP connection as backup
    function attemptTcp() {
      if (resolved || processExited) return;
      if (Date.now() > deadline) {
        checkFailed(`Server did not become ready within ${timeout}ms (port ${port})`);
        return;
      }
      const socket = createConnection({ port, host: "127.0.0.1" }, () => {
        socket.destroy();
        checkDone();
      });
      socket.on("error", () => {
        socket.destroy();
        setTimeout(attemptTcp, 2000);
      });
    }

    // Start TCP probing after a short delay
    setTimeout(attemptTcp, 3000);
  });
}

function startDevServer(app: AppConfig): ChildProcess {
  const env = {
    ...process.env,
    PATH: `${VITE_PLUS_BIN}:${process.env.PATH}`,
    NODE_ENV: "development",
    BROWSER: "none",
    ...app.env,
  };

  const proc = spawn(app.command, app.args, {
    cwd: app.cwd,
    env,
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
  });

  proc.stdout?.on("data", (data: Buffer) => {
    const line = data.toString().trim();
    if (line) console.log(`[${app.name}:stdout] ${line}`);
  });

  proc.stderr?.on("data", (data: Buffer) => {
    const line = data.toString().trim();
    if (line) console.log(`[${app.name}:stderr] ${line}`);
  });

  return proc;
}

function killProcess(proc: ChildProcess): void {
  if (proc.pid) {
    try {
      process.kill(-proc.pid, "SIGTERM");
    } catch {
      try {
        proc.kill("SIGTERM");
      } catch {
        // already dead
      }
    }
  }
}

async function collectConsoleErrors(
  page: Page,
  appName: string,
): Promise<string[]> {
  const errors: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      errors.push(text);
      console.log(`[${appName}:console:error] ${text}`);
    }
  });

  page.on("pageerror", (err) => {
    errors.push(err.message);
    console.log(`[${appName}:pageerror] ${err.message}`);
  });

  return errors;
}

function isFatalError(error: string): boolean {
  const fatalPatterns = [
    /Failed to resolve component/,
    /\[Vue warn\].*is not a function/,
    /Cannot read propert/,
    /Uncaught TypeError/,
    /Uncaught ReferenceError/,
    /Uncaught SyntaxError/,
    /Failed to fetch dynamically imported module/,
    /ChunkLoadError/,
  ];
  // Exclude known non-fatal errors
  const ignorePatterns = [
    /Failed to load resource/,   // Network errors (missing backend)
    /net::ERR_/,                 // Network errors
    /ECONNREFUSED/,              // Backend not running
    /is not defined.*\$pinia/,   // Pinia not initialized (no backend)
  ];
  if (ignorePatterns.some((p) => p.test(error))) return false;
  return fatalPatterns.some((p) => p.test(error));
}

// Ensure screenshot directory exists
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

for (const app of apps) {
  test.describe(app.name, () => {
    let devServer: ChildProcess;

    test.beforeAll(async () => {
      // Run setup if needed
      if (app.setup) {
        app.setup();
      }

      console.log(`Starting dev server for ${app.name}...`);
      devServer = startDevServer(app);

      devServer.on("exit", (code) => {
        console.log(`[${app.name}] dev server exited with code ${code}`);
      });

      console.log(`Waiting for ${app.name} server to be ready (port ${app.port})...`);
      await waitForServerReady(devServer, app.port, app.readyPattern, app.startupTimeout, app.readyDelay);
      console.log(`${app.name} server is ready`);
    });

    test.afterAll(async () => {
      console.log(`Stopping dev server for ${app.name}...`);
      killProcess(devServer);
      // Give a moment for cleanup
      await new Promise((r) => setTimeout(r, 2000));
    });

    if (app.noHtmlFallback) {
      // For apps like misskey that don't serve HTML from Vite dev server alone,
      // just verify the server is responding
      test("dev server responds", async ({ request }) => {
        const response = await request.get(app.url);
        // Vite dev server should at least respond (might be 404 for missing index.html)
        expect(response.status()).toBeLessThan(500);
        console.log(`${app.name}: server responded with status ${response.status()}`);
      });
    } else {
      test("page renders without fatal errors", async ({ page }) => {
        const errors = await collectConsoleErrors(page, app.name);

        // Set consistent viewport for screenshots
        await page.setViewportSize({ width: 1280, height: 720 });

        if (app.setupPage) {
          console.log(`${app.name}: [step] setupPage`);
          await app.setupPage(page);
        }

        console.log(`${app.name}: [step] goto ${app.url}`);
        const response = await page.goto(app.url, {
          waitUntil: app.waitUntil ?? "networkidle",
          timeout: 30_000,
        });
        console.log(`${app.name}: [step] goto done, status=${response?.status()}`);

        if (app.allowNon200) {
          expect(response?.status()).toBeDefined();
        } else {
          expect(response?.status()).toBe(200);
        }

        // Page is not blank
        const bodyContent = await page.locator("body").innerHTML();
        expect(bodyContent.trim().length).toBeGreaterThan(0);
        console.log(`${app.name}: [step] body not blank`);

        // Mount element exists
        const mountEl = page.locator(app.mountSelector);
        await expect(mountEl).toBeAttached({ timeout: 15_000 });
        console.log(`${app.name}: [step] mount element attached`);

        // Wait for visible text to appear (Vue app rendering)
        try {
          await page.waitForFunction(
            (sel: string) => {
              const el = document.querySelector(sel);
              return el !== null && (el.textContent ?? "").trim().length > 0;
            },
            app.mountSelector,
            { timeout: 10_000 },
          );
          console.log(`${app.name}: [step] text content rendered`);
        } catch {
          console.log(`${app.name}: [step] no text content after 10s`);
        }

        // Wait for rendering to stabilize (CSS animations, lazy content)
        await page.waitForTimeout(2_000);

        // Take viewport screenshot
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `${app.name}.png`),
        });
        console.log(`${app.name}: [step] screenshot saved`);

        // Check for fatal console errors (soft check for apps without backend)
        const fatalErrors = errors.filter(isFatalError);
        if (fatalErrors.length > 0) {
          console.log(`Fatal errors in ${app.name}:`, fatalErrors);
        }
        if (!app.allowNon200) {
          expect(fatalErrors).toHaveLength(0);
        }
      });
    }

    if (app.canon) {
      const canonConfig = app.canon;
      test("canon: vize check does not crash", () => {
        const hasVize = fs.existsSync(VIZE_BIN);
        const hasTsgo = fs.existsSync(TSGO_BIN);
        if (!hasVize || !hasTsgo) {
          console.log(
            `Skipping canon test for ${app.name}: vize=${hasVize}, tsgo=${hasTsgo}`,
          );
          test.skip();
        }

        const patterns = canonConfig.patterns.map((p) => `'${p}'`).join(" ");
        const cmd = `${VIZE_BIN} check ${patterns} --format json --quiet --tsgo-path '${TSGO_BIN}'`;
        console.log(`Running canon for ${app.name}: ${cmd}`);

        let stdout: string;
        try {
          stdout = execSync(cmd, {
            cwd: canonConfig.cwd,
            timeout: 120_000,
            maxBuffer: 100 * 1024 * 1024,
          }).toString();
        } catch (e: any) {
          // --format json always exits 0 currently; exit code 1 means type errors
          // (output is still valid JSON). Any other exit code is a crash.
          if (e.status === 1 && e.stdout) {
            stdout = e.stdout.toString();
          } else {
            throw new Error(
              `vize check crashed for ${app.name} (exit code ${e.status}): ${e.stderr?.toString()}`,
            );
          }
        }

        const result = JSON.parse(stdout);
        console.log(
          `Canon ${app.name}: fileCount=${result.fileCount}, errorCount=${result.errorCount}`,
        );
        expect(result.fileCount).toBeGreaterThan(0);
      });
    }
  });
}
