import { z } from 'zod';

import { test, expect } from '../../src/fixtures/testFixtures.js';

const translationSchema = z.record(
  z.string(),
  z.object({ source: z.string(), target: z.string().nullable() }),
);

test.describe('OrangeHRM public API contracts', { tag: ['@api', '@contract'] }, () => {
  test('returns translation messages matching the expected schema', async ({ apiClient }) => {
    const response = await apiClient.get('/web/index.php/core/i18n/messages');
    const messages = translationSchema.parse(await apiClient.json<unknown>(response));

    expect(response.headers()['content-type']).toContain('application/json');
    expect(messages['general.search']?.source).toBe('Search');
    expect(Object.keys(messages).length).toBeGreaterThan(100);
  });

  for (const contract of [
    { endpoint: '/web/index.php/auth/login', contentType: 'text/html' },
    { endpoint: '/web/index.php/core/i18n/messages', contentType: 'application/json' },
  ] as const) {
    test(`responds successfully for ${contract.endpoint}`, async ({ apiClient }) => {
      const response = await apiClient.get(contract.endpoint);

      expect(response.headers()['content-type']).toContain(contract.contentType);
    });
  }
});
