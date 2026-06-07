import { Page, Locator } from "@playwright/test";
import { HeaderPage } from "./HeaderPage";

const FAVOURITE_PAGE_ROUTE = "/en/interests/objects";

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
    await this.page.goto(FAVOURITE_PAGE_ROUTE);
  }

  async clickFavouriteButton() {
    await this.favouriteButton.click();
  }
}
