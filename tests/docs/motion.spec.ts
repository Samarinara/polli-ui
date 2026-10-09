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
  await checkbox.scrollIntoViewIfNeeded();
  const sample = await checkbox.evaluate(async element => {
    const path = element.querySelector('[data-polli-stroke="check"]')!;
    // Flush the starting style before the interaction, then seek the actual
    // CSS transition. Frame scheduling varies under CI load.
    getComputedStyle(path).strokeDashoffset;
    (element as HTMLElement).click();
    let transition: Animation | undefined;
    for (let frame = 0; frame < 10 && !transition; frame++) {
      await new Promise(requestAnimationFrame);
      getComputedStyle(path).strokeDashoffset;
      transition = path.getAnimations().find(animation => animation instanceof CSSTransition && animation.transitionProperty === 'stroke-dashoffset');
    }
    if (!transition) throw new Error('The checkbox did not create a stroke transition');
    const duration = transition.effect?.getTiming().duration;
    transition.pause();
    transition.currentTime = 90;
    const offset = parseFloat(getComputedStyle(path).strokeDashoffset);
    transition.finish();
    return { offset, duration };
  });
  expect(sample.offset).toBeGreaterThan(0);
  expect(sample.offset).toBeLessThan(1);
  expect(sample.duration).toBe(180);
  await expect(stroke).toHaveCSS('stroke-dashoffset', '0px');
  await expect(page.locator('label[for="motion-finished"] [data-polli="ink-words"]')).toHaveCSS('background-size', '100% 100%');
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

test('icons stay still on hover, replay on actions, and copy waits for success', async ({ page }) => {
  await page.addInitScript(() => {
    (window as Window & { motionStarts: string[] }).motionStarts = [];
    document.addEventListener('animationstart', event => {
      (window as Window & { motionStarts: string[] }).motionStarts.push(event.animationName);
    });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async () => {},
    } });
  });
  await page.goto('motion.html');
  const starts = () => page.evaluate(() => (window as Window & { motionStarts: string[] }).motionStarts);
  const copy = page.getByRole('button', { name: 'Copy reminder', exact: true });
  await copy.hover();
  expect(await starts()).toEqual([]);
  const box = await copy.locator('svg').boundingBox();
  await copy.click();
  await expect.poll(starts).toContain('polli-copy-sheet');
  expect(await copy.locator('svg').boundingBox()).toEqual(box);
  await copy.click();
  await expect.poll(async () => (await starts()).filter(name => name === 'polli-copy-sheet').length).toBe(2);
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async () => { throw new Error('Denied'); },
    } });
  });
  await copy.click();
  await expect(page.getByText('Copy unavailable. Select the reminder text to copy it.')).toBeVisible();
  expect((await starts()).filter(name => name === 'polli-copy-sheet')).toHaveLength(2);

  const bookmark = page.getByRole('button', { name: 'Bookmark reminder', exact: true });
  await bookmark.click();
  await expect(bookmark).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(starts).toContain('polli-ribbon-tuck');
  await page.getByRole('button', { name: 'Edit reminder', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'A little reminder' })).toBeFocused();
  await expect.poll(starts).toContain('polli-pencil-write');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Bookmarked', exact: true }).click();
  await expect(page.locator('[data-icon="bookmark"] [data-icon-part="ribbon-tip"]')).toHaveCSS('animation-name', 'none');
});

