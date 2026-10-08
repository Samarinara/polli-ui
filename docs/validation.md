# Validation

Verified in this workspace:

- Shared ESM / TypeScript declaration build and compiled stylesheet.
- Production Vite build and nine prerendered documentation pages.
- TypeScript strict type checking.
- Five interaction tests: button semantics and links, labelled fields and refs, dialog naming/Escape/focus restoration, keyboard tabs, keyboard checkboxes and switches.
- Package contents inspected with npm pack --dry-run.
- Ten generated registry items use thin shared-package re-exports.

The offline documentation exporter inlines the scripts, styles, and fonts while preserving ordinary page links. The production build supports the `/polli-ui/` GitHub Pages base path.

`npm run test:docs` runs six browser checks for static content without JavaScript, hydration and local assets, keyboard search and focus, live component interactions, mobile navigation and overflow at five widths, clipboard feedback, and reduced motion. The check workflow runs these against the production subpath and uploads desktop/mobile screenshots. Local Chromium cannot launch in this workspace, so browser verification runs in GitHub Actions.

Pages deployment, package publishing, and app notifications retain their existing workflows. App enrollment still requires the settings described in README. No consuming application is modified by this documentation refactor.
