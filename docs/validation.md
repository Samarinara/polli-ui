# Validation

Verified in this workspace:

- Shared ESM / TypeScript declaration build and compiled stylesheet.
- Production Vite gallery build.
- TypeScript strict type checking.
- Five interaction tests: button semantics and links, labelled fields and refs, dialog naming/Escape/focus restoration, keyboard tabs, keyboard checkboxes and switches.
- Package contents inspected with npm pack --dry-run.
- Ten generated registry items use thin shared-package re-exports.

Visual browser inspection could not run in this workspace because the Chromium download failed. Desktop/mobile layouts and colour modes are implemented, but still require browser visual review.

GitHub Actions, package publishing, Pages deployment, and app notifications require the repository to exist plus the enrollment/settings described in README. They were authored here, not executed against a remote repository. No existing application has been changed.
