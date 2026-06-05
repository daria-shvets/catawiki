import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: "html",
  timeout: 60000,
  use: {
    baseURL: "https://www.catawiki.com",
    trace: "on-first-retry",
    headless: false, // required — Catawiki blocks headless browsers
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], storageState: ".auth/cookies.json" },
    },
  ],
});
