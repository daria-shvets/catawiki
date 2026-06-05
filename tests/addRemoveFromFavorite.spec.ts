import { test, expect } from "@playwright/test";
import { HomePage } from "@pages/HomePage";
import { LotPage } from "@pages/LotPage";
import { SearchResultsPage } from "@pages/SearchResultsPage";
import { removeAllFavourites } from "@utils/apiHelpers";
import { FavoritePage } from "@pages/FavoritePage";

test.use({ storageState: ".auth/user.json" });

// doing cleanup before the test - removing all lots added to favorite
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext({
    storageState: ".auth/user.json",
  });
  const request = context.request;
  await removeAllFavourites(request);
  await context.close();
});

test("user should be able to add and remove lot from favorite", async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const searchResultsPage = new SearchResultsPage(page);
  const lotPage = new LotPage(page);
  const favoritePage = new FavoritePage(page);

  await test.step("1. Open lot page", async () => {
    await homePage.goto("/en");
    await homePage.searchForItem("book");
    await searchResultsPage.clickLot(1);
  });

  await test.step("2. Add lot to favorite", async () => {
    await lotPage.clickFavoriteButton();
    await favoritePage.goto();
    const countAfterAddingToFavorite =
      await favoritePage.getFavoriteLotsCount();
    expect(countAfterAddingToFavorite).toBe(1);
  });

  await test.step("3. Remove lot from favorite", async () => {
    await favoritePage.clickFavoriteButton();
    await page.reload();
    const countAfterRemovingFromFavorite =
      await favoritePage.getFavoriteLotsCount();
    expect(countAfterRemovingFromFavorite).toBe(0);
  });
});
