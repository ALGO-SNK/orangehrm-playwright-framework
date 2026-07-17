import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from '../core/BasePage.js';
import type { Credentials } from '../models/Credentials.js';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly requiredErrors: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.requiredErrors = page.getByText('Required', { exact: true });
    this.errorAlert = page.locator('.oxd-alert-content-text');
  }

  async open(): Promise<void> {
    await this.navigate('/web/index.php/auth/login');
  }

  async login(credentials: Credentials): Promise<void> {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.loginButton.click();
  }

  async expectInvalidCredentials(): Promise<void> {
    await expect(this.errorAlert).toHaveText('Invalid credentials');
  }

  async expectVisible(): Promise<void> {
    await expect(this.loginButton).toBeVisible();
  }

  async expectRequiredErrorCount(count: number): Promise<void> {
    await expect(this.requiredErrors).toHaveCount(count);
  }

  async expectAuthenticated(): Promise<void> {
    await this.verifyUrl(/\/dashboard\/index$/);
  }
}
