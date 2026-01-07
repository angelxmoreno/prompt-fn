# prompt-fn: Overview

`prompt-fn` is a lightweight, type-safe library designed to turn LLM prompts into reusable, functional units. It leverages the **Vercel AI SDK** for robust model interactions (handling retries, providers, and streaming) while adding a layer of rigorous schema validation for both **inputs** (prompt variables) and **outputs** (LLM responses).

## Core Philosophy

1. **Prompts as Functions:** An LLM interaction should feel like a standard async function call: `const result = await myPrompt({ input: 'value' });`.
2. **Type Safety Everywhere:**
   * **Input:** Validated via Zod. You can't call a prompt with missing or wrong variables.
   * **Output:** Validated via Zod (and enforcing structured JSON output from the LLM).
3. **Engine Agnostic:**
   * **Templating:** Works with standard ES6 template literals (default) or integrated **Eta** templates for complex logic.
   * **Model:** Works with any model supported by the Vercel AI SDK (OpenAI, Anthropic, Google, Ollama, etc.).

## Key Components

### 1. `definePrompt<Input, Output>(config)`

The main entry point. It creates a callable function.

**Config Options:**

* `name` (string): Unique identifier used in child loggers and error messages.
* `description` (string, optional): Short blurb injected into provider metadata.
* `inputSchema` (`z.ZodType`): Validates prompt variables before rendering.
* `outputSchema` (`z.ZodType`): Required schema that drives structured `generateText` calls.
* `template` (string | TemplateRenderer): A literal string, Eta view id, or function `(input) => string`.
* `model` (`LanguageModel | string`): Either a concrete Vercel AI SDK model instance (e.g., `google('gemini-2.0-flash')`) or a plain model id string.
* `eta` (`Eta`, optional): Render string templates through Eta when present.
* `logger` (`pino.Logger`, optional): Custom logger; defaults to `pino(pino-pretty())` with the prompt name attached as `module`.

### 2. Execution Flow

1. **Validation (Input):** The arguments passed to the generated function are validated against `inputSchema`.
2. **Rendering:**
   * If `template` is a function -> executed with input data.
   * If `template` is a string & `eta` is present -> rendered via Eta.
   * If `template` is a string & no `eta` -> used raw.
3. **LLM Call:**
   * Always routes through `generateText` with `Output.object({ schema })` so we can tap into raw provider responses.
4. **Structured Output:**
   * Primary path: `generation.output` is parsed and validated by the AI SDK.
   * Fallback path: If providers return JSON as a quoted string (common with Ollama/OpenAI compatibility APIs), we attempt recovery via `recoverFromResponseBody` and `recoverFromContent`.
5. **Return:** The fully validated, strongly typed object defined by `outputSchema`.

### 3. Output Recovery Utilities

The utils layer exposes:

* `recoverFromResponseBody`: parses the raw HTTP response body that ships with `APICallError` so we can extract structured text even when the SDK can’t.
* `recoverFromContent`: walks the `generation.content` array (text deltas, streaming chunks, etc.) and re-validates it against your `outputSchema`.

Both functions downgrade logs to `logger.warn` when they succeed, giving visibility without failing the run.

### 4. Integration Testing Notes

The integration suite under `test/integration` is disabled by default. Set these environment variables to opt in:

* `RUN_INTEGRATION_TESTS=true` – master switch for the entire describe block.
* `OLLAMA_AI_HOST=http://127.0.0.1:11434` – enables both the native Ollama SDK test and the OpenAI-compatible test.
* `GEMINI_API_KEY=<token>` – enables the Google Gemini scenario.

Each provider `describe` block uses `describe.skipIf(...)`, so missing variables simply skip that portion rather than failing the whole file.

## Comparison to Current Implementation

| Feature | Current (`LLMPrompter`) | New (`prompt-fn`) |
| :--- | :--- | :--- |
| **Transport** | Custom `fetch` / `ollama` lib | Vercel AI SDK (Standardized) |
| **Retries** | Manual logic | Built-in (Exponential backoff) |
| **Templating** | Eta (Hard dependency) | Flexible (Literals or Eta) |
| **Output Validation** | Manual `JSON.parse` + Zod | `generateText` + `Output.object` w/ fallback recovery |
| **Input Validation** | None (Implicit) | Zod (Explicit) |

## Example Usage

```typescript
import { definePrompt } from 'prompt-fn';
import { z } from 'zod';
import { google } from '@ai-sdk/google';

const generateUserBio = definePrompt({
    name: 'generateUserBio',
    model: google('gemini-2.0-flash'),
    inputSchema: z.object({
        name: z.string(),
        hobbies: z.array(z.string()),
    }),
    outputSchema: z.object({
        bio: z.string(),
        tags: z.array(z.string()),
    }),
    template: (data) => `
        Write a bio for ${data.name}.
        They like: ${data.hobbies.join(', ')}.
    `
});

// Fully typed!
const result = await generateUserBio({ 
    name: 'Alice', 
    hobbies: ['coding', 'hiking'] 
}); 

console.log(result.bio);
```
