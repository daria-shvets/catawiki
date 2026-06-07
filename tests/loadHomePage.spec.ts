import { test, expect } from "@playwright/test";
import { HomePage } from "@pages/HomePage";

test("home page should load", async ({ page }) => {
  const homePage = new HomePage(page);

  await test.step("Navigate to Catawiki homepage", async () => {
    await homePage.goto();
  });

  await test.step("Verify category navigation is visible and clickable", async () => {
    await expect(homePage.navigation).toBeVisible({ timeout: 10000 });
    await expect(homePage.navigation).toBeEnabled();
  });

  await test.step("Verify search bar is visible", async () => {
    await expect(homePage.searchInput).toBeVisible();
    await expect(homePage.searchInput).toBeEnabled();
  });

  await test.step("Verify home page content is visible'", async () => {
    await expect(homePage.homePageContent).toBeVisible();
  });
});
