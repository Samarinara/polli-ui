# Validation

Verified in this workspace:

- Shared ESM / TypeScript declaration build and compiled stylesheet.
- Production Vite build and 22 prerendered documentation pages.
- TypeScript strict type checking.
- All 13 default playground React snippets parse and pass strict TypeScript checks.
- All 1,412 relative page links and anchors resolve in the static build.
- Thirteen component and gesture tests: button semantics and links, labelled fields and refs, dialog naming/Escape/focus restoration, keyboard tabs, keyboard checkboxes and switches, uncontrolled multiple accordions with refs and callbacks, externally opened controlled dialogs.
- Package contents inspected with npm pack --dry-run.
- Twelve generated registry items use thin shared-package re-exports.

The offline documentation exporter inlines the scripts, styles, and fonts while preserving ordinary page links. All 22 exported pages retain the early theme script before the body. Vercel builds from the workspace root and serves `apps/preview/dist` at `/`.

`npm run test:docs` runs thirty-two browser checks for static content without JavaScript, hydration and local assets, keyboard search and focus, the editable notebook, all twelve component playgrounds, generated code and copy, validation, modal focus, menu and tooltip behaviour, mobile navigation and overflow at five widths, clipboard feedback, reduced motion, and interaction motion. The eight motion checks cover still default content and scrolling, real 180ms checkmark strokes, inset pressure without resizing, switch state with reduced motion, and disclosure/tab/portal entrance and exit behaviour. The check workflow runs these against the production root path and uploads desktop/mobile screenshots. Browser verification runs locally and in GitHub Actions. The 13 browser checks passed in [run 37869532057](https://github.com/Samarinara/polli-ui/actions/runs/37869532057); desktop, mobile, configured-code, and open-dialog screenshots were reviewed.

Vercel handles website deployment from `main`; package publishing and app notifications retain their existing GitHub workflows. App enrollment still requires the settings described in README. No consuming application is modified by this component showcase refactor.


Dark-mode checks cover the document-root class, system preferences and live OS changes, persisted overrides across pages, invalid or blocked storage, synchronization across tabs, and startup theming without the application bundle. Both themes check semantic text contrast, native control `color-scheme`, focus and control borders, and all five selected-tab ink tones. Dialog, menu, and tooltip portals must inherit the document colors and page body font, and update while open.

`tests/docs/theme.spec.ts-snapshots/` contains 36 PNG baselines: ten playgrounds, the colour viewport and accessible pairings, mobile button viewport and playground, three portals, and native search in each theme. Fixed viewports and focused sections keep comparisons independent of full-document capture-height fluctuations. These are real screenshot comparisons; CI fails on differences and uploads the browser artifacts. See README for the intentional baseline update command. The local component test retry used a longer worker startup allowance on a heavily loaded machine; the repository's Vitest settings remain unchanged.


Final verification: production build and type checking passed; all 13 component tests passed. The full browser run passed 28 checks. After fixing keyboard tab focus and stabilizing visual capture boundaries, all four affected checks passed on rerun, covering all 32 checks. Both visual matrices then passed again with snapshot updating disabled. Responsive checks cover all 22 pages at five widths, including 320px.
