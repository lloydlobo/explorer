import { test, expect } from "@playwright/test";

// Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
test("should navigate to the home page", async ({ page }) => {
  await page.goto("/countries");

  // Find an element with id="asideButton" and click on it
  // await page.click("id=asideButton");

  // Find an element with the text 'About' and click on it
  // await page.click("text=explorer");

  // The new URL should be "/" (baseURL is used there)
  await expect(page).toHaveURL("/countries");

  // The new page should contain an h1 with "About Page"
  // await expect(page.locator("h1")).toContainText("Guess the country");
});

test("test", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("link", { name: "Countries" }).click();
  await page.goto("http://localhost:3000/countries");
  // await page.getByPlaceholder('Search a country…').press('Control+-');
  await page.getByPlaceholder("Search a country…").click();
  await page.getByPlaceholder("Search a country…").fill("aust");
  await page.getByRole("option", { name: "Australia" }).click();
  await expect(page).toHaveURL("/countries/AUS");
});

/* test("should display an image on the homepage", async ({ page }) => {
  // Navigate to the home page
  await page.goto("/");

  // Check if there is an image on the page
  const imageElement = page.locator("img");
  expect(imageElement).not.toBeNull();
});

test("search combobox should be enabled when game has started", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByTestId("startGameButton").click();

  // PopoverTrigger onClick -> startGameButton.focus()
  const popoverTriggerSearch = page.getByText("Select a country…GuessSkip");
  await popoverTriggerSearch.click();
  expect(await popoverTriggerSearch.isEnabled()).toBe(true);

  // Skeleton loader onClick -> startGameButton.focus()
  // await page.locator('div:nth-child(4)').first().click();
  // await page.locator('div:nth-child(2) > .animate-pulse').click();
});

// test("search combobox is disabled when game has not started", async ({
//   page,
// }) => {
//   // Navigate to the home page
//   await page.goto("/");
//
//   // Check if the search combobox is disabled
//   const searchCombobox = page.getByTestId("searchCountryTrigger");
//   const isEnabled = await searchCombobox.isEnabled();
//   expect(isEnabled).toBe(false);
// });

// test("Start game button should have correct data-testid value", async ({
//   page,
// }) => {
//   // Navigate to the page
//   await page.goto("/");
//
//   // Locate the Start Game button
//   //
//   // When to use testid locators:
//   // You can also use test ids when you choose to use the test id methodology or when you can't locate by role or text.
//   const startGameButton = page.getByTestId("startGameButton");
//
//   // Check if the button exists
//   expect(await startGameButton.isVisible()).toBe(true);
//
//   // Check if the button has the correct data-test-id attribute value
//   expect(await startGameButton.getAttribute("data-testid")).toBe(
//     "startGameButton"
//   );
// });

*/
