import { test, expect } from '@playwright/test';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

test('copyable examples pass strict TypeScript checks, including configured edge states', async ({ page }) => {
  test.setTimeout(240_000);
  const snippets: Array<{ name: string; source: string }> = [];
  async function capture(name: string) {
    await page.locator('.playground-tabs').getByRole('tab', { name: 'Code', exact: true }).click();
    snippets.push({ name, source: await page.locator('.playground pre code').innerText() });
    await page.locator('.playground-tabs').getByRole('tab', { name: 'Preview', exact: true }).click();
  }
  for (const name of ['index', 'buttons', 'fields', 'checkbox', 'switch', 'badge', 'tabs', 'accordion', 'dialog', 'menu', 'tooltip', 'feedback', 'lists']) {
    await page.goto(`${name}.html`);
    await capture(name);
    if (name === 'buttons') {
      await page.getByLabel('Size', { exact: true }).selectOption('icon');
      await page.getByLabel('Disabled', { exact: true }).check();
      await page.getByLabel('Button label').fill('Save "this"\nidea');
      await capture('buttons-icon-disabled');
    }
    if (name === 'fields') {
      await page.getByLabel('Control', { exact: true }).selectOption('textarea');
      await capture('fields-textarea');
      await page.getByLabel('Control', { exact: true }).selectOption('select');
      await capture('fields-select');
    }
    if (name === 'checkbox') {
      await page.getByLabel('Checked state', { exact: true }).selectOption('indeterminate');
      await capture('checkbox-indeterminate');
    }
    if (name === 'accordion') {
      await page.getByLabel('Mode', { exact: true }).selectOption('multiple');
      await page.getByRole('button', { name: 'How do categories work?' }).click();
      await capture('accordion-multiple-empty');
    }
    if (name === 'feedback') {
      await page.getByLabel('Component', { exact: true }).selectOption('empty state');
      await capture('feedback-empty');
    }
    if (name === 'lists') {
      await page.getByLabel('Use a surface').check();
      await capture('lists-surface');
    }
  }
  await page.goto('getting-started.html');
  snippets.push({ name: 'getting-started', source: await page.locator('section[aria-labelledby="use"] pre code').innerText() });
  const directory = path.resolve('.tmp', `snippet-audit-${process.pid}`);
  await mkdir(directory, { recursive: true });
  try {
    const files = await Promise.all(snippets.map(async snippet => {
      const file = path.join(directory, `${snippet.name}.tsx`);
      await writeFile(file, snippet.source);
      return file;
    }));
    const program = ts.createProgram(files, {
      strict: true, noEmit: true, skipLibCheck: true, esModuleInterop: true,
      target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler, jsx: ts.JsxEmit.ReactJSX,
    });
    const diagnostics = ts.getPreEmitDiagnostics(program);
    expect(diagnostics.map(diagnostic => {
      const position = diagnostic.file && diagnostic.start !== undefined ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start) : undefined;
      return `${diagnostic.file ? path.basename(diagnostic.file.fileName) : ''}:${position ? position.line + 1 : ''} ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`;
    })).toEqual([]);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
