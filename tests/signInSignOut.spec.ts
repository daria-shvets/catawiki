import { test, expect } from "@playwright/test";
import { HomePage } from "@pages/HomePage";
import { SignInPage } from "@pages/SignInPage";

// skipping beacause Catawiki's bot protection requires human interaction to complete login
test.skip("user should be able to sign in and sign out", async ({ page }) => {
  const homePage = new HomePage(page);
  const signInPage = new SignInPage(page);

  await test.step("Navigate to Catawiki homepage", async () => {
    await homePage.goto();
  });

  await test.step("Click 'Sign in'", async () => {
    await homePage.clickSignInButton();
  });

  await test.step("Fill out user data", async () => {
    await signInPage.fillOutUserDetails();
  });

  await test.step("Click 'Sign in'", async () => {
    await signInPage.clickSignInButton();
  });

  await test.step("Verify user is logged in", async () => {
    await expect(page.getByTestId("display-username")).toBeVisible({
      timeout: 15000,
    });

    await test.step("Click user profile", async () => {
      await homePage.clickProfileButton();
    });

    await test.step("Click 'Sign out", async () => {
      await homePage.clickSignOutButton();
    });

    await test.step("Verify user is logged out", async () => {
      await expect(
        page.locator("header.c-header").getByRole("button", { name: "Sign in" })
      ).toBeVisible();
    });
  });
});
