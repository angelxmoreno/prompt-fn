export default {
    settings: {
        resourceLink: true,
        setext: true,
    },
    plugins: [
        'remark-frontmatter',
        'remark-preset-lint-recommended',
        ['remark-lint-maximum-line-length', false],
        ['remark-lint-no-dead-urls', false],
        ['remark-lint-no-literal-urls', true],
    ],
};
