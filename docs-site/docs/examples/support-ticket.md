***

id: support-ticket
sidebar\_position: 1
title: Support ticket triage
----------------------------

This example mirrors [`examples/support-ticket.ts`](https://github.com/angelxmoreno/prompt-fn/blob/main/examples/support-ticket.ts). It classifies inbound emails and assigns a priority.

```ts title="examples/support-ticket.ts"
import {definePrompt} from 'prompt-fn';
import {z} from 'zod';
import {google} from '@ai-sdk/google';

const classifyTicket = definePrompt({
  name: 'Support Ticket',
  description: 'Classify support tickets by intent and urgency',
  inputSchema: z.object({
    subject: z.string(),
    body: z.string(),
  }),
  outputSchema: z.object({
    intent: z.enum(['bug', 'billing', 'question']),
    priority: z.enum(['low', 'normal', 'urgent']),
    summary: z.string(),
  }),
  template: ({subject, body}) => `Summarize and classify\nSubject: ${subject}\nBody: ${body}`,
  model: google('models/gemini-1.5-flash'),
});

const response = await classifyTicket({
  subject: 'Refund not received',
  body: 'I cancelled last week and still have not seen the refund.',
});
```

### Why it is interesting

* Demonstrates string templates with interpolated variables.
* Shows how logger + recovery keep the response usable even when Gemini or Ollama return quoted JSON.
* Input/output types are inferred, so `response.priority` narrows to `'low' | 'normal' | 'urgent'`.

### Try it locally

```bash
bun test test/integration/integration.test.ts --filter "Using Google Gemini"
```

Set `GOOGLE_GENERATIVE_AI_API_KEY` before running. See [`test/integration/integration.test.ts`](https://github.com/angelxmoreno/prompt-fn/blob/main/test/integration/integration.test.ts) for the env variable guards.
