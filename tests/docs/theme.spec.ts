import { test, expect, type Page } from "@playwright/test";

const visualExpect = expect.configure({ timeout: 15_000 });
const html = (page: Page) => page.locator("html");
async function setTheme(page: Page, theme: "light" | "dark" | "system") {
  // Native select text can retain its initial fallback font after a web font
  // loads. Select only once the document fonts are ready for stable rendering.
  await page.evaluate(() => document.fonts.ready);
  await page.getByLabel("Color theme").selectOption(theme);
  await expect(html(page)).toHaveAttribute("data-theme", theme);
}

test("system preference, persistent override, live OS changes, and playground switching", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("buttons.html");
  await expect(html(page)).toHaveClass("dark");
  await expect(page.getByLabel("Color theme")).toHaveValue("system");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(html(page)).not.toHaveClass("dark");
  const toggle = page.getByRole("region", { name: "Button playground" }).getByRole("button", { name: "Dark mode", exact: true });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("Color theme")).toHaveValue("dark");
  await page.reload();
  await expect(html(page)).toHaveClass("dark");
  await page.goto("fields.html");
  await expect(html(page)).toHaveClass("dark");
  await setTheme(page, "light");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(html(page)).not.toHaveClass("dark");
  await setTheme(page, "system");
  await expect(html(page)).toHaveClass("dark");
});

test("storage failures retain a usable system theme", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, "getItem", { value: () => { throw new Error("Storage blocked"); } });
    Object.defineProperty(Storage.prototype, "setItem", { value: () => { throw new Error("Storage blocked"); } });
  });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("index.html");
  await expect(html(page)).toHaveClass("dark");
  await setTheme(page, "light");
  await expect(html(page)).not.toHaveClass("dark");
});

test("invalid stored preference falls back safely", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("polli-theme", "invalid"));
  await page.emulateMedia({ colorScheme: "dark" });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("index.html");
  await expect(html(page)).toHaveClass("dark");
  await expect(page.getByLabel("Color theme")).toHaveValue("system");
  expect(errors).toEqual([]);
});

test("the head script applies a saved theme without the app bundle", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("polli-theme", "dark"));
  await page.emulateMedia({ colorScheme: "light" });
  await page.route("**/assets/*.js", route => route.abort());
  await page.goto("index.html");
  await expect(html(page)).toHaveClass("dark");
  await expect(html(page)).toHaveAttribute("data-theme", "dark");
  await expect(html(page)).toHaveCSS("color-scheme", "dark");
});

test("preferences synchronize across open tabs", async ({ page, context }) => {
  await page.goto("index.html");
  const other = await context.newPage();
  await other.goto("fields.html");
  await setTheme(page, "dark");
  await expect(html(other)).toHaveClass("dark");
  await expect(other.getByLabel("Color theme")).toHaveValue("dark");
  await page.evaluate(() => localStorage.clear());
  await expect(other.getByLabel("Color theme")).toHaveValue("system");
});

