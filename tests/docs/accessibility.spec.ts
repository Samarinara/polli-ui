import AxeBuilder from '@axe-core/playwright';
import { test, expect, type Page } from '@playwright/test';
import { pages, pageHref } from '../../apps/preview/src/pages';

export async function expectAccessible(page: Page, context: string) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(result.violations.map(issue => ({
    rule: issue.id,
    impact: issue.impact,
    targets: issue.nodes.map(node => node.target),
    details: issue.nodes.map(node => node.failureSummary),
  })), context).toEqual([]);
}

for (const theme of ['light', 'dark'] as const) {
  for (const entry of pages) {
    test(`${entry.title} passes automated WCAG checks in ${theme} mode`, async ({ page }) => {
      test.setTimeout(90_000);
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      await page.goto(pageHref(entry.id));
      await page.evaluate(() => document.fonts.ready);
      await expectAccessible(page, `${entry.title} / ${theme}`);
    });
  }

  test(`all pages pass narrow-screen WCAG checks in ${theme} mode`, async ({ page }) => {
    test.setTimeout(600_000);
    await page.setViewportSize({ width: 320, height: 640 });
    await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
    for (const entry of pages) {
      await page.goto(pageHref(entry.id));
      await page.evaluate(() => document.fonts.ready);
      await expectAccessible(page, `${entry.title} / 320px / ${theme}`);
    }
  });

  test(`interactive states pass automated WCAG checks in ${theme} mode`, async ({ page }) => {
    test.setTimeout(180_000);
    await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
    await page.goto('fields.html');
    await page.getByRole('button', { name: 'Save entry', exact: true }).click();
    await expectAccessible(page, `Invalid field / ${theme}`);
    await page.getByLabel('Control', { exact: true }).selectOption('textarea');
    await expectAccessible(page, `Textarea / ${theme}`);
    await page.getByLabel('Control', { exact: true }).selectOption('select');
    await expectAccessible(page, `Select / ${theme}`);
    for (const [file, name] of [['dialog', 'Add category'], ['menu', 'Note actions'], ['tooltip', 'Bookmark note']] as const) {
      await page.goto(`${file}.html`);
      const trigger = page.getByRole('button', { name, exact: true });
      if (file === 'tooltip') await trigger.focus(); else await trigger.click();
      await expect(page.locator(`[data-polli="${file}"]`)).toBeVisible();
      await expectAccessible(page, `Open ${file} / ${theme}`);
      await page.keyboard.press('Escape');
    }
    await page.goto('index.html');
    await page.getByRole('button', { name: 'Search documentation', exact: true }).click();
    await page.getByRole('textbox', { name: 'Search documentation' }).fill('fields');
    await expectAccessible(page, `Search results / ${theme}`);
    await page.setViewportSize({ width: 320, height: 640 });
    await page.keyboard.press('Escape');
    await page.locator('.mobile-navigation summary').click();
    await expectAccessible(page, `Mobile navigation / ${theme}`);
  });
}
