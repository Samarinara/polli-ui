# Expo migration validation

Validated on 2026-10-21 with Node 24.

- Library JavaScript and TypeScript declaration build passed.
- Vite legacy web docs build and prerender of 22 pages passed.
- Root TypeScript check passed.
- Expo gallery TypeScript check passed.
- Existing web component suite passed, 26 tests.
- Universal React Native Web suite passed, 6 tests. These cover press/text callbacks, field accessible names, disabled selection, tabs, accordions, dialog portals and dismissal, select options and labels, menu actions, and one-time removal completion in StrictMode.
- Expo SDK 58 production exports passed for web, iOS, and Android, including Hermes native bundles.
- Package dry run includes the universal entry points, legacy web entry points, declarations, styles, and licenses.

The Playwright suites could not execute page assertions in this environment. Chromium launched and terminated with `socket() failed: Operation not permitted` before opening a page. This affects both the existing docs suite and the new Expo gallery suite. CI runs both after installing Chromium. No browser screenshot or visual-regression result was obtained locally.

Native bundle export verifies module resolution and compilation. It does not verify native rendering, keyboard behavior, screen-reader output, native modal stacking, or Android back navigation. Complete those checks on iOS and Android before publishing a stable release. The Expo gallery includes every component group for this purpose.
