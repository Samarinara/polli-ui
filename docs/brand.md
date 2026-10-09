# Polli brand & interface language

Polli makes everyday software feel approachable and connected. Use minimal layouts with generous spacing. Pastel colour is an accent and an invitation; the content stays central.

| Token | Colour | Purpose |
| --- | --- | --- |
| Polli green | `#016630` | Primary actions, brand anchors, focus |
| Soft coral | `#F3A6A0` | People, warmth, favourites |
| Butter yellow | `#F8D978` | Ideas, planning, small highlights |
| Sky blue | `#A8D5F2` | Inspiration, saved things, discovery |
| Cloud white | `#FAFBF6` | Default canvas |
| Mint | `#D9EEDD` | Soft selection and secondary actions |
| Ink | `#21352D` | Text on the light canvas and pastels |

## Composition

Start with a single canvas. Group with margins, alignment, and typography. Use ListRow for related items; use Surface for a genuinely meaningful group. Reserve shadows for floating menus and dialogs. Avoid cards around every item.

Use one clear primary action per local task. Buttons are round, inputs connect to the canvas with a quiet baseline, and labels stay visible. Serif headings and labels establish permanent structure; sans-serif text handles guidance and navigation; readable handwriting identifies personal content. The documentation uses locally hosted Lora, Inter, and Patrick Hand. Consuming apps load their fonts and set `--polli-font-heading`, `--polli-font-body`, and `--polli-font-input`. Use a 4px spacing rhythm, 16–24px within groups and 32–48px between them.

Keep advanced settings in accordions, menus, and dialogs. Reveal detail when needed; keep essential options discoverable. Never hide validation messages or required fields behind collapsed UI.

### Bones and meat

Every Polli app is a notebook with a printed structure and a personal life inside it. **Bones** are serif headings, permanent labels, clean rules, alignment, and spacing. They hold their position. **Meat** is handwritten content and the choices that matter: checkboxes, switches, editable fields, saved notes, and actions. These respond to touch without disturbing the structure.

Use `.polli-handwritten` for personal content outside fields. ListRow titles use the input font; descriptions remain guidance. Buttons and navigation use the body font, and field labels and status headings use the heading font. A component's role determines its response: a badge used as a label stays still; a badge used as a real action receives pressure feedback. Supply accessible semantics, focus, and keyboard handling for custom actions.

## Accessibility

Ink text belongs on pastels; Cloud White belongs on Polli Green. Pastels should not carry white text. Do not communicate state with colour alone. Every icon-only control needs an accessible name. Fields need associated labels and error descriptions. Preserve Radix focus handling and keyboard behaviour. The default button target is 44px tall; small controls need sufficient surrounding space. Motion respects reduced-motion preferences.

Dark mode is opt-in with a `.dark` class at the document root so portalled content inherits the same tokens. Import the stylesheet once. Use `.polli-root` on the app shell to apply Polli typography and canvas styling; the package avoids a global CSS reset to reduce impact on existing apps.

The documentation uses original Polli wordmark and mascot SVGs from polli.page. Preserve proportions and original colours. Keep the wordmark on a quiet background with clear space around it; never replace it with a decorative flower glyph.

## Motion and documentation

Motion begins with an interaction or its resulting state change. Hover changes colour or emphasis. Pressing adds inset pressure and a 1px icon displacement; a button never lifts or scales. Avoid popping and whole-element bounce. A switch thumb may overshoot very slightly before settling; larger reveals use smooth easing.

| Interaction | Response | Shared token |
| --- | --- | --- |
| Press | Inset pressure, 90ms | `--polli-motion-press` |
| Release, selection, tooltip | Colour or opacity, 160ms | `--polli-motion-state` |
| Checkbox | Draw the checkmark or mixed-state stroke, 180ms | `--polli-motion-ink` |
| Field focus | Baseline takes ink, 180ms; preserve focus outline | `--polli-motion-ink` |
| Switch | Thumb glides with a small settling overshoot, 240ms | `--polli-motion-settle` |
| Accordion | Height unfolds and chevron turns, 220ms | `--polli-motion-reveal` |
| Dialog and menu | Fade and move 3px on open, 220ms; fade out, 160ms | `--polli-motion-reveal` |
| Tabs | Newly selected content gains ink emphasis, 160ms | `--polli-motion-state` |

Initial checked controls, default tabs, default open disclosures, server-rendered content, and hydration do not play entrance animations. Root wrappers retain Radix controlled/uncontrolled props, callbacks, refs, focus handling, and keyboard behaviour. Root state changes arm subsequent reveals, including controlled changes from an external action.

Surfaces, separators, avatars, badges, alerts, empty states, and skeletons remain still when they are reading content. Badges, avatars, rows, or surfaces with `role="button"` or `role="link"` receive focus and pressure styling; the consuming app provides the corresponding activation behaviour. An Alert or EmptyState mounted as a result of a user action may use `data-polli-motion="interaction"` for a short ink fade. Do not set this attribute on initial content. Skeletons do not pulse.

Reduced-motion preferences remove animations and transitions from controls and their descendants, including SVG strokes and switch thumbs. Preserve state transforms: a checked switch must still occupy its on position and an open chevron must still point up. Pages, headings, and navigation remain still, with no entrance sequence, scroll reveal, or artificial loading state.

The guideline site renders nine static HTML documents at build time, then hydrates the interactive controls. Ordinary links, headings, section anchors, and mobile navigation work without JavaScript. Search and live examples are enhancements. The site is deliberately light; the shared package still supports opt-in dark tokens for consuming apps.

## Component API

All primitives accept className and native/Radix props. Interactive primitives forward refs where focus integration matters. Dialog always needs DialogTitle and DialogDescription (or an intentional accessible description alternative). Button `asChild` supports links; disabled link behaviour remains the app's responsibility. NativeSelect uses the browser's accessible selection behaviour. Avatar accepts a name and optional image URL; apps should supply a fallback for failed remote images. Field arranges content; the caller connects Label, id, aria-describedby, and aria-invalid.

This is the initial component set, not the full upstream shadcn catalogue. New primitives should be added here with a live documentation example, keyboard checks for meaningful interactions, and the same public prop conventions.
