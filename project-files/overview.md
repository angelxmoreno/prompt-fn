# prompt-fn: Overview

`prompt-fn` is a lightweight, type-safe library designed to turn LLM prompts into reusable, functional units. It leverages the **Vercel AI SDK** for robust model interactions (handling retries, providers, and streaming) while adding a layer of rigorous schema validation for both **inputs** (prompt variables) and **outputs** (LLM responses).

## Core Philosophy

1.  **Prompts as Functions:** An LLM interaction should feel like a standard async function call: `const result = await myPrompt({ input: 'value' });`.
2.  **Type Safety Everywhere:**
    *   **Input:** Validated via Zod. You can't call a prompt with missing or wrong variables.
    *   **Output:** Validated via Zod (and enforcing structured JSON output from the LLM).
3.  **Engine Agnostic:**
    *   **Templating:** Works with standard ES6 template literals (default) or integrated **Eta** templates for complex logic.
    *   **Model:** Works with any model supported by the Vercel AI SDK (OpenAI, Anthropic, Google, Ollama, etc.).

## Key Components

### 1. `definePrompt<Input, Output>(config)`

The main entry point. It creates a callable function.

**Config Options:**
*   `name` (string): Unique identifier for logging/debugging.
*   `description` (string, optional): Context for the LLM about what this function does.
*   `inputSchema` (ZodSchema): Defines the shape of the input variables.
*   `outputSchema` (ZodSchema): Defines the shape of the expected JSON response.
*   `template` (string | (input: Input) => string):
    *   Can be a simple string (if using Eta/external files).
    *   Can be a function returning a string (for template literals).
*   `model`: The Vercel AI SDK model instance.
*   `eta` (EtaInstance, optional): If provided, enables Eta templating logic.

### 2. Execution Flow

1.  **Validation (Input):** The arguments passed to the generated function are validated against `inputSchema`.
2.  **Rendering:**
    *   If `template` is a function -> executed with input data.
    *   If `template` is a string & `eta` is present -> rendered via Eta.
    *   If `template` is a string & no `eta` -> used raw.
3.  **LLM Call:**
    *   Uses `generateObject` (from Vercel AI SDK) if `outputSchema` is present.
    *   Uses `generateText` if no `outputSchema` is defined (returns raw string).
4.  **Validation (Output):** The Vercel AI SDK handles the JSON parsing and validation against `outputSchema`.
5.  **Return:** The strongly-typed result is returned.

## Comparison to Current Implementation

| Feature | Current (`LLMPrompter`) | New (`prompt-fn`) |
| :--- | :--- | :--- |
| **Transport** | Custom `fetch` / `ollama` lib | Vercel AI SDK (Standardized) |
| **Retries** | Manual logic | Built-in (Exponential backoff) |
| **Templating** | Eta (Hard dependency) | Flexible (Literals or Eta) |
| **Output Validation** | Manual `JSON.parse` + Zod | `generateObject` (Native) |
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
