import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async get(path: string, headers: Record<string, string> = {}): Promise<APIResponse> {
    const response = await this.request.get(path, { headers });
    await expect(response, `GET ${path} should succeed`).toBeOK();
    return response;
  }

  async post(
    path: string,
    data: unknown,
    headers: Record<string, string> = {},
  ): Promise<APIResponse> {
    const response = await this.request.post(path, { data, headers });
    await expect(response, `POST ${path} should succeed`).toBeOK();
    return response;
  }
}
