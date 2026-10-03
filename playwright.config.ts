import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4322',
    browserName: 'chromium',
    colorScheme: 'light',
    trace: 'retain-on-failure',
  },
  webServer: {
    // Prevent Astro's agent detection from detaching Playwright's preview process.
    command: 'pnpm preview --host 127.0.0.1 --port 4322 --ignore-lock',
    url: 'http://127.0.0.1:4322',
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
