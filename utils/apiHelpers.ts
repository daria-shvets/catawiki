import { APIRequestContext, BrowserContext } from "@playwright/test";

export async function removeAllFavourites(
  request: APIRequestContext,
  context: BrowserContext
) {
  const page = await context.newPage();
  await page.goto("https://www.catawiki.com/en");

  const cookies = await context.cookies("https://www.catawiki.com");
  const csrfToken =
    cookies.find((c) => c.name === "x-s-csrf-token")?.value ?? "";

  await page.close();

  const response = await request.get(
    "https://www.catawiki.com/buyer/api/v3/users/me/interests/lots?page=1&per_page=96&filter=favorites&status=all"
  );

  if (!response.ok()) {
    console.error(`Failed to fetch favourites: ${response.status()}`);
    return;
  }

  const data = await response.json();

  await Promise.all(
    data.lots.map(async (lot: { id: number }) => {
      const deleteResponse = await request.delete(
        `https://www.catawiki.com/buyer/api/v1/users/me/interests/lots/${lot.id}`,
        { headers: { "x-s-csrf-token": csrfToken } }
      );

      if (!deleteResponse.ok()) {
        throw new Error(
          `Failed to delete lot ${lot.id}: ${deleteResponse.status()}`
        );
      }
      console.log(`Deleted lot ${lot.id}: ${deleteResponse.status()}`);
    })
  );
}
