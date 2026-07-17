import { test } from '../../../src/fixtures/testFixtures.js';

test.describe('Employee list', { tag: ['@regression', '@pim'] }, () => {
  test('administrator can open PIM and view employees', async ({
    authenticatedPage,
    dashboardPage,
    employeeListPage,
  }) => {
    await authenticatedPage.goto('/web/index.php/dashboard/index');
    await dashboardPage.openPim();

    await employeeListPage.expectLoaded();
    await employeeListPage.searchAllEmployees();
    await employeeListPage.expectResults();
  });
});
