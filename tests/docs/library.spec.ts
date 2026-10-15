import AxeBuilder from '@axe-core/playwright';
import { test, expect, type Page } from '@playwright/test';
import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';

test.setTimeout(90_000);
let fixture: string;
let fixtureScript: string;
test.beforeAll(async () => {
  const result = await build({ entryPoints: ['tests/fixtures/library.tsx'], bundle: true, write: false, format: 'iife', logOverride: { 'ignored-bare-import': 'silent' }, define: { 'process.env.NODE_ENV': '"development"' } });
  const css = await readFile('packages/ui/dist/styles.css', 'utf8');
  fixtureScript = result.outputFiles[0]!.text;
  fixture = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Library integration</title><style>body{margin:0;background:var(--background)}${css}</style></head><body><div id="root"></div><script src="/__library-audit.js"></script></body></html>`;
});

async function openFixture(page: Page, dark = false) {
  await page.route('**/__library-audit.html', route => route.fulfill({ contentType: 'text/html', body: fixture }));
  await page.route('**/__library-audit.js', route => route.fulfill({ contentType: 'text/javascript', body: fixtureScript }));
  await page.goto('__library-audit.html');
  await expect(page.getByRole('heading', { name: 'Library integration' })).toBeVisible();
  await page.evaluate(value => document.documentElement.classList.toggle('dark', value), dark);
}

for (const theme of ['light', 'dark'] as const) {
  test(`the installed library works without showcase styles in ${theme} mode`, async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openFixture(page, theme === 'dark');
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px`).toBe(true);
    }
    await page.setViewportSize({ width: 320, height: 900 });
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(result.violations.map(issue => ({ rule: issue.id, targets: issue.nodes.map(node => node.target), details: issue.nodes.map(node => node.failureSummary) }))).toEqual([]);
    const labels = page.getByRole('textbox', { name: 'Reusable title', exact: true });
    const ids = await labels.evaluateAll(elements => elements.map(element => element.id));
    expect(new Set(ids).size).toBe(2);
    await expect(labels.first()).toHaveAccessibleDescription('Each instance has its own label and hint.');
    await expect(labels.first()).toHaveCSS('font-size', '20px');
    await expect(page.locator('[data-polli="list-title"]').first()).toHaveCSS('font-size', '20px');
    const button = page.getByRole('button', { name: 'default', exact: true });
    await expect(button).toHaveCSS('font-size', '14px');
    expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    expect((await page.getByRole('checkbox', { name: 'Completed', exact: true }).boundingBox())!.width).toBeGreaterThanOrEqual(24);
    // Deliberately attempt activation: Playwright otherwise waits forever for
    // an aria-disabled link to become enabled before dispatching the click.
    await page.getByRole('link', { name: 'Disabled link', exact: true }).click({ force: true });
    await expect(page.getByRole('status', { name: 'Example result' })).toHaveText('Ready.');
    await expect(page).not.toHaveURL(/#blocked$/);
    await expect(page.getByRole('button', { name: 'Disabled detail' })).toHaveCSS('opacity', '0.45');
    const vertical = page.getByRole('tablist', { name: 'vertical views' });
    await expect(vertical).toHaveCSS('flex-direction', 'column');
    await vertical.getByRole('tab', { name: 'Notes' }).focus();
    await page.keyboard.press('ArrowDown');
    await expect(vertical.getByRole('tab', { name: 'Links' })).toHaveAttribute('aria-selected', 'true');
    for (const width of [1440, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.screenshot({ path: testInfo.outputPath(`library-${theme}-${width}.png`), fullPage: true });
    }
    expect(errors).toEqual([]);
  });
}

test('native forms submit and reset selection controls', async ({ page }) => {
  await openFixture(page);
  await page.getByRole('button', { name: 'Save preferences' }).click();
  await expect(page.getByRole('status', { name: 'Example result' })).toHaveText('{"completed":"yes","reminders":"yes"}');
  await page.getByRole('checkbox', { name: 'Completed', exact: true }).uncheck();
  await page.getByRole('switch', { name: 'Reminders', exact: true }).uncheck();
  await page.getByRole('button', { name: 'Save preferences' }).click();
  await expect(page.getByRole('status', { name: 'Example result' })).toHaveText('{}');
  await page.getByRole('button', { name: 'Reset preferences' }).click();
  await expect(page.getByRole('checkbox', { name: 'Completed', exact: true })).toBeChecked();
  await expect(page.getByRole('switch', { name: 'Reminders', exact: true })).toBeChecked();
});

