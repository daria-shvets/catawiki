import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ExistingUserData } from "@test-data/user-data";
import { getEnvVar } from "../utils/env";

const { email } = ExistingUserData.validSignIn;
const password = getEnvVar("TEST_USER_PASSWORD");

export class SignInPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly sigInButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByRole("textbox", { name: "Email address" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.sigInButton = page.getByRole("button", {
      name: "Sign in",
    });
  }

  async fillOutUserDetails() {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async clickSignInButton() {
    await this.sigInButton.click();
  }
}
