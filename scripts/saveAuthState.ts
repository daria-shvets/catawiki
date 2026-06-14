import { chromium } from "@playwright/test";
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://www.catawiki.com/en");

  // we have to pause here to log in manually to bypass headless browser detection
  await page.pause();

  // save auth state
  await context.storageState({ path: ".auth/user.json" });

  await browser.close();
})();
