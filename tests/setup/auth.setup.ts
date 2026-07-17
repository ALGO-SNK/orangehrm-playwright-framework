import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

import { test as setup } from '@playwright/test';

import { env } from '../../src/config/env.js';
import { authenticationFile } from '../../src/fixtures/testFixtures.js';
import { DashboardPage } from '../../src/pages/DashboardPage.js';
import { LoginPage } from '../../src/pages/LoginPage.js';

setup('authenticate as OrangeHRM administrator', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.open();
  await loginPage.login({ username: env.username, password: env.password });
  await dashboardPage.expectLoaded();

  await mkdir(dirname(authenticationFile), { recursive: true });
  await page.context().storageState({ path: authenticationFile });
});
