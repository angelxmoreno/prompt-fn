***

id: api-overview
sidebar\_position: 1
title: API Reference overview
-----------------------------

TypeDoc generates the canonical API docs published at [prompt-fn.axmdev.app](https://prompt-fn.axmdev.app/docs/category/api-reference/). Run `bun docs` locally to regenerate the markdown before copying it into this section and deploying the site.

## Key exports

* `definePrompt(config)` – core factory that returns a typed async function. Config described in `src/definePrompt.ts`.
* `DefinePromptConfig` / `DefinePromptConfigSchema` – Zod schema + TypeScript type for prompt definitions.
* `recoverFromContent` utilities – JSON recovery helpers for providers that wrap structured output in strings.
* `createLogger` – thin wrapper around `pino` for consistent log metadata.

## Workflow

1. Update source code with TSDoc comments (see `project-files/typedoc-setup.md`).
2. Run `bun docs` to regenerate the markdown.
3. Copy the generated files into `docs-site/docs/api-reference`.
4. Commit both the source updates and the regenerated docs so the hosted site and GitHub stay in sync.

Once the hosted docs are deployed, we will link directly to the published pages instead of the repository markdown.
