import { APIRequestContext } from "@playwright/test";

export async function removeAllFavourites(request: APIRequestContext) {
  const response = await request.get(
    "https://www.catawiki.com/buyer/api/v3/users/me/interests/lots?page=1&per_page=96&filter=favorites&status=all"
  );

  if (!response.ok()) {
    console.error(`Failed to fetch favourites: ${response.status()}`);
    return;
  }

  const data = await response.json();

  for (const lot of data.lots) {
    const deleteResponse = await request.delete(
      `https://www.catawiki.com/buyer/api/v1/users/me/interests/lots/${lot.id}`
    );
    console.log(`Deleted lot ${lot.id}: ${deleteResponse.status()}`);
  }
}
