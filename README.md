# prompt-fn

Type-safe, composable LLM functions powered by the Vercel AI SDK.

`prompt-fn` turns prompts into reusable TypeScript functions with enforced schemas, prompt-aware logging, and resilient recovery across providers.

## Features

- **Type-Safe:** `definePrompt` requires Zod schemas for both inputs and outputs so every call is validated twice.
- **Structured Output:** Uses `generateText` + `Output.object` for primary parsing and falls back to recovery helpers when providers wrap JSON in strings (e.g., OpenAI-compatible Ollama).
- **Flexible Templating:** Use template literals for simple prompts or Eta views/functions for complex layouts.
- **Model Agnostic:** Accepts any Vercel AI SDK `LanguageModel` instance or raw model name (Google, OpenAI, Anthropic, Ollama, etc.).
- **Integrated Logging:** Built on `pino` with prompt-level metadata and downgraded warnings when recovery succeeds.
- **Robust:** Built-in retries from the AI SDK plus custom recovery utilities to extract structured data from malformed responses.

## Installation

```bash
npm install prompt-fn ai zod pino pino-pretty
# Install your preferred providers (examples)
npm install @ai-sdk/google ai-sdk-ollama
```

## Usage

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
    template: (input) => `Reply with JSON {"message": string}. Say hello to ${input.name} in a pirate voice.`,
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

## Testing

Integration coverage lives under `test/integration`. Use targeted commands when iterating against specific providers:

```bash
bun test test/integration/integration.test.ts   # Runs Ollama SDK, Google Gemini, and OpenAI-compatible suites
bun run check-types                              # Ensures exported types remain sound
```

## License

MIT
