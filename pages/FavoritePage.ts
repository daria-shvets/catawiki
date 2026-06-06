import { Page, Locator } from "@playwright/test";
import { HeaderPage } from "./HeaderPage";

export class FavoritePage extends HeaderPage {
  readonly lotContainer: Locator;
  readonly favoriteButton: Locator;

  constructor(page: Page) {
    super(page);
    this.lotContainer = page.locator('[data-testid^="lot-card-container"]');
    this.favoriteButton = page.getByTitle("favourite").first();
  }

  async getFavoriteLotsCount() {
    return this.lotContainer.count();
  }

  async goto() {
    await this.page.goto("/en/interests/objects");
  }

  async clickFavoriteButton() {
    await this.favoriteButton.click();
  }
}
