import { test, expect } from "@playwright/test";
import { HomePage } from "@pages/HomePage";
import { SignUpPage } from "@pages/SignUpPage";

// skipping the test not to pollute the DB with test data
test.skip("user should be able to sign up", async ({ page }) => {
  const homePage = new HomePage(page);
  const signUpPage = new SignUpPage(page);

  await test.step("1. Navigate to Catawiki homepage", async () => {
    await homePage.goto("/en");
  });

  await test.step("2. Click 'Create account'", async () => {
    await homePage.clickCreateAccountButton();
  });

  await test.step("3. Fill out user data", async () => {
    await signUpPage.fillOutUserDetails();
  });

  await test.step("4. Click 'Agree and continue'", async () => {
    await signUpPage.clickContiunueButton();
  });

  await test.step("5. Verify user is logged in'", async () => {
    await expect(page.getByTestId("display-username")).toBeVisible();
  });
});
