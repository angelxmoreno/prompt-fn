***

sidebar\_position: 1
title: Welcome to prompt-fn
---------------------------

# Build prompts like product code

prompt-fn turns LLM prompts into type-safe async functions. Every prompt has:

* **Schema-first inputs/outputs** powered by Zod (inferred TypeScript types at compile time, validated at runtime).
* **Flexible rendering** via template literals or Eta templates for advanced logic/partials.
* **Provider agnostic models** by wrapping Vercel's AI SDK (`generateObject`/`generateText`) so OpenAI, Gemini, Anthropic, and Ollama work the same way.
* **Resilience tooling** such as pino logging, structured output recovery, and fallback parsing for providers that return malformed JSON.

## Key links

* Read the [Getting Started](./getting-started/installation.md) guide to install the package with Bun or npm and wire up your first prompt.
* Explore the [Guides](./guides/templates-and-renderers.md) to learn how templating, logging, and recovery hooks fit together.
* Dive into [Examples](./examples/support-ticket.md) that mirror the real `examples/` directory in the repo.
* Review the [API Reference](./api-reference/overview.md) generated with TypeDoc and aligned with the `DefinePromptConfig` types.

## Project goals

1. **Prompts as functions**: `const ticket = await definePrompt(...)(input)`—no hand-managed strings.
2. **Type safety everywhere**: input/output schemas live beside the template.
3. **Engine agnostic**: swap providers by passing any Vercel AI SDK model instance.
4. **Operational visibility**: pino loggers and recovery utilities keep production runs observable.
