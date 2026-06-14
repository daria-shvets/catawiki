import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { existingUserData } from "@test-data/userData";
import { getEnvVar } from "@utils/env";

const { email } = existingUserData.validSignIn;
const password = getEnvVar("TEST_USER_PASSWORD");

export class SignInPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByRole("textbox", { name: "Email address" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.signInButton = page.getByRole("button", {
      name: "Sign in",
    });
  }

  async fillOutUserDetails() {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async clickSignInButton() {
    await this.signInButton.click();
  }
}
