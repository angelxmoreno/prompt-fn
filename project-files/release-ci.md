# Automated Release CI Plan (Release It)

Goal: Fully automate versioning, tagging, npm publishing, and GitHub Releases using Conventional Commits, powered by [release-it](https://github.com/release-it/release-it).

## Why release-it?

* Predictable versioning when Conventional Commits are enforced.
* Configurable tag formats (e.g., `v${version}`) so tags match npm releases.
* Works locally (`release-it --dry-run`) and in CI (`release-it --ci`).
* Plugin ecosystem (e.g., `@release-it/conventional-changelog`) for changelog generation.

## Required Dev Dependencies

```bash
bun add --dev release-it @release-it/conventional-changelog
```

(Optional) add `@release-it/bumper` or other plugins if needed later.

## `.release-it.json` Template

```json
{
  "git": {
    "commitMessage": "chore: release ${version}",
    "tagName": "v${version}",
    "requireCleanWorkingDir": true,
    "requireUpstream": true
  },
  "npm": {
    "publish": true
  },
  "github": {
    "release": true
  },
  "hooks": {
    "before:init": "bun run lint && bun run check-types && bun test"
  },
  "plugins": {
    "@release-it/conventional-changelog": {
      "preset": "conventionalcommits"
    }
  }
}
```

* `tagName`: controls how tags are generated (e.g., `v1.2.3`).
* `commitMessage`: ensures release commits/tags follow our style.
* `hooks.before:init`: run validation before releasing.

## CI Workflow Outline (`.github/workflows/release.yml`)

```yaml
name: Release

on:
  workflow_dispatch:
  push:
    branches: [main]

env:
  NODE_ENV: production

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      issues: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
      - run: bun install --frozen-lockfile
      - run: bun run lint
      - run: bun run check-types
      - run: bun test
      - name: Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: npx release-it --ci
```

* `fetch-depth: 0` ensures release-it can inspect tags.
* `release-it --ci` skips interactive prompts.
* Provide `NPM_TOKEN` with publish permissions.

## Local Usage

* Preview: `npx release-it --dry-run`.
* Interactive release (prompts for version bump): `npx release-it`.

## Conventional Commits

* Commitlint + Lefthook already enforce the format.
* release-it with the conventional changelog plugin uses `feat`, `fix`, etc., to determine bump.

## Future Enhancements

* Add changelog file updates via hooks (e.g., `@release-it/conventional-changelog` can write to `CHANGELOG.md`).
* Publish docs or assets as part of the release (extra hooks/jobs).

This plan documents how to set up release-it when we’re ready. For now, the repo remains unchanged.
