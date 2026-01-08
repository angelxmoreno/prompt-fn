import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import type { ReactNode } from 'react';

import styles from './index.module.css';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <Heading as="h1" className="hero__title">
                    Build prompts like product code
                </Heading>
                <p className="hero__subtitle">
                    {siteConfig.tagline}. Validate inputs with Zod, render via template literals or Eta, and recover
                    when providers misbehave—without leaving TypeScript.
                </p>
                <div className={styles.buttons}>
                    <Link className="button button--secondary button--lg" to="/docs/intro">
                        Read the docs
                    </Link>
                    <Link className="button button--outline button--lg" to="/docs/category/api-reference">
                        Browse the API
                    </Link>
                    <Link className="button button--ghost button--lg" to="https://github.com/angelxmoreno/prompt-fn">
                        Star on GitHub
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default function Home(): ReactNode {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout title="prompt-fn" description={siteConfig.tagline}>
            <HomepageHeader />
            <main>
                <HomepageFeatures />
            </main>
        </Layout>
    );
}
