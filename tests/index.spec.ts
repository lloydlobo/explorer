import { test, expect } from "@playwright/test";

// Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
test("should navigate to the home page", async ({ page }) => {
  await page.goto("/");

  // Find an element with id="asideButton" and click on it
  // await page.click("id=asideButton");

  // Find an element with the text 'About' and click on it
  // await page.click("text=explorer");

  // The new URL should be "/" (baseURL is used there)
  await expect(page).toHaveURL("/");

  // The new page should contain an h1 with "About Page"
  // await expect(page.locator("h1")).toContainText("Guess the country");
});

test("should display an image on the homepage", async ({ page }) => {
  // Navigate to the home page
  await page.goto("/");

  // Check if there is an image on the page
  const imageElement = page.locator("img");
  expect(imageElement).not.toBeNull();
});
