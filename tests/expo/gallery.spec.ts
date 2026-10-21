import { test, expect } from "@playwright/test";
for (const width of [390, 1280]) {
  test(`Expo gallery works at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByText("Polli UI", { exact: true })).toBeVisible();
    const title = page.getByRole("textbox", { name: "Title", exact: true });
    await title.fill("Something lovely");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(
      page.getByText("Something lovely", { exact: true }),
    ).toBeVisible();
    await page.getByRole("checkbox", { name: "Keep for later" }).click();
    await expect(page.getByRole("checkbox")).toBeChecked();
    await page.getByRole("tab", { name: "People" }).click();
    await expect(
      page.getByText("Sam Katevatis", { exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Collection", exact: true }).click();
    await page.getByRole("option", { name: "Recipes" }).click();
    await expect(
      page.getByRole("button", { name: "Collection", exact: true }),
    ).toContainText("Recipes");
    await page.getByRole("button", { name: "Open dialog" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Done", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.getByRole("button", { name: "Collection actions" }).click();
    await page.getByRole("menuitem", { name: "Save collection" }).click();
    await expect(page.getByRole("menu")).toHaveCount(0);
    await page.getByRole("switch", { name: "Dark mode" }).click();
    await expect(page.getByRole("switch")).toBeChecked();
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      )
      .toBe(true);
    await page.screenshot({
      path: `test-results/expo-gallery-${width}.png`,
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });
}
