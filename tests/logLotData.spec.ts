import { test, expect } from "@playwright/test";
import { HomePage } from "@pages/HomePage";
import { LotPage } from "@pages/LotPage";
import { SearchResultsPage } from "@pages/SearchResultsPage";
import { searchTerms } from "@test-data/testData";

test("should open lot page and log information", async ({ page }) => {
  const homePage = new HomePage(page);
  const searchResultsPage = new SearchResultsPage(page);
  const lotPage = new LotPage(page);

  await test.step("navigate to Catawiki homepage", async () => {
    await homePage.goto();
  });

  await test.step("search for 'train'", async () => {
    await homePage.searchForItem(searchTerms.train);
  });

  await test.step("verify search results page is opened", async () => {
    await expect(searchResultsPage.searchPageTestId).toBeVisible();
  });

  await test.step("click on the second lot", async () => {
    await searchResultsPage.clickLot(1);
  });

  await test.step("verify lot page is opened", async () => {
    await expect(lotPage.bidSection).toBeVisible();
    await expect(lotPage.lotName).toBeVisible();
    await expect(lotPage.lotGallery).toBeVisible({ timeout: 10000 });
    await expect(lotPage.placeBidButton).toBeVisible({ timeout: 10000 });
    await expect(lotPage.placeBidButton).toBeEnabled();
    await expect(lotPage.favouriteButton).toBeVisible({ timeout: 10000 });
    await expect(lotPage.favouriteButton).toBeEnabled();
  });

  await test.step("log lot name, favourites count and current bid", async () => {
    await lotPage.logLotName();
    await lotPage.logFavouriteButtonCount();
    await lotPage.logCurrentBid();
  });
});
