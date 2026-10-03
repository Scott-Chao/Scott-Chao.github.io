import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

// Run against an already running background dev server, never the production preview.
const tokens = new URL('../src/styles/tokens.css', import.meta.url);
const original = await readFile(tokens, 'utf8');
const declaration = original.match(/--color-accent:\s*(#[0-9a-f]{6})\s*;/i);
assert(declaration, 'Expected a light-theme accent token.');
const probe =
  declaration[1].toLowerCase() === '#466b85' ? '#486a83' : '#466b85';
const browser = await chromium.launch();
const page = await browser.newPage({ colorScheme: 'light' });
let changed = false;

try {
  await page.goto('http://127.0.0.1:4321/');
  await page.locator('[data-theme-toggle]:not([hidden])').waitFor();
  const navigationStart = await page.evaluate(() => performance.timeOrigin);
  const initialAccent = await page.evaluate(() =>
    getComputedStyle(document.documentElement)
      .getPropertyValue('--color-accent')
      .trim(),
  );
  await writeFile(
    tokens,
    original.replace(declaration[0], `--color-accent: ${probe};`),
  );
  changed = true;
  await page.waitForFunction(
    (expected) =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-accent')
        .trim() === expected,
    probe,
    { timeout: 10_000 },
  );
  assert.equal(
    await page.evaluate(() => performance.timeOrigin),
    navigationStart,
  );
  await writeFile(tokens, original);
  changed = false;
  await page.waitForFunction(
    (expected) =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-accent')
        .trim() === expected,
    initialAccent,
    { timeout: 10_000 },
  );
  console.log(
    'HMR passed: the accent updated without a page reload, and the source was restored.',
  );
} finally {
  if (changed) await writeFile(tokens, original);
  await browser.close();
}
