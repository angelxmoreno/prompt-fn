export default {
    settings: {
        resourceLink: true,
    },
    plugins: [
        'remark-frontmatter',
        'remark-preset-lint-recommended', // base rules
        ['remark-lint-maximum-line-length', false],
        ['remark-lint-no-dead-urls', false],
        ['remark-lint-no-literal-urls', true],
    ],
};
