# Polli UI ✿

A shared design language for the small experiences at **polli.page**: friendly pastel colours, soft controls, clear typography, and connected layouts organised with space.

## Try the gallery

```sh
npm ci
npm run build
npm run dev
```

Open the Vite URL. `npm run preview:file` also generates a self-contained HTML gallery that you can open directly. The gallery includes every exported component family, interactive controls, keyboard-friendly overlays, responsive layouts, a dark theme, and usage examples. Production output is `apps/preview/dist`.

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
import '@samarinara/polli-ui/styles.css';
import { Button } from '@samarinara/polli-ui/components/button';
import { Input, Label } from '@samarinara/polli-ui/components/field';

export function AddIdea() {
  return <div className="polli-root">
    <Label htmlFor="idea">A little idea</Label>
    <Input id="idea" placeholder="Something worth remembering" />
    <Button>Save idea</Button>
  </div>;
}
```

The package ships compiled CSS, ESM JavaScript, and TypeScript declarations. Consuming apps do not need to scan node_modules with Tailwind. React and React DOM are peer dependencies. Compatible with React 18.3 and 19.

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

The gallery serves `/registry.json` and `/r/polli-button.json` (and other component families). `npm run registry` rebuilds these from the package version. For local development, after `npm run build` / `npm run dev`:

```sh
npx shadcn@latest add http://localhost:5173/r/polli-button.json
```

Configure GitHub Packages access first and import the package stylesheet in your app entry point. The registry installs thin re-exports of the shared package, preserving central ownership. Registry wrappers install the latest published package build. A component copied and edited into an app becomes an intentional fork and no longer receives central implementation updates.

## Publish the gallery

Enable **Settings → Pages → Build and deployment → GitHub Actions**. The included workflow deploys the gallery to `https://samarinara.github.io/polli-ui/` on pushes to `main`. This URL becomes live only after Pages is enabled and deployment succeeds. Private repo Pages availability depends on the GitHub plan. If hosting under another path or domain, change `PREVIEW_BASE`. Alternatively deploy `apps/preview/dist` as a static site.

## What's inside

- `packages/ui`: shared components, brand tokens, stylesheet, shadcn configuration.
- `apps/preview`: live component gallery and registry endpoint.
- `docs/brand.md`: brand rules, hierarchy, accessibility, and composition.
- `.github/workflows`: checks, package publishing, and gallery deployment.
- `examples/polli-ui-update.yml`: app enrollment workflow.

```sh
npm run build
npm run typecheck
npm test
npm pack -w @samarinara/polli-ui --dry-run
```

MIT licensed. The Polli name and brand identity belong to their owner. See `THIRD_PARTY_NOTICES.md` for shadcn/ui and upstream attribution.
