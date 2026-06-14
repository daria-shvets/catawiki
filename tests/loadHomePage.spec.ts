import { test, expect } from "@playwright/test";
import { HomePage } from "@pages/HomePage";

test("home page should load", async ({ page }) => {
  const homePage = new HomePage(page);

  await test.step("navigate to Catawiki homepage", async () => {
    await homePage.goto();
  });

  await test.step("verify category navigation is visible and clickable", async () => {
    await expect.soft(homePage.navigation).toBeVisible({ timeout: 10000 });
    await expect.soft(homePage.navigation).toBeEnabled();
  });

  await test.step("verify search bar is visible", async () => {
    await expect.soft(homePage.searchInput).toBeVisible();
    await expect.soft(homePage.searchInput).toBeEnabled();
  });

  await test.step("verify home page content is visible", async () => {
    await expect.soft(homePage.homePageContent).toBeVisible();
  });
});
