# Validation

Verified in this workspace:

- Shared ESM / TypeScript declaration build and compiled stylesheet.
- Production Vite build and 22 prerendered documentation pages.
- TypeScript strict type checking.
- All 13 default playground React snippets parse and pass strict TypeScript checks.
- All 1,412 relative page links and anchors resolve in the static build.
- Five interaction tests: button semantics and links, labelled fields and refs, dialog naming/Escape/focus restoration, keyboard tabs, keyboard checkboxes and switches.
- Package contents inspected with npm pack --dry-run.
- Ten generated registry items use thin shared-package re-exports.

The offline documentation exporter inlines the scripts, styles, and fonts while preserving ordinary page links. The production build supports the `/polli-ui/` GitHub Pages base path.

`npm run test:docs` runs thirteen browser checks for static content without JavaScript, hydration and local assets, keyboard search and focus, the editable notebook, all twelve component playgrounds, generated code and copy, validation, modal focus, menu and tooltip behaviour, mobile navigation and overflow at five widths, clipboard feedback, and reduced motion. The check workflow runs these against the production subpath and uploads desktop/mobile screenshots. Local Chromium cannot launch in this workspace, so browser verification runs in GitHub Actions. The 13 browser checks passed in [run 37869532057](https://github.com/Samarinara/polli-ui/actions/runs/37869532057); desktop, mobile, configured-code, and open-dialog screenshots were reviewed.

Pages deployment, package publishing, and app notifications retain their existing workflows. App enrollment still requires the settings described in README. No consuming application is modified by this component showcase refactor.
