# TypeDoc Setup

Follow these steps to add TypeDoc documentation generation to the project.

0. **Document the source code:**
   * Ensure exported functions, classes, interfaces, and properties have JSDoc/TSDoc comments (`/** ... */`).
   * TypeDoc relies on these comments to produce meaningful descriptions, parameter docs, and examples.
   * Prompt template for LLM assistance (run file-by-file or across `src/`):
     ```text
     You are helping document a TypeScript library. For each TypeScript file under `src/`:
     - Add concise TSDoc comments (`/** ... */`) for every exported function, class, interface, type, and important property.
     - Include `@param`, `@returns`, `@template`, and `@remarks` tags when useful.
     - Keep descriptions factual, avoid speculation, and do not change runtime behavior.
     - Preserve formatting and show the full updated contents of each file before moving to the next.
     ```

1. **Install TypeDoc and plugins**
   ```bash
   bun add --dev typedoc typedoc-plugin-markdown
   ```

2. **Add a `typedoc.json` configuration file** at the repository root:
   ```json
   {
       "$schema": "https://typedoc.org/schema.json",
       "entryPoints": ["src/index.ts"],
       "out": "docs/api",
       "plugin": ["typedoc-plugin-markdown"],
       "readme": "none",
       "excludePrivate": true,
       "excludeProtected": true,
       "excludeInternal": true
   }
   ```

3. **Update `package.json` scripts** to include a doc task:
   ```json
   "scripts": {
       "docs": "typedoc",
       "docs:watch": "typedoc --watch"
   }
   ```

4. **Add output directories to `.gitignore`** if you don’t want generated docs committed:
   ```
   docs/api/
   build/
   ```

5. **Generate docs manually:**
   ```bash
   bun run docs
   ```

6. **(Optional) Publish docs**
   * Docusaurus expects documentation under `docs/`, so keeping TypeDoc output in `docs/api` leaves room for guides alongside it.
   * If using GitHub Pages, Docusaurus can build the static site (`npx docusaurus build`) while TypeDoc populates the API section.

7. **CI integration**
   * Update your GitHub Actions workflow to run `bun run docs` for verification.
   * Optionally upload generated docs as an artifact or deploy.

These steps ensure TypeDoc is configured consistently and can be generated locally or in CI.
