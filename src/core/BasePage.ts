import { expect, type Locator, type Page } from '@playwright/test';

export abstract class BasePage {
  protected readonly loadingSpinner: Locator;

  protected constructor(protected readonly page: Page) {
    this.loadingSpinner = page.locator('.oxd-loading-spinner');
  }

  protected async navigate(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.waitForAppReady();
  }

  protected async waitForAppReady(): Promise<void> {
    await expect(this.loadingSpinner).toBeHidden();
  }

  async verifyUrl(path: RegExp): Promise<void> {
    await expect(this.page).toHaveURL(path);
  }
}
