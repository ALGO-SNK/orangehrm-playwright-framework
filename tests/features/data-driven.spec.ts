import { test, expect } from '../../src/fixtures/uiLabFixtures.js';

const profiles = [
  { name: 'Asha', email: 'asha@example.com', country: 'IN' },
  { name: 'Ben', email: 'ben@example.com', country: 'GB' },
  { name: 'Chen', email: 'chen@example.com', country: 'US' },
] as const;

test.describe('Data-driven profiles', { tag: ['@features', '@data-driven'] }, () => {
  for (const profile of profiles) {
    test(`submits profile for ${profile.name}`, async ({ uiLab }) => {
      await uiLab.nameInput.fill(profile.name);
      await uiLab.emailInput.fill(profile.email);
      await uiLab.countrySelect.selectOption(profile.country);
      await uiLab.saveButton.click();

      await expect(uiLab.formStatus).toContainText(profile.name);
      await expect(uiLab.formStatus).toContainText(profile.email);
      await expect(uiLab.formStatus).toContainText(profile.country);
    });
  }
});
