import { type Locator, type Page } from '@playwright/test';

export class UserMenu {
  readonly trigger: Locator;

  constructor(private readonly page: Page) {
    this.trigger = page.locator('.oxd-userdropdown-tab');
  }

  async logout(): Promise<void> {
    await this.trigger.click();
    await this.page.getByRole('menuitem', { name: 'Logout' }).click();
  }
}
