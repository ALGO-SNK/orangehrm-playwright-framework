# Contributing

1. Create a short-lived branch from `main`.
2. Add or update a test for one observable behavior.
3. Keep selectors and workflows inside Page Objects/components.
4. Run `npm run validate` and the relevant smoke/regression project.
5. Open a pull request with the tested environment, evidence, and any known data assumptions.

Use Conventional Commit messages such as `test(pim): cover employee search`. Never commit `.env`,
authentication state, reports, traces, screenshots, videos, or production data.

Reviewers should check business value, determinism, parallel safety, locator resilience, teardown,
negative coverage, and whether failure evidence will explain the defect without rerunning locally.
