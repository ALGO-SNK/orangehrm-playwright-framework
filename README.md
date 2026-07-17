# OrangeHRM Playwright Enterprise Framework

TypeScript end-to-end and API test automation starter for the OrangeHRM public demo. It uses
Playwright fixtures, layered Page Objects and reusable page components, isolated authenticated
contexts, cross-browser projects, parallel execution, trace/video/screenshot evidence, and
CI/CD quality gates.

## Prerequisites

- Node.js 22 or later
- npm 10 or later

## Quick start

```bash
npm ci
npx playwright install --with-deps
cp .env.example .env
npm test
```

The public demo currently advertises `Admin` / `admin123`. Keep even demo credentials in your
local `.env` and use repository secrets in CI. The shared demo can change or throttle concurrent
traffic, so use conservative worker counts for scheduled suites.

## Useful commands

| Command                   | Purpose                                      |
| ------------------------- | -------------------------------------------- |
| `npm test`                | Run every browser project in parallel        |
| `npm run test:smoke`      | Run tests tagged `@smoke`                    |
| `npm run test:regression` | Run tests tagged `@regression`               |
| `npm run test:api`        | Run browser-independent API checks           |
| `npm run test:chromium`   | Run Chromium plus authentication setup       |
| `npm run test:parallel`   | Force fully parallel mode                    |
| `npm run test:ui`         | Open Playwright UI mode                      |
| `npm run validate`        | Type, lint, format, and test-discovery gates |
| `npm run report`          | Open the last HTML report                    |

Run one shard locally or in a CI agent:

```bash
npx playwright test --project=chromium --shard=1/4
```

## Architecture

```text
tests/                 Executable specifications, grouped by capability
  setup/               Authentication dependency project
src/
  api/                 Typed HTTP service wrappers
  components/          Reusable UI fragments (navigation, user menu)
  config/              Validated environment configuration
  core/                Base abstractions
  fixtures/            Dependency injection and isolated contexts
  models/              Domain contracts
  pages/               Business-focused Page Objects
  utils/               Data factories and structured logging
```

Tests express intent; Page Objects own page behavior; components own repeated UI regions; fixtures
own construction and lifecycle. Do not place assertions about business outcomes in low-level
helpers. Prefer accessible roles, labels, placeholders, or application test IDs over CSS selectors.

Start with the [step-by-step usage guide](docs/GETTING_STARTED.md), then see
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for extension rules and
[CONTRIBUTING.md](CONTRIBUTING.md) for the team workflow.

## Configuration

Configuration is validated at startup. Resolution order is `.env`, `.env.<TEST_ENV>`, then
`.env.local`, with later files overriding earlier values. CI values should be injected as secrets.
No credentials, authentication state, or test evidence are committed.

## Reports and diagnostics

- Local: list and HTML reports
- CI: line, HTML, JUnit, and JSON reports
- Failure evidence: screenshot and video
- Retry evidence: Playwright trace on first retry

Open a trace with `npx playwright show-trace test-results/<trace.zip>`.

## CI/CD

- GitHub Actions performs static gates, then runs a 3-browser × 2-shard matrix and uploads evidence.
- Tagged releases build and publish a pinned Playwright runner image to GHCR.
- Jenkins runs the same gates and three browser stages in parallel using a managed credential.
- Docker and Compose provide a reproducible local or agent runtime.

Create GitHub secrets named `ORANGEHRM_USERNAME` and `ORANGEHRM_PASSWORD`. In Jenkins, create a
Username/Password credential with ID `orangehrm-demo`.

## Important demo-environment note

OrangeHRM's public demo is shared and reset outside this framework's control. Keep smoke tests
read-only. For create/update/delete coverage, point `BASE_URL` at a dedicated environment and use
unique test data plus cleanup through API fixtures.
