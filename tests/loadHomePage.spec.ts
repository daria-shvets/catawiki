import { test, expect } from "@playwright/test";
import { HomePage } from "@pages/HomePage";

test("home page should load", async ({ page }) => {
  const homePage = new HomePage(page);

  await test.step("Navigate to Catawiki homepage", async () => {
    await homePage.goto("/en");
  });

  await test.step("Verify category navigation is visible and clickable", async () => {
    const navigation = page
      .locator("[class^='FeedAndCategoryNavigation']")
      .filter({ hasText: "This weekFor" });
    await expect(navigation).toBeVisible();
    await expect(navigation).toBeEnabled();
  });

  await test.step("Verify search bar is visible", async () => {
    await expect(
      page.locator("header.c-header .c-search-field").first()
    ).toBeVisible();
    await expect(
      page.locator("header.c-header .c-search-field").first()
    ).toBeEnabled();
  });

  await test.step("Verify home page content is visible'", async () => {
    await expect(
      page.locator("[data-sentry-component='HomeMainContent']")
    ).toBeVisible();
  });
});
