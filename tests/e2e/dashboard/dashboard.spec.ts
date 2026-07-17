import { test } from '../../../src/fixtures/testFixtures.js';

test.describe('Dashboard', { tag: ['@smoke', '@regression'] }, () => {
  test('authenticated administrator sees the dashboard', async ({
    authenticatedPage,
    dashboardPage,
  }) => {
    await authenticatedPage.goto('/web/index.php/dashboard/index');

    await dashboardPage.expectLoaded();
  });
});
