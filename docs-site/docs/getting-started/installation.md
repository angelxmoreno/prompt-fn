---
id: installation
sidebar_position: 1
title: Install & Configure
---

prompt-fn is Bun-first but works with any Node.js runtime that supports the Vercel AI SDK.

Requirements
------------

* **Node.js 20+** (Bun bundles its own runtime)
* **Bun 1.0+** if you want the fastest dev workflow
* Access to at least one Vercel AI SDK provider (OpenAI, Google, Anthropic, Ollama, etc.)

Install
-------

```bash
bun add prompt-fn zod @ai-sdk/provider-utils pino
# or
npm install prompt-fn zod @ai-sdk/provider-utils pino
```

We rely on Zod for schemas, Vercel's provider utils for the shared types, and `pino` for logging.

Configure environment
---------------------

Store provider keys in `.env` and load them before running prompts:

```bash
# .env
OPENAI_API_KEY=sk-...
GOOGLE_GENERATIVE_AI_API_KEY=...
OLLAMA_BASE_URL=http://127.0.0.1:11434
```

Bun automatically loads `.env` when executing scripts; with Node.js use something like `dotenv/config` or your framework's config loader.

Helpful scripts
---------------

Add the following to `package.json` to align with the repo's tooling:

```json
{
  "scripts": {
    "lint": "bun lint",
    "check-types": "bun check-types",
    "test": "bun test"
  }
}
```

See [`project-files/overview.md`](https://github.com/angelxmoreno/prompt-fn/blob/main/project-files/overview.md) for the recommended project layout.
