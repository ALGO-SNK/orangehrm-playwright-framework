import { test, expect } from '../../src/fixtures/uiLabFixtures.js';

test.describe('Browser storage', { tag: ['@features', '@storage'] }, () => {
  test('persists session storage across reloads in the same page', async ({ uiLab }) => {
    await uiLab.page.evaluate(() => sessionStorage.setItem('activeTab', 'employees'));
    await uiLab.page.reload();

    const activeTab = await uiLab.page.evaluate(() => sessionStorage.getItem('activeTab'));
    expect(activeTab).toBe('employees');
  });

  test('shares local storage but isolates session storage between pages', async ({ uiLab }) => {
    await uiLab.page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      sessionStorage.setItem('wizardStep', '3');
    });

    const secondPage = await uiLab.page.context().newPage();
    await secondPage.goto('http://playwright.test/ui-lab');
    const storage = await secondPage.evaluate(() => ({
      localTheme: localStorage.getItem('theme'),
      sessionStep: sessionStorage.getItem('wizardStep'),
    }));

    expect(storage).toEqual({ localTheme: 'dark', sessionStep: null });
    await secondPage.close();
  });
});
