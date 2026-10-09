import { test, expect, type Page } from "@playwright/test";

async function open(page: Page, path: string, name: string) {
  await page.goto(path);
  return page.getByRole("region", { name: `${name} playground`, exact: true });
}

test("the home showcase adds, completes, deletes, filters, and resets real notes", async ({
  page,
}) => {
  const demo = await open(page, "index.html", "Notebook");
  await demo.getByRole("button", { name: "Add note", exact: true }).click();
  await expect(demo.getByRole("status")).toHaveText(
    "Write a note before adding it.",
  );
  await demo.getByLabel("New note category").selectOption("Home");
  await demo.getByLabel("A new note", { exact: true }).fill("Plan the weekend");
  await demo.getByRole("button", { name: "Add note", exact: true }).click();
  await expect(
    demo.getByText("Plan the weekend", { exact: true }),
  ).toBeVisible();
  await expect(demo.getByText("3 notes", { exact: true })).toBeVisible();
  await demo.getByLabel("Complete Plan the weekend", { exact: true }).check();
  await demo.getByLabel("Show completed", { exact: true }).uncheck();
  await expect(
    demo.getByText("Plan the weekend", { exact: true }),
  ).not.toBeVisible();
  await demo.getByLabel("Show completed", { exact: true }).check();
  await demo
    .getByRole("button", { name: "Actions for Plan the weekend", exact: true })
    .click();
  await page
    .getByRole("menuitem", { name: "Delete note", exact: true })
    .click();
  await expect(
    demo.getByText("Plan the weekend", { exact: true }),
  ).not.toBeVisible();
  await expect(demo.getByText("2 notes", { exact: true })).toBeVisible();
  await demo.getByRole("tab", { name: "Saved links", exact: true }).click();
  await demo.getByRole("button", { name: "Keep it", exact: true }).click();
  await expect(
    demo.getByRole("button", { name: "Saved", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await demo.getByRole("button", { name: "Reset notebook example" }).click();
  await expect(demo.getByLabel("New note category")).toHaveValue("Ideas");
  await expect(
    demo.getByRole("tab", { name: "Notes", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(demo.getByRole("status")).toHaveText(
    "Try adding a note or completing an item.",
  );
});

test("button controls update the real component and copy its current React configuration", async ({
  page,
}, testInfo) => {
  const demo = await open(page, "buttons.html", "Button");
  await demo.getByLabel("Variant", { exact: true }).selectOption("coral");
  await demo.getByLabel("Size", { exact: true }).selectOption("lg");
  await demo.getByLabel("Button label", { exact: true }).fill("Keep this idea");
  const button = demo.getByRole("button", {
    name: "Keep this idea",
    exact: true,
  });
  await button.click();
  await button.click();
  await expect(demo.getByRole("status")).toHaveText("Pressed 2 times.");
  await expect(button).toHaveCSS("background-color", "rgb(243, 166, 160)");
  await demo.getByLabel("Disabled", { exact: true }).check();
  await expect(button).toBeDisabled();
  await demo.getByRole("tab", { name: "Preview", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    demo.getByRole("tab", { name: "Code", exact: true }),
  ).toBeFocused();
  const code = demo.locator("pre code");
  await expect(code).toBeVisible();
  await expect(code).toContainText('variant="coral" size="lg" disabled');
  await expect(code).toContainText("Keep this idea");
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async (value: string) => {
          (window as Window & { copied?: string }).copied = value;
        },
      },
    }),
  );
  await demo.getByRole("button", { name: "Copy code", exact: true }).click();
  await expect(demo.getByText("Copied", { exact: true })).toBeVisible();
  expect(
    await page.evaluate(() => (window as Window & { copied?: string }).copied),
  ).toBe(await code.textContent());
  await page.screenshot({
    path: testInfo.outputPath("button-configured-code.png"),
    fullPage: true,
  });
  await demo.getByRole("button", { name: "Reset button example" }).click();
  await expect(demo.getByLabel("Variant", { exact: true })).toHaveValue(
    "default",
  );
  await expect(
    demo.getByRole("button", { name: "Save note", exact: true }),
  ).toBeEnabled();
  await expect(demo.getByRole("status")).toHaveText("Ready when you are.");
  await demo.getByLabel("Size", { exact: true }).selectOption("icon");
  await expect(
    demo.getByRole("button", { name: "Save note", exact: true }),
  ).toBeVisible();
});

test("fields support validation, editing, textarea, select, and disabled states", async ({
  page,
}) => {
  const demo = await open(page, "fields.html", "Fields");
  await demo.getByRole("button", { name: "Save entry", exact: true }).click();
  await expect(demo.getByRole("alert")).toHaveText(
    "Enter a title before saving.",
  );
  await expect(demo.getByLabel("Title", { exact: true })).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await demo.getByLabel("Title", { exact: true }).fill("Weekend plans");
  await demo.getByRole("button", { name: "Save entry", exact: true }).click();
  await expect(demo.getByRole("status")).toHaveText("Saved: Weekend plans");
  await demo.getByLabel("Control", { exact: true }).selectOption("textarea");
  await expect(demo.getByLabel("Title", { exact: true })).toHaveJSProperty(
    "tagName",
    "TEXTAREA",
  );
  await demo
    .getByLabel("Title", { exact: true })
    .fill("Bake a cake. Pick up flowers.");
  await demo.getByRole("button", { name: "Save entry", exact: true }).click();
  await expect(demo.getByRole("status")).toHaveText(
    "Saved: Bake a cake. Pick up flowers.",
  );
  await demo.getByLabel("Control", { exact: true }).selectOption("select");
  await demo.getByLabel("Category", { exact: true }).selectOption("Home");
  await demo.getByRole("button", { name: "Save entry", exact: true }).click();
  await expect(demo.getByRole("status")).toHaveText("Saved: Home");
  await demo.getByLabel("State", { exact: true }).selectOption("invalid");
  await expect(demo.getByRole("alert")).toHaveText("Please check this value.");
  await demo.getByLabel("State", { exact: true }).selectOption("disabled");
  await expect(demo.getByLabel("Category", { exact: true })).toBeDisabled();
  await expect(
    demo.getByRole("button", { name: "Save entry", exact: true }),
  ).toBeDisabled();
  await demo.getByRole("button", { name: "Reset fields example" }).click();
  await expect(demo.getByLabel("Title", { exact: true })).toHaveValue("");
});

test("checkbox, switch, and badge expose editable state and reset", async ({
  page,
}) => {
  let demo = await open(page, "checkbox.html", "Checkbox");
  await demo.getByLabel("Checked state").selectOption("indeterminate");
  const checkbox = demo.getByRole("checkbox", {
    name: "Add lemons to the shopping list",
  });
  await expect(checkbox).toHaveAttribute("aria-checked", "mixed");
  await checkbox.focus();
  await page.keyboard.press("Space");
  await expect(checkbox).toBeChecked();
  await demo.getByLabel("Disabled", { exact: true }).check();
  await expect(checkbox).toBeDisabled();
  await demo.getByRole("button", { name: "Reset checkbox example" }).click();
  await expect(checkbox).not.toBeChecked();
  demo = await open(page, "switch.html", "Switch");
  await demo.getByRole("switch", { name: "Shared categories" }).click();
  await expect(demo.getByRole("status")).toHaveText("Sharing is off.");
  await expect(demo.getByLabel("Checked", { exact: true })).not.toBeChecked();
  await demo.getByRole("button", { name: "Reset switch example" }).click();
  await expect(
    demo.getByRole("switch", { name: "Shared categories" }),
  ).toBeChecked();
  demo = await open(page, "badge.html", "Badge");
  await demo.getByLabel("Badge text").fill("Weekend");
  await demo.getByLabel("Tone", { exact: true }).selectOption("sky");
  await expect(demo.locator('[data-polli="badge"]')).toHaveText("Weekend");
  await demo.getByRole("tab", { name: "Code", exact: true }).click();
  await expect(demo.locator("pre code")).toContainText('tone="sky"');
  await expect(demo.locator("pre code")).toContainText("Weekend");
});

test("tabs and accordions support keyboard activation and multiple disclosure", async ({
  page,
}) => {
  let demo = await open(page, "tabs.html", "Tabs");
  await demo.getByRole("tab", { name: "Notes", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    demo.getByRole("tab", { name: "Links", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await demo.getByLabel("Activation mode").selectOption("manual");
  await demo.getByRole("tab", { name: "Links", exact: true }).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(
    demo.getByRole("tab", { name: "Notes", exact: true }),
  ).toBeFocused();
  await expect(
    demo.getByRole("tab", { name: "Links", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Enter");
  await expect(
    demo.getByRole("tab", { name: "Notes", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await demo.getByLabel("Disable Recipes").check();
  await expect(
    demo.getByRole("tab", { name: "Recipes", exact: true }),
  ).toBeDisabled();
  demo = await open(page, "accordion.html", "Accordion");
  await demo
    .getByRole("button", { name: "Can I take my data with me?" })
    .click();
  await expect(
    demo.getByRole("button", { name: "How do categories work?" }),
  ).toHaveAttribute("aria-expanded", "false");
  await demo.getByLabel("Mode", { exact: true }).selectOption("multiple");
  await demo
    .getByRole("button", { name: "Can I take my data with me?" })
    .click();
  await expect(demo.getByRole("status")).toHaveText("2 sections open.");
  await demo.getByRole("button", { name: "Reset accordion example" }).click();
  await expect(demo.getByLabel("Mode", { exact: true })).toHaveValue("single");
  await expect(demo.getByRole("status")).toHaveText("1 section open.");
});

test("dialog forms trap focus, submit, cancel, and restore the trigger", async ({
  page,
}, testInfo) => {
  const demo = await open(page, "dialog.html", "Dialog");
  const trigger = demo.getByRole("button", {
    name: "Add category",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog", {
    name: "Add category",
    exact: true,
  });
  await expect(dialog.getByLabel("Category name")).toBeFocused();
  await dialog.getByLabel("Category name").fill("Weekend plans");
  await page.screenshot({
    path: testInfo.outputPath("dialog-open-desktop.png"),
  });
  await dialog
    .getByRole("button", { name: "Close dialog", exact: true })
    .focus();
  await page.keyboard.press("Tab");
  await expect(dialog.getByLabel("Category name")).toBeFocused();
  await dialog
    .getByRole("button", { name: "Create category", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  await expect(demo.getByRole("status")).toHaveText(
    "Category “Weekend plans” created in this example.",
  );
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(trigger).toBeFocused();
  await page.setViewportSize({ width: 375, height: 812 });
  await trigger.click();
  expect(
    await dialog.evaluate((element) => element.getBoundingClientRect().width),
  ).toBeLessThanOrEqual(343);
  await page.screenshot({
    path: testInfo.outputPath("dialog-open-mobile.png"),
  });
});

test("menus skip disabled items and tooltips appear on focus with a working action", async ({
  page,
}) => {
  let demo = await open(page, "menu.html", "Menu");
  await demo.getByLabel("Disable Archive").check();
  const trigger = demo.getByRole("button", { name: "Note actions" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("menuitem", { name: "Duplicate", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(demo.getByRole("status")).toHaveText(
    "Duplicate selected in this example.",
  );
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  demo = await open(page, "tooltip.html", "Tooltip");
  await demo.getByLabel("Side", { exact: true }).selectOption("right");
  await demo.getByLabel("Delay (ms)").selectOption("0");
  const bookmark = demo.getByRole("button", { name: "Bookmark note" });
  await bookmark.focus();
  await expect(page.getByRole("tooltip")).toHaveText("Keep this note close");
  await expect(page.locator('[data-polli="tooltip"]')).toHaveAttribute(
    "data-side",
    "right",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("tooltip")).not.toBeVisible();
  await bookmark.click();
  await expect(bookmark).toHaveAttribute("aria-pressed", "true");
  await expect(demo.getByRole("status")).toHaveText("Note bookmarked.");
});

test("feedback and lists change between useful populated and empty states", async ({
  page,
}) => {
  let demo = await open(page, "feedback.html", "Feedback");
  await demo.getByRole("button", { name: "Dismiss message" }).click();
  await expect(demo.getByRole("status")).toHaveText("Message dismissed.");
  await demo.getByRole("button", { name: "Save changes" }).click();
  await expect(demo.getByText("Changes saved", { exact: true })).toBeVisible();
  await demo
    .getByLabel("Component", { exact: true })
    .selectOption("empty state");
  await demo.getByRole("button", { name: "Add a note", exact: true }).click();
  await expect(demo.getByText("My first note", { exact: true })).toBeVisible();
  await demo.getByRole("button", { name: "Remove note", exact: true }).click();
  await expect(
    demo.getByText("Nothing here yet", { exact: true }),
  ).toBeVisible();
  demo = await open(page, "lists.html", "Lists");
  await demo.getByLabel("Person name").fill("Jamie Park");
  await expect(demo.getByRole("img", { name: "Jamie Park" })).toHaveText("JP");
  await demo.getByLabel("Use a surface").check();
  await expect(demo.locator('[data-polli="surface"]')).toBeVisible();
  await demo.getByRole("button", { name: "Remove saved note" }).click();
  await expect(demo.getByRole("status")).toHaveText("Saved note removed.");
  await demo.getByRole("button", { name: "Restore saved note" }).click();
  await expect(demo.getByRole("status")).toHaveText("2 rows in this example.");
});
