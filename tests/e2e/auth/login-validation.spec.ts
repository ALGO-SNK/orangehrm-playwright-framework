import { test } from '../../../src/fixtures/testFixtures.js';

const validationScenarios = [
  { name: 'missing username', username: '', password: 'admin123', errorCount: 1 },
  { name: 'missing password', username: 'Admin', password: '', errorCount: 1 },
  { name: 'missing username and password', username: '', password: '', errorCount: 2 },
] as const;

test.describe('Login validation', { tag: ['@regression', '@auth', '@data-driven'] }, () => {
  for (const scenario of validationScenarios) {
    test(`shows required validation for ${scenario.name}`, async ({ loginPage }) => {
      await loginPage.open();
      await loginPage.login({ username: scenario.username, password: scenario.password });

      await loginPage.expectRequiredErrorCount(scenario.errorCount);
    });
  }
});
