import { Locator, Page } from "@playwright/test";
import { HeaderPage } from "./HeaderPage";

const HOME_PAGE_ROUTE = "/en";

export class HomePage extends HeaderPage {
  readonly createAccountButton: Locator;
  readonly navigation: Locator;
  readonly homePageContent: Locator;

  constructor(page: Page) {
    super(page);
    this.createAccountButton = page.getByRole("button", {
      name: "Create account",
    });
    this.navigation = page
      .locator("[class^='FeedAndCategoryNavigation']")
      .filter({ hasText: "This weekFor" });
    this.homePageContent = page.locator(
      "[data-sentry-component='HomeMainContent']"
    );
  }

  async goto() {
    await super.goto(HOME_PAGE_ROUTE);
  }

  async clickCreateAccountButton() {
    await this.createAccountButton.click();
  }
}
