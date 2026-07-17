import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

import type { Credentials } from '../models/Credentials.js';

const injectedEnvironment = { ...process.env };
const testEnvironment = injectedEnvironment.TEST_ENV ?? 'demo';

for (const path of [
  resolve(process.cwd(), '.env'),
  resolve(process.cwd(), `.env.${testEnvironment}`),
  resolve(process.cwd(), '.env.local'),
]) {
  if (existsSync(path)) loadEnv({ path, override: true, quiet: true });
}

// Shell and CI values must win over every local environment file.
Object.assign(process.env, injectedEnvironment);

const optionalPositiveInteger = z.preprocess(
  (value) => (value === undefined || value === '' ? undefined : value),
  z.coerce.number().int().positive().optional(),
);

const optionalNonEmptyString = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().min(1).optional(),
);

const booleanValue = z.enum(['true', 'false']).transform((value) => value === 'true');

const schema = z.object({
  TEST_ENV: z.string().default('demo'),
  BASE_URL: z.url().default('https://opensource-demo.orangehrmlive.com'),
  TEST_USERNAME: optionalNonEmptyString,
  TEST_PASSWORD: optionalNonEmptyString,
  CI: booleanValue.default(false),
  HEADLESS: booleanValue.default(true),
  WORKERS: optionalPositiveInteger,
  RETRIES: z.coerce.number().int().nonnegative().default(0),
  ACTION_TIMEOUT_MS: z.coerce.number().int().positive().default(15_000),
  NAVIGATION_TIMEOUT_MS: z.coerce.number().int().positive().default(30_000),
  TEST_TIMEOUT_MS: z.coerce.number().int().positive().default(60_000),
  EXPECT_TIMEOUT_MS: z.coerce.number().int().positive().default(10_000),
  IGNORE_HTTPS_ERRORS: booleanValue.default(false),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const message = parsed.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  throw new Error(`Invalid test environment configuration:\n${message}`);
}

export const env = {
  testEnvironment: parsed.data.TEST_ENV,
  baseUrl: parsed.data.BASE_URL,
  username: parsed.data.TEST_USERNAME,
  password: parsed.data.TEST_PASSWORD,
  ci: parsed.data.CI,
  headless: parsed.data.HEADLESS,
  workers: parsed.data.WORKERS,
  retries: parsed.data.RETRIES,
  actionTimeoutMs: parsed.data.ACTION_TIMEOUT_MS,
  navigationTimeoutMs: parsed.data.NAVIGATION_TIMEOUT_MS,
  testTimeoutMs: parsed.data.TEST_TIMEOUT_MS,
  expectTimeoutMs: parsed.data.EXPECT_TIMEOUT_MS,
  ignoreHttpsErrors: parsed.data.IGNORE_HTTPS_ERRORS,
} as const;

export function requireCredentials(): Credentials {
  if (!env.username || !env.password) {
    throw new Error(
      'TEST_USERNAME and TEST_PASSWORD are required for authenticated UI tests. ' +
        'Copy .env.example to .env or configure CI secrets.',
    );
  }
  return { username: env.username, password: env.password };
}
