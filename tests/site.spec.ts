import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { profile } from '../src/data/profile';
import { projects } from '../src/data/projects';
import { site } from '../src/data/site';

for (const route of ['/']) {
  for (const colorScheme of ['light', 'dark'] as const) {
    for (const width of [390, 1440]) {
      test(`${route} at ${width}px in ${colorScheme} theme`, async ({
        page,
      }, testInfo) => {
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('requestfailed', (request) => errors.push(request.url()));
        await page.setViewportSize({ width, height: 900 });
        await page.emulateMedia({ colorScheme });
        const response = await page.goto(route);
        expect(response?.status()).toBe(200);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await expect(
          page.getByRole('button', { name: 'Dark theme' }),
        ).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        await page
          .locator('main img')
          .evaluateAll((images) =>
            Promise.all(
              images.map((image) => (image as HTMLImageElement).decode()),
            ),
          );

        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        ).toBe(true);
        expect(
          await page.evaluate(() =>
            document.fonts.check('16px "Inter Variable"'),
          ),
        ).toBe(true);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
          'href',
          new URL(route, site.url).href,
        );
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze();
        expect(results.violations).toEqual([]);
        expect(errors).toEqual([]);
        await page.screenshot({
          path: testInfo.outputPath('page.png'),
          fullPage: true,
        });
      });
    }
  }
}

test('narrow and tablet screens retain readable content and usable controls', async ({
  page,
}) => {
  for (const width of [280, 320, 768]) {
    await page.setViewportSize({ width, height: 740 });
    for (const route of ['/', '/404.html']) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      const button = await page
        .getByRole('button', { name: 'Dark theme' })
        .boundingBox();
      expect(button?.width).toBeGreaterThanOrEqual(44);
      expect(button?.height).toBeGreaterThanOrEqual(44);
      if (width === 280 && route === '/') {
        const contacts = await page.locator('.profile-links a').all();
        const first = await contacts[0].boundingBox();
        const last = await contacts[2].boundingBox();
        expect(last!.y).toBeGreaterThanOrEqual(first!.y + first!.height);
      }
    }
  }
});

test('Home is the only navigation destination and root assets work', async ({
  page,
  request,
}) => {
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(navigation.getByRole('link')).toHaveCount(1);
  await expect(
    navigation.getByRole('link', { name: 'Home', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await page.goto('/404.html');
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Home', exact: true })
    .click();
  await expect(page).toHaveURL(/:\d+\/$/);

  const paths = await page
    .locator('a[href^="/"], link[rel="stylesheet"], script[src], img[src]')
    .evaluateAll((nodes) => [
      ...new Set(
        nodes.map(
          (node) => node.getAttribute('href') ?? node.getAttribute('src'),
        ),
      ),
    ]);
  for (const path of paths) {
    expect(path).toBeTruthy();
    expect((await request.get(path!)).status()).toBe(200);
  }
  const sitemap = await request.get('/sitemap-0.xml');
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain(site.url);
  expect(await sitemap.text()).not.toContain('/about');
  expect(await sitemap.text()).not.toContain('404');
  expect((await request.get('/about/')).status()).toBe(404);
});

test('CV content follows the requested order with a compact first viewport', async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveTitle('Weishuo Zhao — Personal homepage');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Weishuo Zhao', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('contentinfo')).toContainText('Weishuo Zhao');
  await expect(page.getByRole('banner')).not.toContainText('Weishuo Zhao');
  await expect(
    page.getByText(
      'My projects explore AI fundamentals, language models, and search algorithms.',
      { exact: true },
    ),
  ).toHaveCount(0);
  await expect(page.getByText("Hello, I'm", { exact: true })).toHaveCount(0);
  const headings = await page
    .getByRole('heading', { level: 2 })
    .allTextContents();
  expect(
    headings.map((text) =>
      text
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/^\d+\s*/, ''),
    ),
  ).toEqual([
    'Education',
    'Projects',
    'Competitions & Awards',
    'Technical Skills',
  ]);
  const education = page.getByRole('region', {
    name: 'Education',
    exact: true,
  });
  await expect(education).toContainText('2025 – Present');
  await expect(education).toContainText(
    'General Artificial Intelligence Experimental Class (Tong Class)',
  );
  await expect(education).toContainText('Beijing, China');
  await expect(
    page.getByRole('heading', { name: 'Education', exact: true }),
  ).toBeInViewport();
  await expect(
    page.getByRole('heading', {
      name: 'Forge Bedrock',
      exact: true,
    }),
  ).toBeInViewport();
  const competitions = page.getByRole('region', {
    name: 'Competitions & Awards',
    exact: true,
  });
  await expect(
    competitions.getByText('Third Prize', { exact: true }),
  ).toHaveCount(2);
  await expect(competitions).not.toContainText('Peking University');
  const technicalSkills = page.getByRole('region', {
    name: 'Technical Skills',
    exact: true,
  });
  await expect(technicalSkills).toContainText('Python, C/C++');
  await expect(technicalSkills).toContainText('PyTorch, NumPy');
  await expect(technicalSkills).toContainText('ML Frameworks & Libraries');
  await expect(technicalSkills).toContainText('Git, Linux, Jupyter, LaTeX');
  await expect(page.getByRole('contentinfo').locator('time')).toHaveText(
    'October, 2026',
  );
  await expect(page.getByRole('contentinfo').locator('time')).toHaveAttribute(
    'datetime',
    '2026-10',
  );
  await expect(page.locator('link[rel~="icon"]')).toHaveCount(0);
  expect((await request.get('/favicon.svg')).status()).toBe(404);
  expect((await request.get('/favicon.ico')).status()).toBe(404);
});

test('optional content follows profile configuration and approved projects', async ({
  page,
}) => {
  await page.goto('/');
  const selected = projects.filter((project) => project.approved);
  await expect(
    page.getByRole('heading', { name: 'Projects', exact: true }),
  ).toHaveCount(selected.length ? 1 : 0);
  await expect(page.getByRole('article')).toHaveCount(selected.length);
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(
    profile.email ? 1 : 0,
  );
  await expect(page.locator('main img')).toHaveCount(profile.portrait ? 1 : 0);
  await expect(page.getByRole('heading', { name: 'Currently' })).toHaveCount(0);
  if (profile.portrait) {
    await expect(page.locator('main img')).toHaveAttribute(
      'alt',
      profile.portrait.alt,
    );
    expect(await page.locator('main img').getAttribute('width')).toBeTruthy();
    expect(await page.locator('main img').getAttribute('height')).toBeTruthy();
    const avatar = page.locator('main img');
    await expect(avatar).toBeVisible();
    await expect
      .poll(() =>
        avatar.evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
      )
      .toBe(true);
    const frame = avatar.locator('xpath=../..');
    expect(
      await frame.evaluate((element) => getComputedStyle(element).borderRadius),
    ).toBe('50%');
    const bounds = await frame.boundingBox();
    expect(bounds).toBeTruthy();
    expect(Math.abs(bounds!.width - bounds!.height)).toBeLessThan(1);
  }
  for (const paragraph of profile.biography) {
    await expect(page.getByText(paragraph, { exact: true })).toHaveCount(1);
  }
  await expect(
    page.getByRole('link', { name: 'Email', exact: true }),
  ).toHaveAttribute('href', `mailto:${profile.email}`);
  await expect(
    page.getByRole('link', { name: 'GitHub', exact: true }),
  ).toHaveAttribute('href', profile.githubUrl!);
  await expect(
    page.getByRole('link', { name: '知乎', exact: true }),
  ).toHaveAttribute('href', profile.zhihuUrl!);
  const contacts = page.locator('.profile-links').getByRole('link');
  expect(
    (await contacts.allTextContents()).map((text) =>
      text.replace(/\s+/g, ' ').trim(),
    ),
  ).toEqual(['Email', 'GitHub', '知乎']);
  const contactBounds = await Promise.all(
    (await contacts.all()).map((link) => link.boundingBox()),
  );
  for (let index = 0; index < contactBounds.length; index++) {
    const bounds = contactBounds[index];
    expect(bounds).toBeTruthy();
    expect(bounds!.height).toBeGreaterThanOrEqual(44);
    if (index > 0) {
      const previous = contactBounds[index - 1]!;
      expect(bounds!.y).toBe(previous.y);
      expect(bounds!.x).toBeGreaterThan(previous.x + previous.width);
    }
  }
  if (profile.copyStatus === 'draft') {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, follow',
    );
  }
});

