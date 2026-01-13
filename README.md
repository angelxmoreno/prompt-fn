# prompt-fn

[![License](https://img.shields.io/github/license/angelxmoreno/prompt-fn?label=License\&style=flat)](https://github.com/angelxmoreno/prompt-fn/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg?style=flat\&logo=typescript\&logoColor=white)](http://www.typescriptlang.org/)
[![npm version](https://img.shields.io/npm/v/prompt-fn?style=flat\&color=ff69b4)](https://www.npmjs.com/package/prompt-fn)
[![codecov](https://codecov.io/gh/angelxmoreno/prompt-fn/graph/badge.svg?token=4THUXVOS1T\&style=flat)](https://codecov.io/gh/angelxmoreno/prompt-fn)
[![Last Commit](https://img.shields.io/github/last-commit/angelxmoreno/prompt-fn?label=Last%20Commit\&style=flat)](https://github.com/angelxmoreno/prompt-fn/commits/main)
[![dependencies](https://img.shields.io/librariesio/release/npm/prompt-fn?color=%23007a1f\&style=flat)](https://libraries.io/npm/prompt-fn)
[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=flat\&logo=bun\&logoColor=white)](https://bun.sh)
[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat\&logo=biome)](https://biomejs.dev/)

Type-safe, composable LLM functions powered by the Vercel AI SDK.

`prompt-fn` turns prompts into reusable TypeScript functions with enforced schemas, prompt-aware logging, and resilient recovery across providers.

[📘 Contribution Guide](CONTRIBUTING.md) • [🤝 Code of Conduct](CODE_OF_CONDUCT.md) • [🧭 llms.txt](https://prompt-fn.axmdev.app/llms.txt)

## Features

* **Type-Safe:** `definePrompt` requires Zod schemas for both inputs and outputs so every call is validated twice.
* **Structured Output:** Uses `generateText` + `Output.object` for primary parsing and falls back to recovery helpers when providers wrap JSON in strings (e.g., OpenAI-compatible Ollama).
* **Flexible Templating:** Use template literals for simple prompts or Eta views/functions for complex layouts.
* **Model Agnostic:** Accepts any Vercel AI SDK `LanguageModel` instance or raw model name (Google, OpenAI, Anthropic, Ollama, etc.).
* **Integrated Logging:** Built on `pino` with prompt-level metadata and downgraded warnings when recovery succeeds.
* **Robust:** Built-in retries from the AI SDK plus custom recovery utilities to extract structured data from malformed responses.

## Installation

```bash
# Bun (preferred)
bun add prompt-fn ai zod pino pino-pretty
# Install your preferred providers (examples)
bun add @ai-sdk/google ai-sdk-ollama

# npm alternative
npm install prompt-fn ai zod pino pino-pretty
npm install @ai-sdk/google ai-sdk-ollama
```

## Usage

### Example Projects

* `examples/support-ticket.ts`: triage customer support emails into severities and next actions using Ollama or OpenAI-compatible endpoints.
* `examples/product-brief.ts`: generate a marketing brief and checklist using Google Gemini with an Eta template.

### 1. Structured Text Response

```typescript
import { definePrompt } from 'prompt-fn';
import { z } from 'zod';
import { ollama } from 'ai-sdk-ollama';

const sayHello = definePrompt({
    name: 'sayHello',
    model: ollama('llama3.1'),
    inputSchema: z.object({
        name: z.string(),
    }),
    outputSchema: z.object({
        message: z.string(),
    }),
    template: (input) => `Say hello to ${input.name} in a pirate voice and keep it short.`,
});

const response = await sayHello({ name: 'World' });
console.log(response.message); // "Ahoy there, World!"
```

### 2. Structured Data Extraction

```typescript
import { definePrompt } from 'prompt-fn';
import { z } from 'zod';
import { google } from '@ai-sdk/google';

const extractRecipe = definePrompt({
    name: 'extractRecipe',
    model: google('gemini-2.0-flash'),
    inputSchema: z.object({
        dish: z.string(),
    }),
    outputSchema: z.object({
        ingredients: z.array(z.string()),
        steps: z.array(z.string()),
        calories: z.number().optional(),
    }),
    template: (input) => `Give me a recipe for ${input.dish}.`,
});

const result = await extractRecipe({ dish: 'Spaghetti Carbonara' });
console.log(result.ingredients);
```

### 3. Using Eta Templates + Custom Logger

```typescript
import { definePrompt } from 'prompt-fn';
import { z } from 'zod';
import { Eta } from 'eta';
import pino from 'pino';

const eta = new Eta({ views: './templates' });
const logger = pino({ level: 'debug' });

const complexReport = definePrompt({
    name: 'complexReport',
    model: google('gemini-2.0-flash'),
    eta,
    logger,
    inputSchema: z.object({ /* ... */ }),
    outputSchema: z.object({ /* ... */ }),
    template: 'daily-report.eta',
});
```

## API Reference

Full API documentation now lives at **[https://prompt-fn.axmdev.app/docs/category/api-reference/](https://prompt-fn.axmdev.app/docs/category/api-reference/)**. Highlights:

### `definePrompt(config)`

Creates a callable async function.

| Property | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | Required identifier used for logging and debugging. |
| `description` | `string?` | Optional LLM hint that can be forwarded to providers. |
| `model` | `LanguageModel \| string` | Vercel AI SDK model instance or a raw model name. |
| `inputSchema` | `z.ZodType<T>` | Validates the function arguments before rendering. |
| `outputSchema` | `z.ZodType<U>` | Required schema that enforces structured responses. |
| `template` | `string \| TemplateRenderer` | Either a literal/Eta template id or `(input) => string`. |
| `eta` | `Eta?` | Enables Eta rendering when templates are strings. |
| `logger` | `pino.Logger?` | Supply a custom logger; otherwise `pino(pino-pretty())` is used. |

`Result` is always `z.infer<typeof outputSchema>`. If the provider replies with JSON as a quoted string, `prompt-fn` attempts recovery before surfacing an error.

## Provider Compatibility & Recovery

Many OpenAI-compatible endpoints (notably Ollama's REST server) wrap JSON objects inside plain-text responses. `prompt-fn` recovers by:

1. reading `generation.output` parsed by the AI SDK.
2. sniffing the raw HTTP response when API errors surface.
3. parsing streamed content directly if structured output is missing.

Successful recoveries emit `logger.warn`, allowing tests to pass while signaling data quirks. If every layer fails, errors propagate with full context for easier debugging.

## Relationship to the Vercel AI SDK

`prompt-fn` is not a replacement for the Vercel AI SDK—it is a thin layer on top of it. We:

* Re-export nothing from `ai`; you still install and import providers (OpenAI, Google, Anthropic, Ollama, etc.) directly from the AI SDK ecosystem.
* Call `generateText` under the hood so the SDK keeps handling retries, streaming, telemetry, and provider routing.
* Lean on AI SDK testing primitives (`MockLanguageModelV3`, `simulateReadableStream`, etc.) so every unit test mirrors real provider behavior.

Because of that, upgrades to the AI SDK automatically flow through `prompt-fn`; if a provider adds new options, you can pass them via the `model` factory without waiting on this library.

## Testing

Integration coverage lives under `test/integration`. Use targeted commands when iterating against specific providers:

```bash
bun test test/integration/integration.test.ts   # Runs Ollama SDK, Google Gemini, and OpenAI-compatible suites
bun run check-types                              # Ensures exported types remain sound
```

### Integration Test Environment

Integration suites are opt-in so your CI doesn’t hit real models accidentally. Set the following variables before invoking `bun test test/integration/integration.test.ts`:

* `RUN_INTEGRATION_TESTS=true` – turns the entire `describe` block on.
* `OLLAMA_AI_HOST=http://127.0.0.1:11434` – required for the Ollama SDK + OpenAI-compatible scenarios.
* `GEMINI_API_KEY=...` – enables the Google Gemini check (skipped when unset).

Each provider block is guarded with `describe.skipIf(...)`, so missing variables simply skip that scenario. When all are provided, the test will call three different providers sequentially:

```bash
RUN_INTEGRATION_TESTS=true \
OLLAMA_AI_HOST=http://127.0.0.1:11434 \
GEMINI_API_KEY=your-key \
    bun test test/integration/integration.test.ts
```

Adjust or add additional env vars as you introduce more providers in the future.

### Testing Your Prompts in Other Projects

When you depend on `prompt-fn` inside another app or package, you can test your prompts without hitting real providers by reusing the AI SDK mocks (see the [AI SDK Testing Guide](https://ai-sdk.dev/docs/ai-sdk-core/testing)):

```typescript
import { definePrompt } from 'prompt-fn';
import { z } from 'zod';
import { MockLanguageModelV3 } from 'ai/test';

const mockModel = new MockLanguageModelV3({
    doGenerate: async () => ({
        content: [{ type: 'text', text: '{"summary":"ok"}' }],
        finishReason: { unified: 'stop', raw: 'stop' },
        usage: {
            inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 },
            outputTokens: { total: 1, text: 1, reasoning: 0 },
        },
        warnings: [],
    }),
});

const summarize = definePrompt({
    name: 'summarize',
    model: mockModel,
    inputSchema: z.object({ text: z.string() }),
    outputSchema: z.object({ summary: z.string() }),
    template: ({ text }) => `Summarize the following text in plain English: ${text}`,
});

await expect(summarize({ text: 'hello' })).resolves.toEqual({ summary: 'ok' });
```

The same approach works for error cases—throw an `APICallError` or return malformed JSON from the mock to exercise recovery paths. For streaming scenarios, use `simulateReadableStream` from `ai/test`. This keeps downstream unit tests deterministic while still covering all control flow inside `definePrompt`.

## License

MIT
