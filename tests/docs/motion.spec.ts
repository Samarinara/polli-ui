import { test, expect } from '@playwright/test';

test('reading default states and scrolling never starts an animation', async ({ page }) => {
  await page.addInitScript(() => {
    (window as Window & { motionStarts: string[] }).motionStarts = [];
    document.addEventListener('animationstart', event => {
      (window as Window & { motionStarts: string[] }).motionStarts.push(event.animationName);
    });
  });
  for (const path of ['index.html', 'checkbox.html', 'switch.html', 'tabs.html', 'accordion.html', 'feedback.html', 'motion.html']) {
    await page.goto(path);
    await page.evaluate(async () => {
      await document.fonts.ready;
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
    });
    expect(await page.evaluate(() => (window as Window & { motionStarts: string[] }).motionStarts), path).toEqual([]);
    expect(await page.locator('[data-polli="skeleton"]').evaluateAll(elements => elements.every(element => getComputedStyle(element).animationName === 'none'))).toBe(true);
  }
});

test('checkbox draws a real 180ms stroke, reverses, and snaps under reduced motion', async ({ page }, testInfo) => {
  await page.goto('motion.html');
  const checkbox = page.locator('#motion-finished');
  const stroke = checkbox.locator('[data-polli-stroke="check"]');
  await expect(stroke).toHaveCSS('stroke-dashoffset', '1px');
  const sample = await checkbox.evaluate(async element => {
    (element as HTMLElement).click();
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    const path = element.querySelector('[data-polli-stroke="check"]')!;
    const style = getComputedStyle(path);
    return { offset: parseFloat(style.strokeDashoffset), transitions: path.getAnimations().map(animation => animation.effect?.getTiming().duration) };
  });
  expect(sample.offset).toBeGreaterThan(0);
  expect(sample.offset).toBeLessThan(1);
  expect(sample.transitions).toContain(180);
  await expect(stroke).toHaveCSS('stroke-dashoffset', '0px');
  await page.screenshot({ path: testInfo.outputPath('notebook-checked.png'), fullPage: true });
  await checkbox.click();
  await expect(checkbox).not.toBeChecked();
  await expect(stroke).toHaveCSS('opacity', '0');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await checkbox.focus();
  await page.keyboard.press('Space');
  await expect(checkbox).toBeChecked();
  await expect(stroke).toHaveCSS('stroke-dashoffset', '0px');
  await expect(stroke).toHaveCSS('transition-duration', '0s');
});

test('pressing gives inset pressure without resizing, while fields take ink', async ({ page }) => {
  await page.goto('motion.html');
  const button = page.getByRole('button', { name: 'Save note', exact: true });
  await button.scrollIntoViewIfNeeded();
  const before = await button.boundingBox();
  await button.hover();
  await page.mouse.down();
  await expect(button).toHaveCSS('transform', 'none');
  await expect.poll(() => button.evaluate(element => getComputedStyle(element).boxShadow)).toContain('inset');
  expect(await button.boundingBox()).toEqual(before);
  await page.mouse.up();
  const input = page.getByRole('textbox', { name: 'A little reminder' });
  await input.scrollIntoViewIfNeeded();
  const inputBefore = await input.boundingBox();
  await input.focus();
  await expect(input).toHaveCSS('border-bottom-color', 'rgb(1, 102, 48)');
  expect(await input.boundingBox()).toEqual(inputBefore);
});

test('switch glides and reduced motion preserves its on position', async ({ page }) => {
  await page.goto('motion.html');
  const toggle = page.getByRole('switch', { name: 'Remind me tomorrow' });
  const thumb = toggle.locator('[data-polli="switch-thumb"]');
  await toggle.click();
  await expect(toggle).toBeChecked();
  await expect(thumb).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 20, 0)');
  await expect(thumb).toHaveCSS('transition-duration', '0.24s, 0.16s');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(toggle).not.toBeChecked();
  await page.keyboard.press('Space');
  await expect(thumb).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 20, 0)');
  await expect(thumb).toHaveCSS('transition-duration', '0s');
});

test('disclosures, tabs, and portalled overlays animate after their triggers', async ({ page }) => {
  await page.addInitScript(() => {
    (window as Window & { motionStarts: string[] }).motionStarts = [];
    document.addEventListener('animationstart', event => {
      (window as Window & { motionStarts: string[] }).motionStarts.push(event.animationName);
    });
  });
  const starts = () => page.evaluate(() => (window as Window & { motionStarts: string[] }).motionStarts);
  await page.goto('motion.html');
  const trigger = page.getByRole('button', { name: 'More details', exact: true });
  await trigger.click();
  await expect.poll(starts).toContain('polli-unfold');
  await expect(page.getByText('Something yellow for the kitchen table.')).toBeVisible();
  await trigger.click();
  await expect.poll(starts).toContain('polli-fold');
  await expect(page.getByText('Something yellow for the kitchen table.')).not.toBeVisible();
  await expect(trigger).toBeFocused();

  await page.goto('tabs.html');
  const tabs = page.getByRole('region', { name: 'Tabs playground' });
  await tabs.getByRole('tab', { name: 'Links', exact: true }).click();
  await expect.poll(starts).toContain('polli-ink-in');

  await page.goto('dialog.html');
  const dialogTrigger = page.getByRole('region', { name: 'Dialog playground' }).getByRole('button', { name: 'Add category', exact: true });
  await dialogTrigger.click();
  await expect.poll(starts).toContain('polli-reveal');
  await page.keyboard.press('Escape');
  await expect.poll(starts).toContain('polli-dismiss');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(dialogTrigger).toBeFocused();

  await page.goto('menu.html');
  await page.getByRole('region', { name: 'Menu playground' }).getByRole('button', { name: 'Note actions' }).click();
  await expect.poll(starts).toContain('polli-reveal');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).not.toBeVisible();
});
