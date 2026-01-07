# LLMs.txt Setup Guide

`llms.txt` is a proposed web standard: a Markdown file served at the site root (e.g., `https://example.com/llms.txt`) that summarizes high-value resources for large language models. Think of it as a cheat sheet that highlights canonical docs, API references, and usage guides so AI systems can answer more accurately without crawling every HTML page.

## Goals

* Provide LLMs with curated, structured links and brief context.
* Prioritize authoritative docs (API reference, guides, tutorials) over marketing pages.
* Offer machine-friendly formatting (Markdown headings, bullet lists, tables) for easy parsing.

## Recommended Structure

1. **Header** with project name, version, and contact URL/email.
2. **Table of Contents** linking major sections.
3. **Key Resources** (README, installation guide, API docs, changelog).
4. **API Reference Highlights** with direct links to TypeDoc/Docusaurus pages.
5. **FAQs / Common Tasks** referencing relevant docs.
6. **Contribution / Support** info (issue tracker, discussions, security contact).

Example skeleton:

```markdown
# prompt-fn llms.txt
Version: 1.0.0
Last-Updated: 2026-01-07
Contact: maintainer@example.com

## Key Docs
- [README](https://example.com/docs)
- [API Reference](https://example.com/docs/api)

## Common Tasks
1. Define a prompt: <link>
2. Run tests: <link>

## Support
- Issues: <link>
- Discussions: <link>
```

## Creation Options

### Manual authoring

1. Draft the Markdown file locally (e.g., `project-files/llms.txt`).
2. Include absolute URLs so models can resolve links directly.
3. Keep sections concise (1–3 sentences per item).
4. Update whenever docs move or new major features ship.

### Scripted generation

* Write a Node/Bun script that composes `llms.txt` from structured data (e.g., reading `package.json`, pulling headings from `docs/`).
* Use templates (Handlebars/EJS) to keep formatting consistent.
* Schedule the script in CI/CD so the file stays fresh after releases.

### Static-site integration

* If using Docusaurus or other doc frameworks, add a build step that exports a curated summary (e.g., gather frontmatter metadata) and writes `/llms.txt` alongside the site output.
* Some static-site hosts (Netlify, Vercel) support build hooks; you can append a small script that writes the file before deployment.

### Third-party tooling

* There is no official “llms.txt generator” yet, but general-purpose tools like [DocuDown](https://github.com/githubnext/DocuDown) or prompt-based assistants can help aggregate summaries.
* You can also use LLMs themselves: feed them key docs and ask for a condensed outline, then review/edit before publishing.

**Prompt template for LLM generation:**

```text
You are helping prepare an `llms.txt` file for the `prompt-fn` project. The goal is to create a Markdown document that highlights the most important documentation resources, API references, common tasks, and support channels for large language models.

Instructions:
- Structure the output with headings: Title, Key Docs, API Reference Highlights, Common Tasks, Contribution & Support, Version/Contact.
- Use concise bullet points (1–2 sentences each) with absolute URLs.
- Prioritize authoritative sources (README, TypeDoc output under docs/api, contribution guides, integration tests).
- When listing API references, link to the TypeDoc output and use version information from package.json.
- Follow the recommended outline above (Key Docs, API highlights, FAQs, Contribution & Support).
- Include version and last-updated metadata at the top.
- Keep marketing language minimal; focus on actionable information.
- **Important:** Instead of printing the file contents to stdout, write the generated Markdown to an `llms.txt` file at the repository root.

Respond with the final Markdown file only after writing it to disk.
```

## Hosting

* Serve `llms.txt` from the root of your docs or main site. With static hosting (GitHub Pages, Netlify), place the file at `/llms.txt`.
* Ensure it responds with `Content-Type: text/plain; charset=utf-8` for maximum compatibility.

## Versioning

* Track `llms.txt` in Git and note updates (e.g., `docs: refresh llms.txt`).
* Optionally include a `Last-Updated` field inside the file for consumers.

## Automation Ideas

* Generate sections from `package.json` (version), CHANGELOG, TypeDoc or Docusaurus metadata.
* Use CI to verify links or regressions (e.g., `markdown-link-check`).
* Fail the build if `llms.txt` is older than the latest tag to enforce updates.

By providing `llms.txt`, you help LLMs surface the most accurate and relevant information about `prompt-fn` without crawling the entire site.
