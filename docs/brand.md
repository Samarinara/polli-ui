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

Use one clear primary action per local task. Buttons are round, inputs have soft corners, and labels stay visible. Prefer system typography for familiar performance and broad language support. Use a 4px spacing rhythm, 16–24px within groups and 32–48px between them.

Keep advanced settings in accordions, menus, and dialogs. Reveal detail when needed; keep essential options discoverable. Never hide validation messages or required fields behind collapsed UI.

## Accessibility

Ink text belongs on pastels; Cloud White belongs on Polli Green. Pastels should not carry white text. Do not communicate state with colour alone. Every icon-only control needs an accessible name. Fields need associated labels and error descriptions. Preserve Radix focus handling and keyboard behaviour. The default button target is 44px tall; small controls need sufficient surrounding space. Motion respects reduced-motion preferences.

Dark mode is opt-in with a `.dark` class at the document root so portalled content inherits the same tokens. Import the stylesheet once. Use `.polli-root` on the app shell to apply Polli typography and canvas styling; the package avoids a global CSS reset to reduce impact on existing apps.

The floral mark in the preview is a typographic placeholder, not a replacement for the official Polli mascot or logo. Add authorised logo assets when available.

## Component API

All primitives accept className and native/Radix props. Interactive primitives forward refs where focus integration matters. Dialog always needs DialogTitle and DialogDescription (or an intentional accessible description alternative). Button `asChild` supports links; disabled link behaviour remains the app's responsibility. NativeSelect uses the browser's accessible selection behaviour. Avatar accepts a name and optional image URL; apps should supply a fallback for failed remote images. Field arranges content; the caller connects Label, id, aria-describedby, and aria-invalid.

This is the initial component set, not the full upstream shadcn catalogue. New primitives should be added here with a live gallery example, keyboard checks for meaningful interactions, and the same public prop conventions.
