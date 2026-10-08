import { test, expect } from "@playwright/test";

const documents = [
  ["index.html", "Brand guidelines"],
  ["logo.html", "Logo"],
  ["colour.html", "Colour"],
  ["typography.html", "Typography"],
  ["layout.html", "Layout"],
  ["components.html", "Components"],
  ["motion.html", "Motion"],
  ["voice.html", "Writing"],
  ["getting-started.html", "Getting started"],
] as const;

test("all pages are readable and connected without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const [path, title] of documents) {
    const response = await page.goto(`${baseURL}${path}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page).toHaveTitle(`${title} · Polli`);
    expect(
      await page
        .locator('.page-outline a[href^="#"]')
        .evaluateAll((links) =>
          links.every((link) =>
            document.getElementById(link.getAttribute("href")!.slice(1)),
          ),
        ),
    ).toBe(true);
    await expect(page.locator('[data-polli="skeleton"]')).toHaveCount(0);
  }
  await page.goto(`${baseURL}index.html`);
  await page
    .locator(".sidebar")
    .getByRole("link", { name: "Colour", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Colour");
  await context.close();
});

test("every page hydrates without errors or missing local assets", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  for (const [path, title] of documents) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page
        .locator(".brand img")
        .evaluate((image) => (image as HTMLImageElement).naturalWidth),
    ).toBeGreaterThan(0);
    if (
      [
        "index.html",
        "colour.html",
        "typography.html",
        "components.html",
      ].includes(path)
    ) {
      await page.screenshot({
        path: testInfo.outputPath(path.replace(".html", "-desktop.png")),
        fullPage: true,
      });
    }
  }
  expect(errors).toEqual([]);
});

test("search supports keyboard selection, empty results, and Escape focus restoration", async ({
  page,
}) => {
  await page.goto("index.html");
  await page.keyboard.press("Control+k");
  const input = page.getByRole("textbox", { name: "Search guidelines" });
  await expect(input).toBeFocused();
  await input.fill("contrast");
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("link", { name: "Accessible pairings Colour" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/colour\.html#contrast$/);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Colour");
  await page.getByRole("button", { name: "Search guidelines" }).click();
  await input.fill("no-such-guideline");
  await expect(page.getByText("No matches.")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Search guidelines" }),
  ).toBeFocused();
});

test("live examples handle form submission, selections, keyboard tabs, and dialogs", async ({
  page,
}) => {
  await page.goto("components.html");
  const fields = page.locator('section[aria-labelledby="fields"]');
  await fields.getByLabel("Title", { exact: true }).fill("Weekend plans");
  await fields.getByRole("button", { name: "Save note" }).click();
  await expect(fields.getByRole("status")).toContainText("Note saved");
  await page.getByLabel("Add lemons to the shopping list").check();
  await expect(
    page.getByLabel("Add lemons to the shopping list"),
  ).toBeChecked();
  await page.getByRole("tab", { name: "Notes", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Links", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "Add category", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Add category" });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Category name").fill("Home");
  await dialog.getByRole("button", { name: "Create category" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByText("Category “Home” created in this example."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Add category", exact: true }),
  ).toBeFocused();
});

test("mobile navigation works and pages fit narrow and wide viewports", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("index.html");
  await page.locator(".mobile-navigation summary").click();
  await page
    .locator(".mobile-navigation")
    .getByRole("link", { name: "Typography", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Typography",
  );
  for (const width of [320, 375, 760, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [path] of documents) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${path} at ${width}px`,
      ).toBe(true);
      if (
        width === 375 &&
        ["index.html", "colour.html", "components.html"].includes(path)
      ) {
        await page.screenshot({
          path: testInfo.outputPath(path.replace(".html", "-mobile.png")),
          fullPage: true,
        });
      }
    }
  }
});

test("colour copying reports success and reduced motion removes the press transform", async ({
  page,
}) => {
  await page.goto("colour.html");
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async (value: string) => {
          (window as Window & { copied?: string }).copied = value;
        },
      },
    }),
  );
  await page.getByRole("button", { name: "#016630: #016630" }).click();
  await expect(page.getByText("Copied", { exact: true })).toBeVisible();
  expect(
    await page.evaluate(() => (window as Window & { copied?: string }).copied),
  ).toBe("#016630");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("motion.html");
  const button = page.getByRole("button", { name: "Save note", exact: true });
  await button.hover();
  await page.mouse.down();
  expect(
    await button.evaluate((element) => getComputedStyle(element).transform),
  ).toBe("none");
  await page.mouse.up();
});