test('Tab leaves modal and nonmodal menus in either direction', async ({ page }) => {
  await openFixture(page);
  for (const mode of ['modal', 'nonmodal']) {
    const trigger = page.getByRole('button', { name: `${mode === 'modal' ? 'Modal' : 'Nonmodal'} keyboard menu`, exact: true });
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'Keyboard action' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('menu')).not.toBeVisible();
    await expect(page.getByRole('button', { name: `After ${mode} menu`, exact: true })).toBeFocused();
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'Keyboard action' })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('menu')).not.toBeVisible();
    await expect(page.getByRole('button', { name: `Before ${mode} menu`, exact: true })).toBeFocused();
    await expect(page.locator('#root')).not.toHaveAttribute('inert');
  }
});

test('disabled slotted menu triggers block pointer and keyboard activation', async ({ page }) => {
  await openFixture(page);
  const trigger = page.getByRole('link', { name: 'Disabled menu trigger' });
  await trigger.click({ force: true });
  await expect(page.getByRole('menu')).not.toBeVisible();
  await expect(page).not.toHaveURL(/#blocked$/);
  await trigger.focus();
  for (const key of ['ArrowDown', 'ArrowUp', 'Enter', 'Space']) {
    await page.keyboard.press(key);
    await expect(page.getByRole('menu')).not.toBeVisible();
  }
});

test('modal isolation restores background focus and survives a nested menu', async ({ page }) => {
  await openFixture(page);
  await page.getByRole('button', { name: 'Open long dialog' }).click();
  await expect(page.locator('#root')).toHaveAttribute('inert', '');
  await page.getByRole('button', { name: 'Nested modal actions' }).click();
  await expect(page.getByRole('menu')).toBeVisible();
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Nested modal actions' })).toBeFocused();
  await expect(page.locator('#root')).toHaveAttribute('inert', '');
  await page.keyboard.press('Escape');
  await expect(page.locator('#root')).not.toHaveAttribute('inert');
  await expect(page.getByRole('button', { name: 'Open long dialog' })).toBeFocused();
  await page.getByRole('button', { name: 'Open modal menu' }).click();
  await expect(page.locator('#root')).toHaveAttribute('inert', '');
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(page.locator('#root')).not.toHaveAttribute('inert');
  await page.getByRole('button', { name: 'Open long dialog' }).click();
  await page.locator('[data-polli="dialog-overlay"]').click({ position: { x: 8, y: 8 } });
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('long floating content stays within a narrow viewport and remains keyboard usable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openFixture(page);
  await page.getByRole('button', { name: 'Open long dialog' }).click();
  const dialog = page.getByRole('dialog');
  const fits = (element: Element) => {
    const box = element.getBoundingClientRect();
    return box.left >= 0 && box.right <= innerWidth && box.top >= 0 && box.bottom <= innerHeight && element.scrollWidth <= element.clientWidth;
  };
  expect(await dialog.evaluate(fits)).toBe(true);
  expect(await dialog.evaluate(element => element.scrollHeight > element.clientHeight)).toBe(true);
  const close = dialog.getByRole('button', { name: 'Close dialog' });
  const closeBox = await close.boundingBox();
  expect(closeBox!.width).toBeGreaterThanOrEqual(44);
  await dialog.evaluate(element => element.scrollTop = element.scrollHeight);
  await expect(close).toBeInViewport();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open long dialog' })).toBeFocused();
  await page.getByRole('button', { name: 'Open long menu' }).click();
  const menu = page.getByRole('menu');
  expect(await menu.evaluate(fits)).toBe(true);
  await page.keyboard.press('End');
  await expect(page.getByRole('menuitem', { name: 'Action 25', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status', { name: 'Example result' })).toHaveText('Action 25 selected.');
  await page.getByRole('button', { name: 'Long tooltip' }).focus();
  await expect(page.getByRole('tooltip')).toBeVisible();
  expect(await page.locator('[data-polli="tooltip"]').evaluate(fits)).toBe(true);
});

test('forced colors and RTL retain visible selection and focus', async ({ page }) => {
  await openFixture(page);
  await page.evaluate(() => document.documentElement.dir = 'rtl');
  const thumb = page.getByRole('switch', { name: 'Reminders', exact: true }).locator('[data-polli="switch-thumb"]');
  await expect.poll(() => thumb.evaluate(element => getComputedStyle(element).transform)).toBe('matrix(1, 0, 0, 1, -20, 0)');
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  const checkbox = page.getByRole('checkbox', { name: 'Completed', exact: true });
  await checkbox.focus();
  await expect(checkbox).toHaveCSS('outline-style', 'solid');
  expect(await checkbox.evaluate(element => getComputedStyle(element).color !== getComputedStyle(element.querySelector('[data-polli="checkbox-fill"]')!).backgroundColor)).toBe(true);
});

test('removal completes when host styles disable animations', async ({ page }) => {
  await openFixture(page);
  await page.addStyleTag({ content: '[data-polli="ink-removal"] { animation:none!important; }' });
  await page.getByRole('button', { name: 'Remove note', exact: true }).click();
  await expect(page.getByText('Note removed.', { exact: true })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Removal focus target' })).toBeFocused();
});
