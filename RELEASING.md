# Releasing

Quick checklist for release-it on this repo.

## Prereqs

- `NPM_TOKEN` secret exists in GitHub Actions (Automation token with publish rights).
- CI can run `bun run lint`, `bun run check-types`, and `bun run test`.

## Workflow notes

- Git identity must be configured before `release-it` runs (tags/commits require it).
- npm auth must be configured via `npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN`.
- `@release-it/conventional-changelog` requires `conventional-changelog-conventionalcommits`.

## Run a release

- Trigger the `Release` workflow in GitHub Actions.
