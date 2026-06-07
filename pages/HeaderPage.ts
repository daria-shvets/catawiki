import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HeaderPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly signInButton: Locator;
  readonly signOutButton: Locator;
  readonly profileButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByRole("combobox", {
      name: "Search for brand, model,",
    });
    this.searchButton = page.getByRole("button", { name: "Search" });
    this.signInButton = page
      .locator("header.c-header")
      .getByRole("button", { name: "Sign in" });
    this.signOutButton = page.getByRole("button", { name: "Sign out" });
    this.profileButton = page.getByTestId("display-username");
  }

  async searchForItem(itemName: string) {
    await this.searchInput.fill(itemName);
    await this.searchButton.click();
  }

  async clickSignInButton() {
    await this.signInButton.click();
  }

  async clickProfileButton() {
    await this.profileButton.click();
  }

  async clickSignOutButton() {
    await this.signOutButton.click();
  }

  async verifySearchLoaded() {
    await expect(this.searchInput).toBeVisible();
    await expect(this.searchInput).toBeEnabled();
  }
}
