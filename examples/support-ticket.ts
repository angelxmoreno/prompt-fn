import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { definePrompt } from '../src';

const ollamaHost = process.env.OLLAMA_AI_HOST;
if (!ollamaHost) {
    throw new Error('process.env.OLLAMA_AI_HOST cannot be undefined');
}
const ollama = createOpenAI({
    apiKey: 'ollama',
    baseURL: `${ollamaHost}/v1`,
});

// Example: triage a customer support ticket into severity + next actions.

const inputSchema = z.object({
    subject: z.string(),
    body: z.string(),
    customerTier: z.enum(['free', 'pro', 'enterprise']),
});

const outputSchema = z.object({
    summary: z.string(),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
    nextAction: z.string(),
});
type Email = z.infer<typeof inputSchema>;
type SupportTicket = z.infer<typeof outputSchema>;

const triageTicket = definePrompt<typeof inputSchema, typeof outputSchema>({
    name: 'support-triage',
    description: 'Summarize a support ticket and suggest severity/actions.',
    model: ollama('gemma3:270m'),
    inputSchema,
    outputSchema,
    template: ({ subject, body, customerTier }) => `
  You are a support engineer. Read the ticket and produce JSON matching the schema.
  Ticket subject: ${subject}
  Customer tier: ${customerTier}
  Ticket body:
  ${body}
    `,
});

async function run() {
    const email: Email = {
        subject: 'Billing issue after plan upgrade',
        body: `Hi team,
  We upgraded to enterprise last week but the invoice still shows the old rate.
  Please correct asap—we have an audit tomorrow.
  Thanks, Mia`,
        customerTier: 'enterprise',
    };
    const result: SupportTicket = await triageTicket(email);

    console.log(result);
}

run().catch((error) => {
    console.error('triage failed', error);
    process.exit(1);
});
