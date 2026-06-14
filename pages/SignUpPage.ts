import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { userSignUpData } from "@test-data/userData";
import { getEnvVar } from "@utils/env";

const { firstName } = userSignUpData.validSignUp;
const { lastName } = userSignUpData.validSignUp;
const { email } = userSignUpData.validSignUp;
const password = getEnvVar("TEST_USER_PASSWORD");

export class SignUpPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly agreeAndContinueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByRole("textbox", { name: "First name" });
    this.lastNameInput = page.getByRole("textbox", { name: "Last name" });
    this.emailInput = page.getByRole("textbox", { name: "Email address" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.agreeAndContinueButton = page.getByRole("button", {
      name: "Agree and continue",
    });
  }

  async fillOutUserDetails() {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async clickContinueButton() {
    await this.agreeAndContinueButton.click();
  }
}
