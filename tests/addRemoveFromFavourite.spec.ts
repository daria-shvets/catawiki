import { test, expect } from "@playwright/test";
import { HomePage } from "@pages/HomePage";
import { LotPage } from "@pages/LotPage";
import { SearchResultsPage } from "@pages/SearchResultsPage";
import { removeAllFavourites } from "@utils/apiHelpers";
import { FavouritePage } from "@pages/FavouritePage";

test.use({ storageState: ".auth/user.json" });

// doing cleanup before the test - removing all lots added to favourite
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext({ storageState: ".auth/user.json" });
  await removeAllFavourites(context.request, context);
  await context.close();
});

test("user should be able to add and remove lot from favourite", async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const searchResultsPage = new SearchResultsPage(page);
  const lotPage = new LotPage(page);
  const favouritePage = new FavouritePage(page);

  await test.step("Open lot page", async () => {
    await homePage.goto("/en");
    await homePage.searchForItem("book");
    await searchResultsPage.clickLot(1);
  });

  await test.step("Add lot to favourite", async () => {
    await lotPage.clickFavouriteButton();
    await favouritePage.goto();
    const countAfterAddingToFavourite =
      await favouritePage.getFavouriteLotsCount();
    expect(countAfterAddingToFavourite).toBe(1);
  });

  await test.step("Remove lot from favourite", async () => {
    await favouritePage.clickFavouriteButton();
    await page.reload();
    const countAfterRemovingFromFavourite =
      await favouritePage.getFavouriteLotsCount();
    expect(countAfterRemovingFromFavourite).toBe(0);
  });
});
