import { Locator, Page, expect } from "@playwright/test";
import { HeaderPage } from "./HeaderPage";

const HOME_PAGE_ROUTE = "/en";

export class HomePage extends HeaderPage {
  static readonly route = HOME_PAGE_ROUTE;
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

  async verifyCategoryNavigationLoaded() {
    await expect(this.navigation).toBeVisible({ timeout: 10000 });
    await expect(this.navigation).toBeEnabled();
  }

  async verifyHomePageContentLoaded() {
    await expect(this.homePageContent).toBeVisible();
  }
}
