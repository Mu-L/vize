import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "smoke.spec.ts",
  // Exclude submodule directories that contain their own playwright configs
  testIgnore: ["**/npmx.dev/**", "**/elk/**", "**/misskey/**", "**/directus/**"],
  timeout: 120_000,
  expect: { timeout: 30_000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    headless: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  outputDir: "e2e/results",
});
