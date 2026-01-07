# Contributing to prompt-fn

Thank you for your interest in improving `prompt-fn`! This project embraces open collaboration, and we appreciate contributions of all sizes: bug fixes, documentation improvements, tests, and new features.

## Getting Started

1. **Discuss first (optional but encouraged):** Open an issue or start a GitHub Discussion describing the change you have in mind.
2. **Fork & Clone:**
   ```bash
   git clone https://github.com/angelxmoreno/prompt-fn.git
   cd prompt-fn
   ```
3. **Install dependencies:**
   ```bash
   bun install
   ```
4. **Run tests and linters locally:**
   ```bash
   bun run lint
   bun run check-types
   bun test
   ```

## Pull Request Checklist

- Follow the existing code style (Biome + remark-lint).
- Write or update tests for every behavior change.
- Keep PRs focused; large features should be broken into smaller pieces when possible.
- Update documentation (README, project-files) if API/behavior changes.
- Ensure commit messages follow Conventional Commits (e.g., `fix: handle empty prompt input`).
- Verify CI passes before requesting review.

## Reporting Issues

Please include:
- Steps to reproduce.
- Expected vs. actual behavior.
- Environment details (OS, Bun version, provider, etc.).
- Relevant logs or stack traces.

## Releasing

Releases are managed by maintainers. If you need a new version, please open an issue or discussion referencing the commits to release.

Thanks again for contributing!
