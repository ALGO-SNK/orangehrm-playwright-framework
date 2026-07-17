import { test, expect } from '../../src/fixtures/uiLabFixtures.js';

test.describe('UI actions', { tag: ['@features', '@ui-actions'] }, () => {
  test('fills, selects, checks, edits and submits a form', async ({ uiLab }) => {
    await uiLab.nameInput.fill('Asha Tester');
    await uiLab.emailInput.fill('asha@example.com');
    await uiLab.countrySelect.selectOption('IN');
    await uiLab.newsletterCheckbox.check();
    await uiLab.enterprisePlan.check();
    await uiLab.volumeSlider.fill('8');
    await uiLab.notesEditor.fill('Playwright content-editable text');
    await uiLab.saveButton.click();

    await expect(uiLab.nameInput).toHaveValue('Asha Tester');
    await expect(uiLab.countrySelect).toHaveValue('IN');
    await expect(uiLab.newsletterCheckbox).toBeChecked();
    await expect(uiLab.enterprisePlan).toBeChecked();
    await expect(uiLab.formStatus).toContainText('Asha Tester');
    await expect(uiLab.formStatus).toContainText('enterprise');
  });

  test('supports keyboard, hover, double-click and drag-and-drop actions', async ({ uiLab }) => {
    await uiLab.nameInput.focus();
    await uiLab.page.keyboard.type('Keyboard User');
    await uiLab.page.keyboard.press('ControlOrMeta+A');
    await uiLab.page.keyboard.type('Replaced User');
    await uiLab.tooltipTrigger.hover();
    await uiLab.doubleClickButton.dblclick();
    await uiLab.dragSource.dragTo(uiLab.dropTarget);

    await expect(uiLab.nameInput).toHaveValue('Replaced User');
    await expect(uiLab.tooltip).toBeVisible();
    await expect(uiLab.doubleClickStatus).toHaveText('Double-click received');
    await expect(uiLab.dropTarget).toHaveText('Dropped: Drag item');
  });

  test('uploads a memory-backed file and downloads an attachment', async ({ uiLab }) => {
    await uiLab.fileInput.setInputFiles({
      name: 'resume.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Automation Engineer'),
    });
    const downloadPromise = uiLab.page.waitForEvent('download');
    await uiLab.downloadLink.click();
    const download = await downloadPromise;

    await expect(uiLab.eventStatus).toHaveText('resume.txt');
    expect(download.suggestedFilename()).toBe('sample.csv');
  });

  test('captures a popup window', async ({ uiLab }) => {
    const popupPromise = uiLab.page.waitForEvent('popup');
    await uiLab.popupButton.click();
    const popup = await popupPromise;

    await expect(popup).toHaveTitle('Popup');
    await expect(popup.getByRole('heading', { name: 'Popup window' })).toBeVisible();
    await popup.close();
  });
});
