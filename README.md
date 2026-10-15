# Polli UI

An interactive component documentation site and shared component package for **polli.page**. Editorial layouts, serif headings, readable handwritten content, and purposeful pastel accents.

## Run the showcase

```sh
npm ci
npm run build
npm run dev
```

Open the Vite URL. The homepage is a working notebook: add notes, mark them complete, delete them, filter completed items, and switch to saved links. Example changes are local to the page and reset when you leave.

The component library has twelve dedicated playgrounds for Button, Fields, Checkbox, Switch, Badge, Tabs, Accordion, Dialog, Dropdown menu, Tooltip, Feedback, and Lists & surfaces. Each has Preview / Code tabs, editable props, reset, usage guidance, and an API table. Controls update the real shared component and its copyable React example. Brand, logo, colour, typography, layout, motion, and writing guides sit alongside the library.

Polli's notebook has **bones** (serif headings and clean lines) and **meat** (handwritten content and meaningful controls). Interaction motion includes 180ms pen-stroke checkmarks, gently settling switches, inked field baselines, inset button pressure, and smooth disclosures and overlays. Default content stays still, skeletons do not pulse, and reduced motion preserves clear state without animation. Try the notebook on the Motion page; see [the motion guidelines](docs/brand.md#motion-and-documentation) for timing tokens and opt-in feedback.

Navigation uses ordinary links, with a searchable index (Cmd/Ctrl K), section anchors, and mobile navigation. `npm run build` prerenders all 22 pages to `apps/preview/dist`. Content and default previews appear before JavaScript loads, with no loading screen or entrance animations. JavaScript adds playground interactions, search, and clipboard actions. Fonts and official logo artwork are hosted locally. Vercel serves the site at the domain root. `PREVIEW_BASE` remains available for other static hosts that need a subpath.

`npm run preview:file` generates an offline `polli-ui-preview/` directory with inlined JavaScript, CSS, and fonts. Open its `index.html` to browse and test the components. Ordinary page links and the registry files remain available in that directory.

## Use it in an app

Configure your npm scope for GitHub Packages in `.npmrc`:

```ini
@samarinara:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Supply a GitHub Packages read token in your environment; never commit one. For private packages, give the consuming repository access in the package's settings or use a token with access.

```sh
npm install @samarinara/polli-ui@latest
```

```tsx
// App entry point; for Next.js, app/layout.tsx.
import "@samarinara/polli-ui/styles.css";
import { Button } from "@samarinara/polli-ui/components/button";
import { Field, Input } from "@samarinara/polli-ui/components/field";

export function AddIdea() {
  return (
    <div className="polli-root">
      <Field label="A little idea" hint="Something worth remembering.">
        <Input name="idea" placeholder="Weekend plans" />
      </Field>
      <Button>Save idea</Button>
    </div>
  );
}
```

The package ships compiled CSS, ESM JavaScript, and TypeScript declarations. Consuming apps do not need to scan node_modules with Tailwind. React and React DOM are peer dependencies. Compatible with React 18.3 and 19.

`Field` connects its label, hint, and error to one `Input`, `Textarea`, `NativeSelect`, `Checkbox`, or `Switch`. An error also sets `aria-invalid`. IDs are unique across repeated instances. Existing explicit labels and descriptions still work; use `htmlFor` on `Field` for custom controls or explicitly named nested controls.

Use `asChild` to compose native elements without extra wrappers. `Button` supports disabled links, and `Badge`, `Surface`, and `ListRow` can adopt a button, link, or section. For example:

```tsx
<ListRow asChild title="Weekend plans" description="Read the saved note">
  <a href="/notes/weekend" />
