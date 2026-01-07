export default {
    plugins: [
        'remark-preset-lint-recommended', // base rules
        ['remark-lint-maximum-line-length', false],
        ['remark-lint-no-dead-urls', false],
    ],
};
