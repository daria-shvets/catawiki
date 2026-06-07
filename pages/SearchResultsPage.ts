import { Page, Locator, expect } from "@playwright/test";
import { HeaderPage } from "./HeaderPage";

export class SearchResultsPage extends HeaderPage {
  readonly lotCard: Locator;
  readonly searchPageTestId: Locator;

  constructor(page: Page) {
    super(page);
    this.lotCard = page.locator('[data-testid^="lot-card-container"]');
    this.searchPageTestId = page.getByTestId("SearchResults");
  }

  async verifySearchPageLoaded() {
    await expect(this.searchPageTestId).toBeVisible();
  }

  async clickLot(lotNumber: number) {
    await this.lotCard.nth(lotNumber).click();
  }
}
