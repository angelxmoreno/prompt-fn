# prompt-fn

Type-safe, composable LLM functions powered by the Vercel AI SDK.

`prompt-fn` turns your prompts into standard, reusable TypeScript functions with rigorous input and output validation.

## Features

*   **Type-Safe:** generic `definePrompt` using Zod schemas for inputs and outputs.
*   **Flexible Templating:** Support for standard Template Literals or **Eta** templates.
*   **Model Agnostic:** Works with OpenAI, Anthropic, Gemini, Ollama, and more (via Vercel AI SDK).
*   **Structured Data:** First-class support for extracting JSON data (`generateObject`) or plain text (`generateText`).
*   **Robust:** Built-in retries, rate-limit handling, and error management.

## Installation

```bash
npm install prompt-fn ai zod
# Install your preferred model provider
npm install @ai-sdk/google @ai-sdk/ollama
```

## Usage

### 1. Simple Text Generation

```typescript
import { definePrompt } from 'prompt-fn';
import { z } from 'zod';
import { ollama } from '@ai-sdk/ollama';

const sayHello = definePrompt({
    model: ollama('llama3'),
    inputSchema: z.object({
        name: z.string(),
    }),
    // No outputSchema means we expect a plain string response
    template: (input) => `Say hello to ${input.name} in a pirate voice.`,
});

const response = await sayHello({ name: 'World' });
console.log(response.text); // "Ahoy there, World!"
```

### 2. Structured Data Extraction

```typescript
import { definePrompt } from 'prompt-fn';
import { z } from 'zod';
import { google } from '@ai-sdk/google';

const extractRecipe = definePrompt({
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

// 'result' is strictly typed!
console.log(result.ingredients); 
```

### 3. Using Eta Templates

For complex prompts, you can inject an Eta instance.

```typescript
import { definePrompt } from 'prompt-fn';
import { z } from 'zod';
import { Eta } from 'eta';

const eta = new Eta({ views: './templates' });

const complexReport = definePrompt({
    model: google('gemini-2.0-flash'),
    eta, // Inject Eta
    inputSchema: z.object({ /* ... */ }),
    outputSchema: z.object({ /* ... */ }),
    template: 'daily-report.eta', // Reference the template file
});
```

## API Reference

### `definePrompt(config)`

Creates a callable async function.

**Configuration:**

| Property | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | Optional name for logging. |
| `model` | `LanguageModel` | Vercel AI SDK model instance. |
| `inputSchema` | `ZodSchema<T>` | Schema for validating function arguments. |
| `outputSchema` | `ZodSchema<U>` | Optional schema for validating LLM output. |
| `template` | `string \| (input: T) => string` | The prompt template. String for Eta/raw, function for literals. |
| `eta` | `Eta` | Optional Eta instance for rendering string templates. |
| `options` | `PromptOptions` | Extra options (maxRetries, temperature, etc.). |

### Returned Function

The returned function has the signature:

```typescript
(input: z.infer<typeof inputSchema>) => Promise<Result>
```

*   If `outputSchema` is defined, `Result` is `z.infer<typeof outputSchema>`.
*   If `outputSchema` is omitted, `Result` is `{ text: string, ... }` (Vercel `GenerateTextResult`).

## License

MIT
