import { test, expect } from '../../src/fixtures/uiLabFixtures.js';

test.describe('Dialogs, frames and browser events', { tag: ['@features', '@events'] }, () => {
  test('handles alert, confirm and prompt dialogs', async ({ uiLab }) => {
    uiLab.page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('Alert received');
      await dialog.accept();
    });
    await uiLab.alertButton.click();

    uiLab.page.once('dialog', (dialog) => dialog.dismiss());
    await uiLab.confirmButton.click();
    await expect(uiLab.eventStatus).toHaveText('Cancelled');

    uiLab.page.once('dialog', (dialog) => dialog.accept('SNK'));
    await uiLab.promptButton.click();
    await expect(uiLab.eventStatus).toHaveText('Hello SNK');
  });

  test('interacts with controls inside an iframe', async ({ uiLab }) => {
    await uiLab.paymentFrame.getByLabel('Card number').fill('4111111111111111');
    await uiLab.paymentFrame.getByRole('button', { name: 'Pay now' }).click();

    await expect(uiLab.paymentFrame.locator('#payment-status')).toHaveText('Payment submitted');
  });

  test('listens for console, request and response events', async ({ uiLab }) => {
    const consolePromise = uiLab.page.waitForEvent('console', {
      predicate: (message) => message.text() === 'UI lab console event',
    });
    await uiLab.consoleButton.click();
    const consoleMessage = await consolePromise;

    const requestPromise = uiLab.page.waitForRequest((request) =>
      request.url().includes('/api/items?limit=2'),
    );
    const responsePromise = uiLab.page.waitForResponse((response) =>
      response.url().includes('/api/items?limit=2'),
    );
    await uiLab.fetchButton.click();
    const [request, response] = await Promise.all([requestPromise, responsePromise]);

    expect(consoleMessage.type()).toBe('log');
    expect(request.method()).toBe('GET');
    expect(response.status()).toBe(200);
    await expect(uiLab.apiStatus).toHaveText('2 items loaded');
  });
});
