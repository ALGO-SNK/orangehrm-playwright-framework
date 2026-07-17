import { env } from '../../../src/config/env.js';
import { test } from '../../../src/fixtures/testFixtures.js';

test.describe('Login', { tag: ['@smoke', '@auth'] }, () => {
  test('administrator can log in with valid credentials', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login({ username: env.username, password: env.password });

    await loginPage.expectAuthenticated();
  });

  test('invalid credentials are rejected', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login({ username: 'invalid-user', password: 'invalid-password' });

    await loginPage.expectInvalidCredentials();
  });
});
