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
    channel: "chrome",
    baseURL: "https://www.catawiki.com",
    trace: "on-first-retry",
    headless: true,
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chrome",
      use: { ...devices["Desktop Chrome"], storageState: ".auth/cookies.json" },
    },
  ],
});
