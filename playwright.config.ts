import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/docs",
  fullyParallel: true,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:4173${process.env.DOCS_BASE ?? "/"}`,
    trace: "retain-on-failure",
    launchOptions: { executablePath: process.env.DOCS_CHROMIUM_PATH },
  },
  webServer: {
    command: "npm run preview -w @polli/preview -- --port 4173",
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
