import { test, expect } from "@playwright/test";
import { HomePage } from "@pages/HomePage";
import { SignUpPage } from "@pages/SignUpPage";

// skipping the test not to pollute the DB with test data
test.skip("user should be able to sign up", async ({ page }) => {
  const homePage = new HomePage(page);
  const signUpPage = new SignUpPage(page);

  await test.step("Navigate to Catawiki homepage", async () => {
    await homePage.goto();
  });

  await test.step("Click 'Create account'", async () => {
    await homePage.clickCreateAccountButton();
  });

  await test.step("Fill out user data", async () => {
    await signUpPage.fillOutUserDetails();
  });

  await test.step("Click 'Agree and continue'", async () => {
    await signUpPage.clickContinueButton();
  });

  await test.step("Verify user is logged in", async () => {
    await expect(page.getByTestId("display-username")).toBeVisible();
  });
});