test('theme follows OS changes until overridden, then persists across pages and tabs', async ({
  page,
  context,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(html).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Dark theme' }).click();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await page.goto('/404.html');
  await expect(html).toHaveAttribute('data-theme', 'dark');

  const secondTab = await context.newPage();
  await secondTab.goto('/');
  await expect(secondTab.locator('html')).toHaveAttribute('data-theme', 'dark');
  await secondTab.getByRole('button', { name: 'Dark theme' }).click();
  await expect(html).toHaveAttribute('data-theme', 'light');
});

test('keyboard users can skip navigation and operate the theme toggle', async ({
  page,
}) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to content' });
  await expect(skipLink).toBeFocused();
  expect((await skipLink.boundingBox())?.y).toBeGreaterThanOrEqual(0);
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();

  await page.goto('/');
  for (let index = 0; index < 3; index++) await page.keyboard.press('Tab');
  const toggle = page.getByRole('button', { name: 'Dark theme' });
  await expect(toggle).toBeFocused();
  expect(
    await toggle.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe('solid');
  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(toggle).toHaveAttribute('aria-label', 'Dark theme');
  await expect(toggle).toHaveAttribute('title', 'Switch to light theme');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('theme toggle still works when local storage is blocked', async ({
  page,
}) => {
  await page.addInitScript(() => {
    for (const method of ['getItem', 'setItem']) {
      Object.defineProperty(Storage.prototype, method, {
        value() {
          throw new DOMException('Storage is blocked', 'SecurityError');
        },
      });
    }
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('without JavaScript, content and OS dark theme remain usable', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    colorScheme: 'dark',
  });
  const page = await context.newPage();
  try {
    await page.goto('http://127.0.0.1:4322/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('[data-theme-toggle]')).toBeHidden();
    expect(
      await page
        .locator('html')
        .evaluate((element) => getComputedStyle(element).backgroundColor),
    ).toBe('rgb(24, 26, 27)');
    await page.goto('http://127.0.0.1:4322/404.html');
    await page.getByRole('link', { name: 'Back to home' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  } finally {
    await context.close();
  }
});

test('404 retains navigation and is excluded from indexing', async ({
  page,
}) => {
  await page.goto('/404.html');
  await expect(
    page.getByRole('heading', { name: 'Page not found.' }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, follow',
  );
  await page.getByRole('link', { name: 'Back to home' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
