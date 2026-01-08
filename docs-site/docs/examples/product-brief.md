***

id: product-brief
sidebar\_position: 2
title: Product brief generator
------------------------------

Based on [`examples/product-brief.ts`](https://github.com/angelxmoreno/prompt-fn/blob/main/examples/product-brief.ts) and the Eta template in `examples/templates/product-brief.eta`.

```ts title="examples/product-brief.ts"
import {Eta} from 'eta';
import path from 'node:path';
import {definePrompt} from 'prompt-fn';
import {z} from 'zod';
import {openai} from '@ai-sdk/openai';

const eta = new Eta({ views: path.join(import.meta.dir, 'templates') });

const productBrief = definePrompt({
  name: 'Product Brief',
  description: 'Summarize roadmap asks with tone guidance',
  inputSchema: z.object({
    feature: z.string(),
    audience: z.enum(['sales', 'support', 'customers']),
    bullets: z.array(z.string()).min(3),
  }),
  outputSchema: z.object({
    overview: z.string(),
    risks: z.array(z.string()),
    callToAction: z.string(),
  }),
  template: 'product-brief',
  eta,
  model: openai('gpt-4o-mini'),
});
```

## Highlights

* Uses Eta to keep the template readable and enable looping over bullet points.
* Demonstrates how to colocate `.eta` files and load them by name.
* Works with OpenAI, Gemini, or local Ollama models—swap `model` without touching the template.

## Local run

```bash
bun tsx examples/product-brief.ts
```
