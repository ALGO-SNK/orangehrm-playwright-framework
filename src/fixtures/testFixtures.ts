import { test as base, type Page } from '@playwright/test';

import { ApiClient } from '../api/ApiClient.js';
import { env } from '../config/env.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { EmployeeListPage } from '../pages/EmployeeListPage.js';
import { LoginPage } from '../pages/LoginPage.js';

export const authenticationFile = '.auth/admin.json';

interface FrameworkFixtures {
  apiClient: ApiClient;
  authenticatedPage: Page;
  dashboardPage: DashboardPage;
  employeeListPage: EmployeeListPage;
  loginPage: LoginPage;
}

export const test = base.extend<FrameworkFixtures>({
  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      baseURL: env.baseUrl,
      storageState: authenticationFile,
      ignoreHTTPSErrors: env.ignoreHttpsErrors,
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  dashboardPage: async ({ authenticatedPage }, use) => {
    await use(new DashboardPage(authenticatedPage));
  },
  employeeListPage: async ({ authenticatedPage }, use) => {
    await use(new EmployeeListPage(authenticatedPage));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from '@playwright/test';
