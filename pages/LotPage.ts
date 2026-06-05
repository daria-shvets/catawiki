import { Page, Locator, expect } from "@playwright/test";
import { HeaderPage } from "./HeaderPage";

export class LotPage extends HeaderPage {
  readonly bidSection: Locator;
  readonly lotName: Locator;
  readonly favoriteButton: Locator;
  readonly currentBid: Locator;

  constructor(page: Page) {
    super(page);
    this.bidSection = page.getByTestId("lot-bid-status-section");
    this.lotName = page.getByRole("heading", { level: 1 });
    this.favoriteButton = page.getByTitle("favourite").first();
    this.currentBid = page.getByText(/€ \d+/).first();
  }

  async verifyLotPageLoaded() {
    await expect(this.bidSection).toBeVisible();
    await expect(this.lotName).toBeVisible();
  }

  async logLotName() {
    const lotName = await this.lotName.innerText();
    console.log("Lot name: " + lotName);
  }

  async logFavouriteButtonCount() {
    const favouriteCount = await this.favoriteButton.innerText();
    console.log("Favourite button count: " + favouriteCount);
  }

  async logCurrentBid() {
    const bidAmount = await this.currentBid.innerText();
    console.log("Current bid: ", bidAmount);
  }

  async clickFavoriteButton() {
    await this.favoriteButton.click();
  }
}
