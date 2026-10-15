# Validation

Audit date: 2026-10-13. Findings and integration guidance are in [ui-audit.md](ui-audit.md).

## Build and package

- `npm run build` passed: shared ESM, TypeScript declarations, compiled CSS, 12 registry items, and the production documentation with 22 prerendered pages.
- `npm run typecheck` passed with strict TypeScript settings.
- `npm test` passed all 26 component and gesture tests.
- `npm pack --dry-run --json -w @samarinara/polli-ui` includes 83 files, including all component exports, token declarations, the shared stylesheet, and third-party notices.
- `npm audit --omit=dev` reports zero production advisories. Five development dependency advisories remain documented in the audit.

## Browser coverage

The full audit browser run passed all 88 checks. Automated axe scans found no violations of the selected WCAG 2 A/AA, 2.1 A/AA, and 2.2 AA rules across all 22 pages in both themes at desktop and 320px widths. Interactive scans also cover invalid fields, textareas, native selects, open dialogs, menus and tooltips, search results, and mobile navigation.

Two additional menu regressions bring the suite to 90 tests. Final keyboard and custom-root changes passed all 37 affected browser checks across follow-up runs. Both interactive accessibility scans passed again. The four visual matrix/portal checks passed with snapshot updates disabled after font loading was awaited before setting the native theme selector.

The checks cover static HTML without JavaScript, hydration and local assets, keyboard search, mobile navigation, all playgrounds, native form submission/reset, disabled actions, disclosure navigation, focus restoration, portal theming, semantic contrast, reduced motion, cancellable removal, and clipboard feedback. Responsive overflow checks cover every page at five widths.

A separate integration fixture imports the compiled package with its own stylesheet and no showcase CSS. It exercises repeated Field instances, long content at 320px/768px/1440px, custom native roots, vertical tabs, nested modal isolation, overlay scrolling and bounds, a close button that stays reachable while scrolling, RTL switches, forced colors, and suppressed host animations.

The copyable-example browser check compiles 21 snippets using strict TypeScript: 13 default examples, seven configured states, and the getting-started example. Configurations include disabled icon buttons, multiline labels, textarea/select fields, mixed checkboxes, an empty multiple accordion, empty feedback, and surfaced lists.

## Visual review

The 36 PNG baselines in `tests/docs/theme.spec.ts-snapshots/` cover component playgrounds, mobile buttons, colour tokens, search, and open portals in light and dark mode. Baselines were updated for the reviewed shared styling changes. Inputs and list titles use consistent 20px handwritten typography, button labels retain their 14px body type, and the dark Alert has readable actions on its pastel surface.

Screenshot comparison runs use fixed viewports and focused sections. CI compares against committed baselines and uploads browser artifacts; intentionally updating baselines requires the command documented in README.

## Limits

These results cover Chromium browser behavior and automated accessibility rules. They do not constitute assistive-technology certification; consuming applications still need meaningful labels, appropriate content, and screen-reader review of their workflows. React 18.3.1 also received a browser smoke check for dialog isolation, native form reset, and removal without console errors. The normal test suite uses React 19.
