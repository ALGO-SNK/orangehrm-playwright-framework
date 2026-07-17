import { expect, type Locator, type Page } from '@playwright/test';

import { SideNavigation } from '../components/SideNavigation.js';
import { UserMenu } from '../components/UserMenu.js';
import { BasePage } from '../core/BasePage.js';

export class DashboardPage extends BasePage {
  readonly heading: Locator;
  readonly sideNavigation: SideNavigation;
  readonly userMenu: UserMenu;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Dashboard' });
    this.sideNavigation = new SideNavigation(page);
    this.userMenu = new UserMenu(page);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await this.verifyUrl(/\/dashboard\/index$/);
  }

  async openPim(): Promise<void> {
    await this.sideNavigation.open('PIM');
  }
}
