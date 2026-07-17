import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { test as base } from '@playwright/test';

import { UiInteractionLabPage } from '../pages/UiInteractionLabPage.js';

interface UiLabFixtures {
  uiLab: UiInteractionLabPage;
}

export const test = base.extend<UiLabFixtures>({
  uiLab: async ({ context, page }, use) => {
    const markup = await readFile(resolve(process.cwd(), 'tests/fixtures/ui-lab.html'), 'utf8');

    await context.route('http://playwright.test/**', async (route) => {
      const url = new URL(route.request().url());
      if (url.pathname === '/api/items') {
        await route.fulfill({
          contentType: 'application/json',
          json: { items: [{ id: 1 }, { id: 2 }] },
        });
        return;
      }
      if (url.pathname === '/popup') {
        await route.fulfill({
          contentType: 'text/html',
          body: '<!doctype html><title>Popup</title><h1>Popup window</h1>',
        });
        return;
      }
      await route.fulfill({ contentType: 'text/html', body: markup });
    });

    await page.goto('http://playwright.test/ui-lab');
    await use(new UiInteractionLabPage(page));
  },
});

export { expect } from '@playwright/test';
