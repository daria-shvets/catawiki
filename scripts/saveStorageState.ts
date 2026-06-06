import { chromium } from "@playwright/test";

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://www.catawiki.com/en");

  // pause here — log in manually and accept cookie banner
  await page.pause();

  // saves authenticated session
  await context.storageState({ path: ".auth/user.json" });

  // saves cookie consent
  await context.storageState({ path: ".auth/cookies.json" });

  await browser.close();
})();
