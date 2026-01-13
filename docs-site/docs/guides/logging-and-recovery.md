---
id: logging-and-recovery
sidebar_position: 2
title: Logging & Recovery
---

Resilient prompts need observability. prompt-fn layers structured logging, fallbacks, and manual content parsing so you can still ship when a provider emits malformed JSON.

pino logger
-----------

```ts
import pino from 'pino';

const logger = pino({ name: 'Adder Prompt', level: 'debug' });

const addNumbers = definePrompt({
  ...,
  logger,
});
```

* Each invocation logs `module`, `errorName`, and `content` when something goes wrong.
* Use `logger.child({ module: name })` if you need per-prompt context.

Recovery flow
-------------

1. We call `generateObject` / `generateText` with `outputSchema`.
2. If `generation.output` is missing, we inspect `generation.content` and attempt to parse JSON ourselves.
3. `recoverFromContent` (see `src/utils/outputRecovery.ts`) strips fences, trims whitespace, and re-validates.
4. If manual parsing works, we log a warning instead of an error and return the recovered payload.
5. If everything fails, the original AI SDK error bubbles up, still enriched with logger metadata.

You can override the recovery strategy by wrapping `recoverFromContent` or by transforming `generation.content` before calling `outputSchema.parse`.

Tuning provider requests
------------------------

* Ollama OpenAI-compatible endpoints often wrap JSON in quotes. The built-in recovery handles this scenario automatically.
* For providers that support **structured output mode** (e.g., Gemini 1.5, OpenAI Responses API), keep `outputSchema` strict—prompt-fn already passes the JSON schema to the provider.
* If you rely on `generateText`, consider supplying a lightweight `outputSchema` and falling back to `recoverFromContent` for consistency.
