import { google } from '@ai-sdk/google';
import { Eta } from 'eta';
import { z } from 'zod';
import { definePrompt } from '../src';

const model = google('gemini-flash-lite-latest');

const inputSchema = z.object({
    productName: z.string().min(3),
    targetAudience: z.string(),
    differentiators: z.array(z.string()).min(1),
});

const outputSchema = z.object({
    headline: z.string(),
    description: z.string().min(50),
    messagingChecklist: z.array(
        z.object({
            item: z.string(),
            status: z.enum(['todo', 'ready']),
        })
    ),
    tone: z.enum(['playful', 'professional', 'technical']),
});

async function main() {
    const eta = new Eta({
        cache: true,
        views: new URL('./templates', import.meta.url).pathname,
    });

    const generateBrief = definePrompt<typeof inputSchema, typeof outputSchema>({
        name: 'product-brief',
        description: 'Generate a marketing brief with a checklist',
        model,
        inputSchema,
        outputSchema,
        eta,
        template: 'product-brief.eta',
    });

    const brief = await generateBrief({
        productName: 'FlowPilot',
        targetAudience: 'Sales teams automating weekly reporting',
        differentiators: ['native Salesforce integration', 'on-device privacy controls'],
    });

    console.log(brief);
}

main().catch((error) => {
    console.error('brief generation failed', error);
    process.exit(1);
});
