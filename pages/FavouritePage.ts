import { Page, Locator } from "@playwright/test";
import { HeaderPage } from "./HeaderPage";

export class FavouritePage extends HeaderPage {
  readonly lotContainer: Locator;
  readonly favouriteButton: Locator;

  constructor(page: Page) {
    super(page);
    this.lotContainer = page.locator('[data-testid^="lot-card-container"]');
    this.favouriteButton = page.getByTestId("lot-card-favorite-button").first();
  }

  async getFavouriteLotsCount() {
    return this.lotContainer.count();
  }

  async goto() {
    await this.page.goto("/en/interests/objects");
  }

  async clickFavouriteButton() {
    await this.favouriteButton.click();
  }
}
