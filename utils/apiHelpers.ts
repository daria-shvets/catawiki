import { BrowserContext } from "@playwright/test";

export async function removeAllFavourites(context: BrowserContext) {
  const page = await context.newPage();
  await page.goto("https://www.catawiki.com/en");

  const cookies = await context.cookies("https://www.catawiki.com");
  const csrfToken =
    cookies.find((c) => c.name === "x-s-csrf-token")?.value ?? "";

  const data = await page.evaluate(async (url) => {
    const response = await fetch(url, { credentials: "include" });
    if (!response.ok) {
      throw new Error(`Failed to fetch favourites: ${response.status}`);
    }
    return response.json();
  }, "https://www.catawiki.com/buyer/api/v3/users/me/interests/lots?page=1&per_page=96&filter=favorites&status=all");

  await Promise.all(
    data.lots.map(async (lot: { id: number }) => {
      const status = await page.evaluate(
        async ({ id, token }) => {
          const response = await fetch(
            `https://www.catawiki.com/buyer/api/v1/users/me/interests/lots/${id}`,
            {
              method: "DELETE",
              credentials: "include",
              headers: { "x-s-csrf-token": token },
            }
          );
          return response.status;
        },
        { id: lot.id, token: csrfToken }
      );

      if (status >= 400) {
        throw new Error(`Failed to delete lot ${lot.id}: ${status}`);
      }
    })
  );

  await page.close();
}
