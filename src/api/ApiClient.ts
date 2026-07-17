import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';

type QueryParameters = Record<string, boolean | number | string>;

interface RequestOptions {
  expectedStatus?: number;
  headers?: Record<string, string>;
  params?: QueryParameters;
}

interface DataRequestOptions extends RequestOptions {
  data: unknown;
}

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async get(path: string, options: RequestOptions = {}): Promise<APIResponse> {
    const response = await this.request.get(path, {
      ...(options.headers === undefined ? {} : { headers: options.headers }),
      ...(options.params === undefined ? {} : { params: options.params }),
    });
    this.expectStatus(response, options.expectedStatus ?? 200, `GET ${path}`);
    return response;
  }

  async post(path: string, options: DataRequestOptions): Promise<APIResponse> {
    const response = await this.request.post(path, {
      data: options.data,
      ...(options.headers === undefined ? {} : { headers: options.headers }),
      ...(options.params === undefined ? {} : { params: options.params }),
    });
    this.expectStatus(response, options.expectedStatus ?? 200, `POST ${path}`);
    return response;
  }

  async put(path: string, options: DataRequestOptions): Promise<APIResponse> {
    const response = await this.request.put(path, {
      data: options.data,
      ...(options.headers === undefined ? {} : { headers: options.headers }),
      ...(options.params === undefined ? {} : { params: options.params }),
    });
    this.expectStatus(response, options.expectedStatus ?? 200, `PUT ${path}`);
    return response;
  }

  async patch(path: string, options: DataRequestOptions): Promise<APIResponse> {
    const response = await this.request.patch(path, {
      data: options.data,
      ...(options.headers === undefined ? {} : { headers: options.headers }),
      ...(options.params === undefined ? {} : { params: options.params }),
    });
    this.expectStatus(response, options.expectedStatus ?? 200, `PATCH ${path}`);
    return response;
  }

  async delete(path: string, options: RequestOptions = {}): Promise<APIResponse> {
    const response = await this.request.delete(path, {
      ...(options.headers === undefined ? {} : { headers: options.headers }),
      ...(options.params === undefined ? {} : { params: options.params }),
    });
    this.expectStatus(response, options.expectedStatus ?? 204, `DELETE ${path}`);
    return response;
  }

  async json<T>(response: APIResponse): Promise<T> {
    return (await response.json()) as T;
  }

  private expectStatus(response: APIResponse, expectedStatus: number, operation: string): void {
    expect(response.status(), `${operation} should return ${expectedStatus}`).toBe(expectedStatus);
  }
}
