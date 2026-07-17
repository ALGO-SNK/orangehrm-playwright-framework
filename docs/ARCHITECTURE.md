# Framework architecture and standards

## Design rules

1. Tests describe business behavior and contain the final user-visible assertions.
2. Page Objects expose actions and page-level state, not generic click wrappers.
3. Components represent repeated regions such as navigation, tables, dialogs, and menus.
4. Fixtures own dependency construction, browser-context isolation, authentication, and cleanup.
5. API clients own endpoint details and response-status contracts.
6. Configuration is parsed once and fails fast when required values are missing.
7. Parallel tests must not depend on execution order or shared mutable test data.

## Authentication model

The `setup` project authenticates once and writes ignored browser state to `.auth/admin.json`.
Business tests receive a fresh browser context initialized from that state. Login tests use the
default unauthenticated `page`, so they cannot pollute business flows. Every browser project depends
on setup and can still be sharded by Playwright.

For systems where accounts modify server-side state, replace the shared setup with worker-scoped
accounts. Allocate one account per `parallelIndex`, create it via API, and delete it in worker
teardown.

## Locator policy

Use locators in this order:

1. `getByRole`, `getByLabel`, `getByPlaceholder`, or `getByText`
2. A product-owned `data-testid`
3. A scoped CSS selector only when the application exposes no semantic contract

Never use XPath, layout-dependent `nth()` chains, or generated class names when a user-facing
contract exists. OrangeHRM currently requires a few scoped `.oxd-*` selectors for shared widgets;
keep these inside Page Objects or components.

## Test taxonomy

- `@smoke`: fast deployment gate; read-only and high-value
- `@regression`: broader business coverage
- `@api`: HTTP/service-level coverage
- capability tag such as `@auth` or `@pim`: ownership and selective runs

Keep a smoke test under two minutes. Quarantine is not a fix: capture evidence, create a defect,
assign an owner and expiry date, then repair or remove the test.

## Parallel safety

- Generate unique data with `uniqueValue()`.
- Never depend on a test created by another test.
- Avoid fixed sleeps; wait on a user-visible state, response, or domain event.
- Keep cleanup in fixtures or `try/finally` when a test creates server data.
- Avoid destructive cases on the shared public demo.

## Adding a capability

1. Add domain types under `src/models`.
2. Add repeated regions under `src/components`.
3. Add a Page Object under `src/pages` or an API client under `src/api`.
4. Expose it through `src/fixtures/testFixtures.ts`.
5. Add tagged tests grouped by capability.
6. Run `npm run validate` and the smallest relevant browser suite.

## Quality gates

Every pull request must pass strict TypeScript, ESLint with type information, Prettier, successful
test discovery, and the browser matrix. `forbidOnly` prevents committed focused tests in CI. A
failed retry is still reported as flaky and should be investigated rather than normalized.