for (const mode of ["light", "dark"] as const) {
  test.describe(mode, () => {
    test.use({ colorScheme: mode, reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
    test("semantic text and control boundaries have accessible contrast", async ({ page }) => {
      await page.goto("fields.html");
      await setTheme(page, mode);
      await expect(html(page)).toHaveCSS("color-scheme", mode);
      await expect(page.getByLabel("Control", { exact: true })).toHaveCSS("color-scheme", mode);
      const input = page.getByRole('textbox', { name: 'Title', exact: true });
      await expect(input).toHaveCSS('font-size', '20px');
      expect(await input.evaluate(element => getComputedStyle(element).fontFamily)).toContain('Patrick Hand');
      const ratios = await page.evaluate(() => {
        const probe = document.createElement("span");
        document.body.append(probe);
        const luminance = (token: string) => {
          probe.style.color = `var(--${token})`;
          const rgb = getComputedStyle(probe).color.match(/[\d.]+/g)!.slice(0, 3).map(Number);
          const linear = rgb.map(n => { const s = n / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
          return linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722;
        };
        const pairs = [
          ["foreground", "background"], ["muted-foreground", "background"], ["muted-foreground", "muted"], ["muted-foreground", "accent"],
          ["primary", "background"], ["primary-foreground", "primary"], ["destructive", "background"],
          ["coral-foreground", "polli-coral"], ["butter-foreground", "polli-yellow"],
          ["sky-foreground", "polli-blue"], ["mint-foreground", "polli-mint"],
          ["border", "background"], ["ring", "background"],
        ];
        const result = pairs.map(([fg, bg]) => {
          const a = luminance(fg!), b = luminance(bg!);
          return { pair: `${fg}/${bg}`, ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05), minimum: fg === "border" || fg === "ring" ? 3 : 4.5 };
        });
        probe.remove();
        return result;
      });
      for (const { pair, ratio, minimum } of ratios) expect(ratio, pair).toBeGreaterThanOrEqual(minimum);
      await page.goto("tabs.html");
      const marks = await page.locator('[data-polli="tabs-trigger"][data-state="active"]').evaluate(element => {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1;
        const context = canvas.getContext("2d")!;
        const luminance = (color: string) => {
          context.fillStyle = color;
          context.fillRect(0, 0, 1, 1);
          const rgb = context.getImageData(0, 0, 1, 1).data;
          const linear = Array.from(rgb).slice(0, 3).map(n => {
            const v = n / 255;
            return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
          });
          return linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722;
        };
        const background = luminance(getComputedStyle(document.querySelector(".docs-root")!).backgroundColor);
        return ["butter", "coral", "sky", "mint", "green"].map(tone => {
          element.setAttribute("data-polli-ink-tone", tone);
          const ink = luminance(getComputedStyle(element, "::after").backgroundColor);
          return { tone, ratio: (Math.max(ink, background) + 0.05) / (Math.min(ink, background) + 0.05) };
        });
      });
      for (const { tone, ratio } of marks) expect(ratio, `${tone} selected tab mark`).toBeGreaterThanOrEqual(3);
    });

    test("component playground visual regressions on desktop and mobile", async ({ page }) => {
      test.setTimeout(180_000);
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
      for (const file of ["index", "buttons", "fields", "badge", "checkbox", "switch", "tabs", "accordion", "feedback", "lists"]) {
        await page.goto(`${file}.html`);
        await setTheme(page, mode);
        await page.evaluate(() => document.fonts.ready);
        const playground = page.locator(".playground").first();
        await visualExpect(playground).toHaveScreenshot(`${file}-${mode}.png`);
      }
      await page.goto("colour.html");
      await setTheme(page, mode);
      await page.evaluate(() => document.fonts.ready);
      await visualExpect(page).toHaveScreenshot(`colour-${mode}.png`);
      await visualExpect(page.locator(".doc-section").filter({ has: page.locator("#contrast") }))
        .toHaveScreenshot(`colour-pairings-${mode}.png`);
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("buttons.html");
      await setTheme(page, mode);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await visualExpect(page).toHaveScreenshot(`buttons-mobile-${mode}.png`);
      await visualExpect(page.locator(".playground")).toHaveScreenshot(`buttons-mobile-playground-${mode}.png`);
      expect(errors).toEqual([]);
    });

    test("portals inherit html theme and update while open", async ({ page }) => {
      test.setTimeout(90_000);
      for (const [file, trigger, kind] of [
        ["dialog", "Add category", "dialog"], ["menu", "Note actions", "menu"], ["tooltip", "Bookmark note", "tooltip"],
      ] as const) {
        await page.goto(`${file}.html`);
        await setTheme(page, mode);
        const button = page.getByRole("button", { name: trigger, exact: true });
        if (kind === "tooltip") await button.focus(); else await button.click();
        const overlay = page.locator(`[data-polli="${kind}"]`);
        await expect(overlay).toBeVisible();
        const bodyFont = await page.locator(".docs-root").evaluate(element => getComputedStyle(element).fontFamily);
        await expect(overlay).toHaveCSS("font-family", bodyFont);
        expect(await overlay.evaluate(element => !document.getElementById("root")!.contains(element))).toBe(true);
        const expected = await page.evaluate(kind => {
          const probe = document.createElement("span");
          probe.style.backgroundColor = `var(${kind === "tooltip" ? "--foreground" : "--background"})`;
          probe.style.color = `var(${kind === "tooltip" ? "--background" : "--foreground"})`;
          document.body.append(probe);
          const style = getComputedStyle(probe);
          const colors = { background: style.backgroundColor, foreground: style.color };
          probe.remove();
          return colors;
        }, kind);
        await expect(overlay).toHaveCSS("background-color", expected.background);
        await expect(overlay).toHaveCSS("color", expected.foreground);
        const before = expected.background;
        await page.evaluate(() => document.fonts.ready);
        await visualExpect(overlay).toHaveScreenshot(`${kind}-portal-${mode}.png`);
        // A modal makes the header inert, so change the global theme using its event.
        await page.evaluate(next => window.dispatchEvent(new CustomEvent("polli-theme-change", { detail: next })), mode === "dark" ? "light" : "dark");
        await expect(overlay).not.toHaveCSS("background-color", before);
        await expect(overlay).toHaveCSS("color-scheme", mode === "dark" ? "light" : "dark");
        await page.keyboard.press("Escape");
      }
      await page.goto("index.html");
      await setTheme(page, mode);
      await page.getByRole("button", { name: "Search documentation" }).click();
      await expect(page.getByRole("dialog")).toHaveCSS("color-scheme", mode);
      await visualExpect(page.getByRole("dialog")).toHaveScreenshot(`search-${mode}.png`);
    });
  });
}
