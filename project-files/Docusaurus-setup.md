# Docusaurus Setup Plan

Prerequisites:

* TypeDoc output configured per `project-files/typedoc-setup.md` (docs/api populated).
* `llms.txt` guidance complete per `project-files/llm-setup.md`.

## Goals

* Provide a polished documentation site with guides, API reference, and AI-friendly metadata.
* Host on GitHub Pages (or Netlify/Vercel) with automatic builds via CI.

## Steps

### 1. Initialize Docusaurus

```bash
npx create-docusaurus@latest docs-site classic
```

* Choose TypeScript template.
* `docs-site/` becomes the documentation workspace.

### 2. Link TypeDoc output

* Configure Docusaurus to treat `../docs/api` as a docs section:
  * Add a sidebar entry pointing to `../docs/api` (via docs plugin or `@docusaurus/plugin-content-docs` with `path: '../docs/api'`).
* Optionally create a script that copies `docs/api` into `docs-site/docs/api` before build.

### 3. Add Guides

* Create `docs-site/docs/overview.md`, `getting-started.md`, `error-handling.md`, etc.
* Cross-link to README sections and project-files overviews.

### 4. Configure Navbar & Footer

* Update `docusaurus.config.ts` to link to GitHub repo, npm, llms.txt, API docs.
* Add version dropdown if desired.

### 5. Integrate llms.txt

* Build step should copy `project-files/llms.txt` (or generated file) to site root (`docs-site/static/llms.txt`).
* Ensure `llms.txt` references the Docusaurus-hosted URLs.

### 6. CSS/Theme tweaks

* Update `src/css/custom.css` for branding.
* Optional: add code syntax highlighting theme (Prism) for TypeScript examples.

### 7. Build & Deploy

* Add `npm run build` (default Docusaurus build) and `npm run serve` scripts inside docs-site.
* For GitHub Pages: use `docusaurus deploy` with `GITHUB_TOKEN`.
* For Netlify/Vercel: configure build command `npm run build` and output `build/`.

### 8. CI Automation

* Add `.github/workflows/docs.yml`:
  * Trigger on pushes to main/docs.
  * Steps: checkout, install, run TypeDoc (`bun run docs`), copy outputs, run `npm run build`, deploy (Pages or Netlify CLI).

### 9. Update README

* Link to the docs site URL.
* Mention that API reference lives under `/docs/api` (generated from TypeDoc).

### 10. Maintenance

* Whenever TypeDoc or guides change, ensure CI rebuilds the site.
* Keep `llms.txt` in sync with new doc URLs.

This plan is ready to follow once TypeDoc and llms.txt work are finalized.
