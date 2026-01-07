# Repository Guidelines

## Project Structure & Module Organization

`src/index.ts` contains the public `prompt-fn` entry point plus helper utilities; keep additional modules close to their domain inside `src/` so tree shaking stays predictable. Tests live under `test/` (e.g., `test/stub.test.ts`) and should mirror the source layout with `*.test.ts` files. Example prompts, docs, and supporting assets belong in `project-files/`. Tooling configs (`biome.json`, `tsconfig.json`, `lefthook.yml`) sit at the repo root—update them in place so automation stays in sync.

## Build, Test, and Development Commands

* `bun install` installs dependencies; lockfile is `bun.lock` so stay on Bun.
* `bun test` runs the Bun test runner (`bun:test`). Use `bun test --watch` for tight loops.
* `bun run lint` executes Biome lint + format checks; `bun run lint:fix` applies safe rewrites.
* `bun run check-types` runs `tsc --noEmit` to ensure exported types remain sound.
* `bun run prepare` installs Lefthook Git hooks locally when dependencies change.

## Coding Style & Naming Conventions

Biome enforces 4-space indentation, 120 character lines, single quotes, `es5` trailing commas, and mandatory semicolons. Favor TypeScript `type` aliases for public shapes and `interface` only when extending. Use PascalCase for exported types/classes, camelCase for functions and variables, and kebab-case for file names (`prompt-config.ts`). Keep modules small, pure, and side-effect free; export a single `definePrompt` helper per file when possible.

## Testing Guidelines

Use `bun:test` (`describe/it/expect`) and colocate fixtures under `test/fixtures` if needed. Name suites after the unit under test (`describe('definePrompt')`). Every new prompt helper should have happy-path and validation tests plus one failure-mode assertion. Aim for meaningful coverage rather than a numeric gate; rely on `bun test --coverage` when refactoring critical parsing logic.

## Commit & Pull Request Guidelines

Commits must follow Conventional Commit syntax enforced by Commitlint (e.g., `feat: support eta templates`). Each PR should include: purpose summary, linked issue or context, testing evidence (`bun test`, `bun run lint`, `bun run check-types`), and screenshots or logs when behavior affects runtimes. Keep PRs focused—split API and docs changes when feasible—and ensure hooks pass before requesting review.

## Tooling & Automation Notes

Lefthook pre-commit runs linting and type checks in parallel; fix failures locally rather than skipping. The `commit-msg` hook runs Commitlint automatically—leave it enabled so CI stays green.
