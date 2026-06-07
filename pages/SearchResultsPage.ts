import { Page, Locator } from "@playwright/test";
import { HeaderPage } from "./HeaderPage";

export class SearchResultsPage extends HeaderPage {
  readonly lotCard: Locator;
  readonly searchPageTestId: Locator;

  constructor(page: Page) {
    super(page);
    this.lotCard = page.locator('[data-testid^="lot-card-container"]');
    this.searchPageTestId = page.getByTestId("SearchResults");
  }

  async clickLot(lotIndex: number) {
    await this.lotCard.nth(lotIndex).click();
  }
}
