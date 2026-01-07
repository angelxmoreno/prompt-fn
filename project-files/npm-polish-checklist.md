# npm Module Polish Checklist

This document tracks remaining enhancements to make `prompt-fn` feel production-ready on npm. Items already covered elsewhere (TypeDoc/Docusaurus plan, llms.txt guidance) are omitted.

## 1. Testing & Quality

* \[ ] Expand unit tests (definePrompt, schema validations, logger, recovery utilities).
* \[ ] Broaden integration tests across providers (OpenAI, Google, release-it dry-run).
* \[ ] Add CI job for `bun run docs` once TypeDoc is implemented.

## 2. Developer Experience

* \[ ] Provide `examples/` directory with runnable scenarios (basic usage, structured output, fallback recovery).
* \[ ] Add code snippets/demo prompts to README.
* \[ ] Consider a `PromptBuilder` factory in `src/index.ts` so users can set shared defaults (logger, eta, recovery) and call `builder.prompt()` for each definePrompt. Remove if out of scope.

## 3. Release Workflow (see project-files/release-ci.md)

* \[ ] Implement release-it config (.release-it.json) per release-ci plan.
* \[ ] Create `.github/workflows/release.yml` running `release-it --ci` with lint/type-check/tests.
* \[ ] Document release process in CONTRIBUTING (how to trigger release, dry-run, rollback).

## 4. Documentation & Community

* \[ ] Expand README sections (FAQs, Provider notes, Error handling guide).
* \[ ] Add CONTRIBUTING details (PR template, tests checklist, branch naming).
* \[ ] Consider `SECURITY.md` and note supported Bun/Node versions.

## 5. Security & Automation

* \[ ] Pin third-party GitHub Actions (setup-bun, etc.) to specific SHAs if Semgrep rule is re-enabled.
* \[ ] Add `markdown-link-check` or similar to validate docs links nightly.

## 6. Examples & Sandbox

* \[ ] Set up a Codesandbox/Stackblitz link demonstrating `prompt-fn`.
* \[ ] Provide CLI snippet for quick testing (`bunx ts-node examples/basic.ts`).

Use this checklist to track remaining enhancements. Update boxes as items are completed, and cross-link to relevant docs or PRs.
