import { z } from 'zod';

import { test, expect } from '../fixtures/mockApiFixtures.js';

const userSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  role: z.enum(['admin', 'employee', 'manager']),
});

const userListSchema = z.object({
  data: z.array(userSchema),
  total: z.number().int().nonnegative(),
});

test.describe('Mock user API', { tag: ['@api', '@data-driven'] }, () => {
  for (const scenario of [
    { role: 'admin', expectedCount: 1 },
    { role: 'employee', expectedCount: 2 },
  ] as const) {
    test(`filters users with role=${scenario.role}`, async ({ mockApiClient }) => {
      const response = await mockApiClient.get('/api/users', {
        params: { role: scenario.role },
      });
      const body = userListSchema.parse(await mockApiClient.json<unknown>(response));

      expect(body.total).toBe(scenario.expectedCount);
      expect(body.data.every((user) => user.role === scenario.role)).toBe(true);
    });
  }

  test('creates, replaces, updates and deletes a user', async ({ mockApiClient }) => {
    const createdResponse = await mockApiClient.post('/api/users', {
      data: { name: 'Devi', role: 'employee' },
      expectedStatus: 201,
    });
    const created = userSchema.parse(await mockApiClient.json<unknown>(createdResponse));

    const replacedResponse = await mockApiClient.put(`/api/users/${created.id}`, {
      data: { name: 'Devi Rao', role: 'manager' },
    });
    const replaced = userSchema.parse(await mockApiClient.json<unknown>(replacedResponse));

    const patchedResponse = await mockApiClient.patch(`/api/users/${created.id}`, {
      data: { role: 'admin' },
    });
    const patched = userSchema.parse(await mockApiClient.json<unknown>(patchedResponse));

    await mockApiClient.delete(`/api/users/${created.id}`);
    const missingResponse = await mockApiClient.get(`/api/users/${created.id}`, {
      expectedStatus: 404,
    });

    expect(replaced).toMatchObject({ name: 'Devi Rao', role: 'manager' });
    expect(patched).toMatchObject({ name: 'Devi Rao', role: 'admin' });
    expect(await mockApiClient.json<unknown>(missingResponse)).toEqual({
      message: 'Not found',
    });
  });

  test('validates authorization and server-error responses', async ({ mockApiClient }) => {
    await mockApiClient.get('/api/protected', { expectedStatus: 401 });
    const authorized = await mockApiClient.get('/api/protected', {
      headers: { authorization: 'Bearer test-token' },
    });
    const error = await mockApiClient.get('/api/error', { expectedStatus: 500 });

    expect(await mockApiClient.json<unknown>(authorized)).toEqual({ message: 'Authorized' });
    expect(await mockApiClient.json<unknown>(error)).toEqual({
      message: 'Internal server error',
    });
  });
});
