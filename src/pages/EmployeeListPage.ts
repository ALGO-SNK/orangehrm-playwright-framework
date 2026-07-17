import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from '../core/BasePage.js';

export class EmployeeListPage extends BasePage {
  readonly heading: Locator;
  readonly employeeNameInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly resultRows: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Employee Information' });
    this.employeeNameInput = page.locator('input[placeholder="Type for hints..."]').first();
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.resultRows = page.locator('.oxd-table-body .oxd-table-card');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await this.verifyUrl(/\/pim\/viewEmployeeList$/);
  }

  async searchAllEmployees(): Promise<void> {
    await this.searchButton.click();
    await this.waitForAppReady();
  }

  async expectResults(): Promise<void> {
    await expect(this.resultRows.first()).toBeVisible();
  }
}
