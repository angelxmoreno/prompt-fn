import Heading from '@theme/Heading';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './styles.module.css';

type FeatureItem = {
    title: string;
    description: ReactNode;
    highlight: string;
};

const FeatureList: FeatureItem[] = [
    {
        title: 'Schema-first authoring',
        highlight: 'Zod enforced',
        description: (
            <>
                Input/output schemas live next to your template so TypeScript, runtime validation, and docs stay in
                sync.
            </>
        ),
    },
    {
        title: 'Structured output',
        highlight: 'AI SDK compat',
        description: (
            <>
                Built on Vercel&apos;s AI SDK: works with generateObject/generateText, Ollama, Gemini, OpenAI, and more.
            </>
        ),
    },
    {
        title: 'Logging & recovery',
        highlight: 'pino + fallbacks',
        description: <>Built-in pino logging, Eta templating, and fallback parsing help you debug production runs.</>,
    },
];

function Feature({ title, description, highlight }: FeatureItem) {
    return (
        <div className={clsx('col col--4')}>
            <div className={styles.featureCard}>
                <Heading as="h3">{title}</Heading>
                <p className={styles.featureHighlight}>{highlight}</p>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures(): ReactNode {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
