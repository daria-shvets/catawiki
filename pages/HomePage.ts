import { Locator, Page } from "@playwright/test";
import { HeaderPage } from "./HeaderPage";

export class HomePage extends HeaderPage {
  readonly createAccountButton: Locator;

  constructor(page: Page) {
    super(page);
    this.createAccountButton = page.getByRole("button", {
      name: "Create account",
    });
  }

  async clickCreateAccountButton() {
    await this.createAccountButton.click();
  }
}
