***

id: api-overview
sidebar\_position: 1
title: API Reference overview
-----------------------------

TypeDoc generates the canonical API docs. Until the hosted site is live, run `bun docs` from the repo root to produce `docs/api`. The Docusaurus build copies those files into this section.

## Key exports

* `definePrompt(config)` – core factory that returns a typed async function. Config described in `src/definePrompt.ts`.
* `DefinePromptConfig` / `DefinePromptConfigSchema` – Zod schema + TypeScript type for prompt definitions.
* `recoverFromContent` utilities – JSON recovery helpers for providers that wrap structured output in strings.
* `createLogger` – thin wrapper around `pino` for consistent log metadata.

## Workflow

1. Update source code with TSDoc comments (see `project-files/typedoc-setup.md`).
2. Run `bun docs` to regenerate the markdown.
3. Copy or link the generated files into `docs-site/docs/api-reference`.
4. Commit both the source and the regenerated docs so consumers browsing GitHub can view the latest API signatures.

Once the hosted docs are deployed, we will link directly to the published pages instead of the repository markdown.
