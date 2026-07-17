import { test, expect } from '../../src/fixtures/uiLabFixtures.js';

test.describe('Locator strategies', { tag: ['@features', '@locators'] }, () => {
  test('uses role, label, placeholder, test ID, text and CSS locators', async ({ uiLab }) => {
    await expect(uiLab.page.getByRole('heading', { name: 'Profile form' })).toBeVisible();
    await expect(uiLab.page.getByLabel('Email')).toHaveAttribute('type', 'email');
    await expect(uiLab.page.getByPlaceholder('Full name')).toBeVisible();
    await expect(uiLab.page.getByTestId('name-input')).toBeVisible();
    await expect(uiLab.page.getByText('Playwright UI Interaction Lab')).toBeVisible();
    await expect(uiLab.page.locator('form#profile-form')).toBeVisible();
  });

  test('chains and filters locators inside a semantic table', async ({ uiLab }) => {
    const table = uiLab.page.getByRole('table', { name: 'Users' });
    const employeeRows = table.getByRole('row').filter({ hasText: 'Employee' });
    const ashaRow = table.getByRole('row').filter({ has: uiLab.page.getByText('Asha') });

    await expect(uiLab.userRows).toHaveCount(4);
    await expect(employeeRows).toHaveCount(2);
    await expect(ashaRow).toContainText('Administrator');
  });
});
