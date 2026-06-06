import { test } from "@playwright/test";
import { HomePage } from "@pages/HomePage";
import { LotPage } from "@pages/LotPage";
import { SearchResultsPage } from "@pages/SearchResultsPage";

test("should open lot page and log information", async ({ page }) => {
  const homePage = new HomePage(page);
  const searchResultsPage = new SearchResultsPage(page);
  const lotPage = new LotPage(page);

  await test.step("1. Navigate to Catawiki homepage", async () => {
    await homePage.goto("/en");
  });

  await test.step("2. Search for 'train'", async () => {
    await homePage.searchForItem("train");
  });

  await test.step("3. Verify search results page is opened", async () => {
    await searchResultsPage.verifySearchPageLoaded();
  });

  await test.step("4. Click on the second lot", async () => {
    await searchResultsPage.clickLot(2);
  });

  await test.step("5. Verify lot page is opened", async () => {
    await lotPage.verifyLotPageLoaded();
  });

  await test.step("6. Log lot name, favourites count and current bid", async () => {
    await lotPage.logLotName();
    await lotPage.logFavouriteButtonCount();
    await lotPage.logCurrentBid();
  });
});
