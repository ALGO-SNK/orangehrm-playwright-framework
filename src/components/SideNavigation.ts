import { type Locator, type Page } from '@playwright/test';

export class SideNavigation {
  readonly root: Locator;

  constructor(page: Page) {
    this.root = page.locator('aside');
  }

  async open(moduleName: string): Promise<void> {
    await this.root.getByRole('link', { name: moduleName, exact: true }).click();
  }
}