test('saving draws a finishing underline and the switch stretches within its track', async ({ page }, testInfo) => {
  await page.goto('motion.html');
  const words = page.locator('.motion-saved-note');
  await expect(words.locator('[data-polli="ink-underline"]')).toHaveCSS('opacity', '0');
  await page.getByRole('textbox', { name: 'A little reminder' }).fill('Something yellow for the table');
  await expect(words).toHaveText('Pick up flowers on the way home');
  const ink = await words.evaluate(async element => {
    (element.closest('.motion-notebook')!.querySelector('button[type="submit"]') as HTMLButtonElement).click();
    let animation: Animation | undefined;
    let line: Element | null = null;
    for (let frame = 0; frame < 10 && !animation; frame++) {
      await new Promise(requestAnimationFrame);
      line = element.querySelector('[data-polli="ink-underline"]');
      animation = line?.getAnimations().find(item => item instanceof CSSAnimation && item.animationName === 'polli-finishing-line');
    }
    if (!animation || !line) throw new Error('Missing finishing underline');
    animation.pause();
    animation.currentTime = 300;
    return { opacity: getComputedStyle(line).opacity, duration: animation.effect?.getTiming().duration };
  });
  await expect(words).toHaveText('Something yellow for the table');
  const underline = words.locator('[data-polli="ink-underline"]');
  expect(Number(ink.opacity)).toBeGreaterThan(0);
  expect(ink.duration).toBe(640);
  await page.screenshot({ path: testInfo.outputPath('notebook-finishing-underline.png'), fullPage: true });
  await underline.evaluate(element => element.getAnimations().forEach(animation => animation.finish()));
  await expect(underline).toHaveCSS('opacity', '0');

  const toggle = page.getByRole('switch', { name: 'Remind me tomorrow' });
  const stretch = await toggle.evaluate(async element => {
    const material = element.querySelector('[data-polli="switch-material"]')!;
    (element as HTMLElement).click();
    let animation: Animation | undefined;
    for (let frame = 0; frame < 10 && !animation; frame++) {
      await new Promise(requestAnimationFrame);
      animation = material.getAnimations().find(item => item instanceof CSSAnimation && item.animationName === 'polli-switch-on');
    }
    if (!animation) throw new Error('Missing switch stretch');
    animation.pause();
    animation.currentTime = 96;
    const scale = new DOMMatrix(getComputedStyle(material).transform).a;
    animation.finish();
    return scale;
  });
  expect(stretch).toBeGreaterThan(1);
  expect(stretch).toBeLessThanOrEqual(1.11);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Save edit', exact: true }).click();
  await expect(underline).toHaveCSS('animation-name', 'none');
});

test('removal marks the note before closing the gap and restores under reduced motion', async ({ page }, testInfo) => {
  await page.goto('motion.html');
  const removal = page.locator('[data-polli="ink-removal"]');
  await removal.scrollIntoViewIfNeeded();
  const sample = await removal.evaluate(async element => {
    const before = element.getBoundingClientRect().height;
    (element.querySelector('button') as HTMLButtonElement).click();
    let animation: Animation | undefined;
    for (let frame = 0; frame < 10 && !animation; frame++) {
      await new Promise(requestAnimationFrame);
      animation = element.getAnimations().find(item => item instanceof CSSAnimation && item.animationName === 'polli-close-gap');
    }
    if (!animation) throw new Error('Missing gap closure');
    animation.pause();
    animation.currentTime = 90;
    const markingHeight = element.getBoundingClientRect().height;
    animation.currentTime = 300;
    const closingHeight = element.getBoundingClientRect().height;
    return { before, markingHeight, closingHeight, timing: animation.effect?.getTiming() };
  });
  expect(sample.markingHeight).toBe(sample.before);
  expect(sample.closingHeight).toBeGreaterThan(0);
  expect(sample.closingHeight).toBeLessThan(sample.before);
  expect(sample.timing?.delay).toBe(180);
  expect(sample.timing?.duration).toBe(240);
  await expect(removal).toHaveAttribute('inert');
  await expect(page.getByRole('textbox', { name: 'A little reminder' })).toBeFocused();
  await page.screenshot({ path: testInfo.outputPath('notebook-removal.png'), fullPage: true });
  await removal.evaluate(element => element.getAnimations().forEach(animation => animation.finish()));
  await expect(page.getByRole('button', { name: 'Restore reminder', exact: true })).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Restore reminder', exact: true }).click();
  await page.getByRole('button', { name: 'Remove reminder', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Restore reminder', exact: true })).toBeVisible();
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
