import { test, expect } from "@playwright/test";

test("has title and logo", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Job Tracker/);

  // Check for the logo text in the navigation
  const logo = page.getByRole("link", { name: /JobTracker/i }).first();
  await expect(logo).toBeVisible();
});

test("navigation to sign-up works", async ({ page }) => {
  await page.goto("/");

  // Click the 'Get Started' button
  await page.getByRole("link", { name: /Get Started/i }).click();

  // Expects page to have a specific URL or content
  await expect(page).toHaveURL(/\/sign-up/);
});
