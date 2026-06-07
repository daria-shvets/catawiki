import { Page, Locator } from "@playwright/test";
import { HeaderPage } from "./HeaderPage";

export class LotPage extends HeaderPage {
  readonly bidSection: Locator;
  readonly lotName: Locator;
  readonly favouriteButton: Locator;
  readonly currentBid: Locator;
  readonly lotGallery: Locator;
  readonly placeBidButton: Locator;

  constructor(page: Page) {
    super(page);
    this.bidSection = page.getByTestId("lot-bid-status-section");
    this.lotName = page.getByRole("heading", { level: 1 });
    this.favouriteButton = page.locator(
      "[data-sentry-component='LotDetailsFavoriteButton'] button"
    );
    this.currentBid = page
      .getByTestId("lot-bid-status-section")
      .locator("[data-sentry-component='Amount']");
    this.lotGallery = page.locator("[data-sentry-component='DesktopGallery']");
    this.placeBidButton = page
      .getByRole("button", { name: "Place bid" })
      .first();
  }

  async logLotName() {
    const lotName = await this.lotName.innerText();
    console.log("Lot name: " + lotName);
  }

  async logFavouriteButtonCount() {
    const favouriteCount = await this.favouriteButton.innerText();
    console.log("Favourite button count: " + favouriteCount);
  }

  async logCurrentBid() {
    const bidAmount = await this.currentBid.innerText();
    console.log("Current bid: ", bidAmount);
  }

  async clickFavouriteButton() {
    await this.favouriteButton.click();
  }
}
