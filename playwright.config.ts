import { defineConfig, devices } from '@playwright/test';

import { env } from './src/config/env.js';

const reporters: Parameters<typeof defineConfig>[0]['reporter'] = env.ci
  ? [
      ['line'],
      ['html', { outputFolder: 'playwright-report', open: 'never' }],
      ['junit', { outputFile: 'reports/junit/results.xml' }],
      ['json', { outputFile: 'reports/json/results.json' }],
    ]
  : [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]];

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results',
  fullyParallel: true,
  forbidOnly: env.ci,
  retries: env.retries,
  ...(env.workers === undefined ? {} : { workers: env.workers }),
  timeout: env.testTimeoutMs,
  expect: { timeout: env.expectTimeoutMs },
  reporter: reporters,
  use: {
    baseURL: env.baseUrl,
    headless: env.headless,
    actionTimeout: env.actionTimeoutMs,
    navigationTimeout: env.navigationTimeoutMs,
    ignoreHTTPSErrors: env.ignoreHttpsErrors,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    testIdAttribute: 'data-testid',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'api',
      testMatch: /.*\/api\/.*\.spec\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      testIgnore: [/.*\.setup\.ts/, /.*\/api\/.*\.spec\.ts/],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
      testIgnore: [/.*\.setup\.ts/, /.*\/api\/.*\.spec\.ts/],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
      testIgnore: [/.*\.setup\.ts/, /.*\/api\/.*\.spec\.ts/],
    },
  ],
});
