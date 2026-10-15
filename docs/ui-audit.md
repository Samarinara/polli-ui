# Polli UI audit

Audit date: 2026-10-13. Scope: every shared component family, typography and theme tokens, motion, documentation playgrounds, copyable examples, package exports, and registry wrappers.

## Fixes

| Area | Finding | Result |
| --- | --- | --- |
| Fields | Labels, hints, errors, and invalid states required manual wiring | Field connects one shared control automatically, preserves explicit relationships, and generates unique IDs. Input, Textarea, NativeSelect, Checkbox, and Switch share this behavior. |
| Buttons | Disabled slotted links could activate; slotted buttons could submit unexpectedly | Disabled links block child and parent click handlers and leave the tab order. Native buttons keep an explicit safe type. |
| Composition | DialogContent, AccordionTrigger, and selection controls could fail with `asChild` because they append controls/icons | Slottable preserves the intended root and appends the built-in content safely. Badge, Surface, and ListRow also support native roots. |
| Modal focus | A modal menu could hide focusable background content using only `aria-hidden` | Modal content additionally makes background siblings inert, restores prior state, and supports nested overlays. The modal default is preserved. Tab and Shift Tab dismiss menus and continue to adjacent controls instead of trapping keyboard users. |
| Feedback | Dark-mode ghost actions had white text on mint, with a measured 1.17:1 contrast ratio | Alert defines suitable local text, action, hover, border, and focus tokens for its light pastel surface. |
| Visual consistency | Showcase-only rules changed control typography, padding, wrapping, and disabled accordion appearance | The shared stylesheet owns these rules. Documentation consumes the same component styling as applications. |
| Responsive content | Fixed button heights clipped wrapped labels; long content and floating surfaces could overflow | Buttons use minimum heights. Content wraps, menus scroll within available height, tooltips have bounded width, and dialogs use dynamic viewport height. |
| Dialog polish | Close actions could collide with long titles, scroll out of view, and were difficult to customize | Titles reserve close-action space; the sticky close target is 44px and remains reachable while scrolling. Consumers can set `closeLabel`, `showCloseButton`, and a portal `container`. |
| Avatars | Failed images had no fallback; irregular whitespace produced poor initials | Image failures fall back to trimmed, uppercase initials. Changing the image source retries loading. Empty names have a useful fallback. |
| Tabs | Vertical orientation still rendered a horizontal list; focus outline could be suppressed by utility styles | Vertical lists align vertically and keep Radix navigation. Keyboard focus has an explicit ring; panels retain their focus indicator. |
| Selection | The checkbox was 22px; forced-color rendering relied on custom fill colors | Checkbox targets are 24px and selection uses system colors under forced colors. RTL switches retain their on position. |
| Removal motion | Deletion depended on receiving a CSS animation event | Removal has a fallback based on computed animation timing, supports cancellation, and completes with suppressed or reduced motion. |
| Reuse | Several copied examples relied on surrounding setup, fixed IDs, or an inferred empty-array type | Examples include stylesheet and root setup, use unique IDs, and explicitly type multiple accordion state. The getting-started example is executable. |
| Package APIs | Registry wrappers omitted public prop types; token exports had no explicit type condition | Registry wrappers re-export public types and tokens expose their declaration file. |
| Feedback semantics | Clipboard failures could be silent for palette controls | All copy controls announce an unavailable clipboard. Alerts use atomic status announcements and empty-state icons are decorative. |
| Documentation | A horizontally scrolling code block could not receive keyboard focus | Code regions are focusable, named, and have a visible focus indicator. |
| React compatibility | React 18 did not recognize a boolean inert prop on removed content | InkRemoval emits the appropriate inert attribute for React 18 and 19. A React 18.3.1 browser smoke check covers dialogs, form reset, and removal without console errors. |

## Coverage

- Component tests cover labels and descriptions, validation changes, explicit IDs, keyboard activation, disabled links, native forms and reset, image fallback, slotted roots, menu selection, tooltips, focus restoration, and cancellable removal.
- Browser accessibility checks use axe WCAG 2 A/AA, 2.1 A/AA, and 2.2 AA rules across all 22 documentation pages in light and dark mode, plus validation, open overlays, search, and mobile navigation.
- A separate fixture imports the compiled package without the showcase stylesheet. It checks 320px, 768px, and 1440px layouts, long labels, vertical tabs, native forms, slotted selection controls, disabled menu triggers, Tab/Shift Tab navigation in both menu modes, overlay bounds and scrolling, nested modal isolation, forced colors, RTL, and host-suppressed animation.
- Copyable default and configured examples are compiled with strict TypeScript checks, including a multiple accordion with no open items.
- Existing browser checks cover static HTML without JavaScript, hydration, assets, navigation, every playground, reduced motion, interaction motion, contrast tokens, and light/dark screenshot comparisons.

Verification results are recorded in [validation.md](validation.md).

## Integration rules

Import the stylesheet once and place `.polli-root` on the application shell. Keep the dark class and theme/font tokens on `html` so body-mounted portals inherit them. Use Field for one control, or supply explicit native label and description relationships for custom controls. Icon-only actions still need a meaningful accessible name. Dialogs need a title and description or an intentional accessible alternative. Do not put separate interactive actions inside a linked/button row.

The audit uses [W3C guidance for labels](https://www.w3.org/WAI/tutorials/forms/labels/), [field descriptions](https://www.w3.org/WAI/tutorials/forms/instructions/), and [minimum target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum). Automated scans and keyboard/browser checks do not replace a screen-reader review of each consuming application's content and workflows.

## Dependency findings

`npm audit --omit=dev` reports no production advisories. The complete development tree reports five advisories: braces and its micromatch/Parcel/Tailwind CLI dependents, plus tsup's esbuild dependency. `npm audit fix` did not resolve them with the current compatible ranges. They remain tracked here; no forced dependency migration was made during the component audit.
