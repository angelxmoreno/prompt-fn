---
id: first-prompt
sidebar_position: 2
title: Your first prompt
---

This walkthrough mirrors `examples/support-ticket.ts` and shows how to go from config to a runnable async function.

1\. Define schemas
------------------

```ts
import {z} from 'zod';

const InputSchema = z.object({
  subject: z.string().min(4),
  body: z.string().min(10),
});

const OutputSchema = z.object({
  classification: z.enum(['bug', 'billing', 'question']),
  priority: z.enum(['low', 'normal', 'urgent']),
});
```

2\. Create the prompt
---------------------

```ts
import {definePrompt} from 'prompt-fn';
import {openai} from '@ai-sdk/openai';

const triageTicket = definePrompt({
  name: 'Ticket Triage',
  inputSchema: InputSchema,
  outputSchema: OutputSchema,
  template: ({subject, body}) => `Classify the ticket\nSubject: ${subject}\nBody: ${body}`,
  model: openai('gpt-4o-mini'),
});
```

* `name` is used for logging and metrics.
* `template` can be a string, template literal, or Eta view (see the Guides section).
* `model` accepts any AI SDK provider, including custom Ollama instances.

3\. Call it like a function
---------------------------

```ts
const result = await triageTicket({
  subject: 'Refund not received',
  body: 'I cancelled last week and still have not seen the refund.',
});

console.log(result.classification);
```

The return type is automatically `z.infer<typeof OutputSchema>` and runtime validation ensures malformed responses trigger recovery.

4\. Add logging (optional)
--------------------------

```ts
import {createLogger} from 'prompt-fn/utils';

const logger = createLogger({ name: 'Ticket Triage' });
const triageTicket = definePrompt({ ... , logger });
```

When a provider fails to emit JSON, prompt-fn uses the logger to warn you and then attempts recovery. Head over to [Logging & Recovery](../guides/logging-and-recovery.md) for the full flow.
