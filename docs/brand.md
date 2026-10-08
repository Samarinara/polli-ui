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

## Accessibility

Ink text belongs on pastels; Cloud White belongs on Polli Green. Pastels should not carry white text. Do not communicate state with colour alone. Every icon-only control needs an accessible name. Fields need associated labels and error descriptions. Preserve Radix focus handling and keyboard behaviour. The default button target is 44px tall; small controls need sufficient surrounding space. Motion respects reduced-motion preferences.

Dark mode is opt-in with a `.dark` class at the document root so portalled content inherits the same tokens. Import the stylesheet once. Use `.polli-root` on the app shell to apply Polli typography and canvas styling; the package avoids a global CSS reset to reduce impact on existing apps.

The documentation uses original Polli wordmark and mascot SVGs from polli.page. Preserve proportions and original colours. Keep the wordmark on a quiet background with clear space around it; never replace it with a decorative flower glyph.

## Motion and documentation

Hover changes colour or emphasis. A button compresses to 0.97 scale while pressed; it never lifts. Reduced-motion preferences remove the press transform and transitions. Pages, headings, and navigation remain still, with no entrance sequence or artificial loading state.

The guideline site renders nine static HTML documents at build time, then hydrates the interactive controls. Ordinary links, headings, section anchors, and mobile navigation work without JavaScript. Search and live examples are enhancements. The site is deliberately light; the shared package still supports opt-in dark tokens for consuming apps.

## Component API

All primitives accept className and native/Radix props. Interactive primitives forward refs where focus integration matters. Dialog always needs DialogTitle and DialogDescription (or an intentional accessible description alternative). Button `asChild` supports links; disabled link behaviour remains the app's responsibility. NativeSelect uses the browser's accessible selection behaviour. Avatar accepts a name and optional image URL; apps should supply a fallback for failed remote images. Field arranges content; the caller connects Label, id, aria-describedby, and aria-invalid.

This is the initial component set, not the full upstream shadcn catalogue. New primitives should be added here with a live documentation example, keyboard checks for meaningful interactions, and the same public prop conventions.
