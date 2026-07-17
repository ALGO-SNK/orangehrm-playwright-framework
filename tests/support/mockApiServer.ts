import { once } from 'node:events';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';

interface UserRecord {
  id: number;
  name: string;
  role: string;
}

export interface MockApiServer {
  baseUrl: string;
  close: () => Promise<void>;
}

function sendJson(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, { 'content-type': 'application/json' });
  response.end(JSON.stringify(body));
}

async function readJson(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk as Uint8Array));
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<string, unknown>;
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export async function startMockApiServer(): Promise<MockApiServer> {
  const users = new Map<number, UserRecord>([
    [1, { id: 1, name: 'Asha', role: 'admin' }],
    [2, { id: 2, name: 'Ben', role: 'employee' }],
    [3, { id: 3, name: 'Chen', role: 'employee' }],
  ]);
  let nextId = 4;

  const handleRequest = async (
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void> => {
    const url = new URL(request.url ?? '/', 'http://127.0.0.1');
    const userMatch = /^\/api\/users\/(\d+)$/.exec(url.pathname);

    if (request.method === 'GET' && url.pathname === '/api/users') {
      const role = url.searchParams.get('role');
      const records = [...users.values()].filter((user) => role === null || user.role === role);
      sendJson(response, 200, { data: records, total: records.length });
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/users') {
      const body = await readJson(request);
      const user: UserRecord = {
        id: nextId++,
        name: asString(body.name),
        role: asString(body.role),
      };
      users.set(user.id, user);
      sendJson(response, 201, user);
      return;
    }

    if (userMatch && request.method === 'PUT') {
      const id = Number(userMatch[1]);
      if (!users.has(id)) {
        sendJson(response, 404, { message: 'User not found' });
        return;
      }
      const body = await readJson(request);
      const user = { id, name: asString(body.name), role: asString(body.role) };
      users.set(id, user);
      sendJson(response, 200, user);
      return;
    }

    if (userMatch && request.method === 'PATCH') {
      const id = Number(userMatch[1]);
      const current = users.get(id);
      if (!current) {
        sendJson(response, 404, { message: 'User not found' });
        return;
      }
      const body = await readJson(request);
      const user = {
        ...current,
        ...(body.name === undefined ? {} : { name: asString(body.name) }),
        ...(body.role === undefined ? {} : { role: asString(body.role) }),
      };
      users.set(id, user);
      sendJson(response, 200, user);
      return;
    }

    if (userMatch && request.method === 'DELETE') {
      const id = Number(userMatch[1]);
      if (!users.delete(id)) {
        sendJson(response, 404, { message: 'User not found' });
        return;
      }
      response.writeHead(204);
      response.end();
      return;
    }

    if (request.method === 'GET' && url.pathname === '/api/protected') {
      if (request.headers.authorization !== 'Bearer test-token') {
        sendJson(response, 401, { message: 'Unauthorized' });
        return;
      }
      sendJson(response, 200, { message: 'Authorized' });
      return;
    }

    if (request.method === 'GET' && url.pathname === '/api/error') {
      sendJson(response, 500, { message: 'Internal server error' });
      return;
    }

    sendJson(response, 404, { message: 'Not found' });
  };

  const server = createServer((request, response) => {
    void handleRequest(request, response).catch((error: unknown) => {
      sendJson(response, 500, {
        message: error instanceof Error ? error.message : 'Unexpected mock server error',
      });
    });
  });

  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Mock API did not bind to a port');

  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: async (): Promise<void> => {
      const closePromise = once(server, 'close');
      server.close();
      await closePromise;
    },
  };
}
