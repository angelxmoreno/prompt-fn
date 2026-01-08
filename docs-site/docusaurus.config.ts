import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
    title: 'prompt-fn',
    tagline: 'Build type-safe prompts as first-class functions',
    favicon: 'img/favicon.ico',

    // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
    future: {
        v4: true, // Improve compatibility with the upcoming Docusaurus v4
    },

    // Set the production url of your site here
    url: 'https://angelxmoreno.github.io',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/prompt-fn/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'angelxmoreno', // Usually your GitHub org/user name.
    projectName: 'prompt-fn', // Usually your repo name.

    onBrokenLinks: 'throw',

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: './sidebars.ts',
                    editUrl: 'https://github.com/angelxmoreno/prompt-fn/edit/main/docs-site',
                },
                blog: {
                    showReadingTime: true,
                    feedOptions: {
                        type: ['rss', 'atom'],
                        xslt: true,
                    },
                    editUrl: 'https://github.com/angelxmoreno/prompt-fn/edit/main/docs-site',
                    // Useful options to enforce blogging best practices
                    onInlineTags: 'warn',
                    onInlineAuthors: 'warn',
                    onUntruncatedBlogPosts: 'warn',
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        image: 'img/docusaurus-social-card.jpg',
        colorMode: {
            respectPrefersColorScheme: true,
        },
        navbar: {
            logo: {
                alt: 'prompt-fn logo',
                src: 'img/prompt-fn-logo.svg',
            },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'tutorialSidebar',
                    position: 'left',
                    label: 'Guides',
                },
                {
                    to: '/docs/category/api-reference',
                    label: 'API Reference',
                    position: 'left',
                },
                {
                    to: '/docs/category/examples',
                    label: 'Examples',
                    position: 'left',
                },
                {
                    href: 'https://github.com/angelxmoreno/prompt-fn',
                    label: 'GitHub',
                    position: 'right',
                },
                {
                    href: 'https://www.npmjs.com/package/prompt-fn',
                    label: 'npm',
                    position: 'right',
                },
                {
                    href: 'https://github.com/angelxmoreno/prompt-fn/blob/main/llms.txt',
                    label: 'llms.txt',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'Getting Started',
                            to: '/docs/intro',
                        },
                        {
                            label: 'API Reference',
                            to: '/docs/category/api-reference',
                        },
                        {
                            label: 'llms.txt',
                            href: 'https://github.com/angelxmoreno/prompt-fn/blob/main/llms.txt',
                        },
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        {
                            label: 'Discussions',
                            href: 'https://github.com/angelxmoreno/prompt-fn/discussions',
                        },
                        {
                            label: 'Issues',
                            href: 'https://github.com/angelxmoreno/prompt-fn/issues',
                        },
                    ],
                },
                {
                    title: 'More',
                    items: [
                        {
                            label: 'Blog',
                            to: '/blog',
                        },
                        {
                            label: 'GitHub',
                            href: 'https://github.com/angelxmoreno/prompt-fn',
                        },
                        {
                            label: 'npm',
                            href: 'https://www.npmjs.com/package/prompt-fn',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} prompt-fn contributors.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
