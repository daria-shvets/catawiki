import { test, expect } from "@playwright/test";
import { HomePage } from "@pages/HomePage";
import { SignInPage } from "@pages/SignInPage";

test("user should be able to sign in and sign out", async ({ page }) => {
  const homePage = new HomePage(page);
  const signInPage = new SignInPage(page);

  await test.step("1. Navigate to Catawiki homepage", async () => {
    await homePage.goto("/en");
  });

  await test.step("2. Click 'Sign in'", async () => {
    await homePage.clickSignInButton();
  });

  await test.step("3. Fill out user data", async () => {
    await signInPage.fillOutUserDetails();
  });

  await test.step("4. Click 'Sign in'", async () => {
    await signInPage.clickSignInButton();
  });

  await test.step("5. Verify user is logged in'", async () => {
    await expect(page.getByTestId("display-username")).toBeVisible({
      timeout: 15000,
    });

    await test.step("6. Click user profile", async () => {
      await homePage.clickProfileButton();
    });

    await test.step("7. Click 'Sign out", async () => {
      await homePage.clickSignOutButton();
    });

    await test.step("8. Verify user is logged out", async () => {
      await expect(
        page
          .locator("header.c-header")
          .getByRole("button", { name: "Sign in" }),
      ).toBeVisible();
    });
  });
});
