import { test, expect } from '../../src/fixtures/testFixtures.js';

test.describe('Application health', { tag: ['@api', '@smoke'] }, () => {
  test('login endpoint is reachable', async ({ apiClient }) => {
    const response = await apiClient.get('/web/index.php/auth/login');

    expect(response.headers()['content-type']).toContain('text/html');
    expect(await response.text()).toContain('OrangeHRM');
  });
});