</ListRow>
```

Keep separate row actions outside a linked row to avoid nesting interactive elements. Menus and dialogs are modal by default, with background isolation. Tab and Shift Tab dismiss a menu and continue from its trigger; Escape restores the trigger. Use `modal={false}` for a menu that permits interaction with the surrounding page. Dialog, menu, and tooltip content accept a portal `container`; dialogs also accept `showCloseButton` and a localized `closeLabel`.

Copyable playground examples include the stylesheet and `.polli-root` wrapper. Avatars fall back to initials if an image fails, and long labels and floating content wrap within small viewports. See [the UI audit](docs/ui-audit.md) for coverage and remaining validation limits.

## Keep every app connected

Components are owned here and **imported**, so fixes stay central. Every component change on `main` passes checks and publishes a unique `0.1.<workflow run>` package build to GitHub Packages. No npm account is required.

Enroll each app once:

1. Adopt package imports and the stylesheet. Replace local copies only after checking their custom behaviour.
2. Copy `examples/polli-ui-update.yml` into the app's `.github/workflows/` directory. It assumes npm, a `main` branch, and `test:ci` / `build` scripts; adapt to the app's package manager and checks.
3. In the UI repository, set variable `POLLI_APP_REPOSITORIES` to comma-separated `owner/repo` names. Add secret `POLLI_APP_UPDATE_TOKEN` with permission to dispatch events to those repos.
4. In each app, set `POLLI_PACKAGES_READ_TOKEN` with package read access and `POLLI_APP_UPDATE_TOKEN` with push permission. The update token makes the resulting push trigger the app's existing deployment workflow; pushes with the default GITHUB_TOKEN do not trigger another workflow.
5. Ensure branch protection permits your chosen bot, or change the final step to open an update PR using your normal dependency bot. A protected branch rejection fails visibly and leaves the app untouched.

After enrollment: UI change → checked package release → app notification → dependency update → app tests/build → commit → existing app deployment. A failed app build blocks that app's update. App code must use shared imports to benefit; this repository cannot update a local component copy. Workflow files are ready, but existing Polli apps are **not enrolled or modified** by this scaffold.

Stable compatibility: `0.1` is the initial API. Breaking changes require a deliberate minor/major migration and a change to the release version scheme before publishing. Lockfiles retain the precise working version. For rollback, reinstall the prior exact package version and redeploy.

## shadcn registry

The docs serve `/registry.json` and `/r/polli-button.json` (and other component families). `npm run registry` rebuilds these from the package version. For local development, after `npm run build` / `npm run dev`:

```sh
npx shadcn@latest add http://localhost:5173/r/polli-button.json
```

Configure GitHub Packages access first and import the package stylesheet in your app entry point. The registry installs thin re-exports of the shared package, preserving central ownership. Registry wrappers install the latest published package build. A component copied and edited into an app becomes an intentional fork and no longer receives central implementation updates.

## Publish the showcase

The docs deploy to Vercel from the connected `Samarinara/polli-ui` repository. Production follows `main`; other branches receive preview deployments. The repository's `vercel.json` uses the workspace root, `npm ci`, `npm run build`, and `apps/preview/dist`. Set the Vercel project's Root Directory to the repository root and Node.js to 22.x.

The site is served at `/`, including all prerendered `.html` pages, local fonts and artwork, and the registry endpoints. No SPA catch-all is needed: component pages are real HTML documents. Build and browser checks use this same root path. GitHub Actions runs checks and publishes the shared package; Vercel handles the website deployment.

## What's inside

- `packages/ui`: shared components, brand tokens, stylesheet, shadcn configuration.
- `apps/preview`: static component documentation, configurable playgrounds, local fonts and logos, and registry endpoints.
- `docs/brand.md`: brand rules, hierarchy, accessibility, and composition.
- `.github/workflows`: checks and package publishing.
- `examples/polli-ui-update.yml`: app enrollment workflow.

```sh
npm run build
npm run typecheck
npm test
npx playwright install chromium
npm run test:docs
npm pack -w @samarinara/polli-ui --dry-run
```

MIT licensed. The Polli name and brand identity belong to their owner. See `THIRD_PARTY_NOTICES.md` for shadcn/ui and upstream attribution.


## Dark mode

Set `document.documentElement.classList.toggle("dark", isDark)` to switch themes. Place `.dark` on `<html>` so Radix portals and native controls inherit the same tokens; `.polli-root` remains the typography and canvas wrapper. The preview follows the OS by default, persists Light/Dark/System choices, and includes a dark-mode toggle in each playground.

Decorative foreground tokens (`--mint-foreground`, `--coral-foreground`, `--butter-foreground`, `--sky-foreground`) let you customize pastel text independently of page text. See [theme customization](docs/brand.md#theme-customization-and-contrast).

`npm run test:docs` includes light/dark screenshot comparisons and theme/portal/contrast checks. To update reviewed baselines after an intentional design change, run `npm run build` then `npm run test:docs -- tests/docs/theme.spec.ts --update-snapshots`. Commit the updated PNGs with the change; CI compares against them and uploads failures.
