import { test as base } from '@playwright/test';

import { ApiClient } from '../../src/api/ApiClient.js';
import { startMockApiServer, type MockApiServer } from '../support/mockApiServer.js';

interface MockApiFixtures {
  mockApiClient: ApiClient;
  mockApiServer: MockApiServer;
}

export const test = base.extend<MockApiFixtures>({
  mockApiServer: async ({}, use) => {
    const server = await startMockApiServer();
    await use(server);
    await server.close();
  },
  mockApiClient: async ({ playwright, mockApiServer }, use) => {
    const request = await playwright.request.newContext({ baseURL: mockApiServer.baseUrl });
    await use(new ApiClient(request));
    await request.dispose();
  },
});

export { expect } from '@playwright/test';
