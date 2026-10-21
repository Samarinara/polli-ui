# Universal Polli UI

Version 0.2 makes the main package a React Native library. The same imports run in Expo on iOS, Android, and web. Components use React Native styles and RN Primitives for accessible controls. No CSS or Tailwind setup is required for the universal components.

## Install in an Expo app

Configure GitHub Packages authentication for the `@samarinara` scope as described in the repository README, then install:

```sh
npm install @samarinara/polli-ui
npx expo install react-native-svg react-native-web react-dom @expo/metro-runtime
```

Match React and React Native to your Expo SDK. The included gallery uses Expo SDK 58, React 19.3, and React Native 0.88. Native consumers do not need React DOM. The package lists React Native SVG as a peer so Expo can choose its supported native version.

```tsx
import * as React from 'react';
import { PolliProvider, Text, Field, Input, Button } from '@samarinara/polli-ui';

export default function App() {
  const [thought, setThought] = React.useState('');
  return (
    <PolliProvider mode="system">
      <Field label="A little thought" style={{ margin: 24 }}>
        <Input value={thought} onChangeText={setThought} />
      </Field>
      <Button onPress={() => console.log(thought)}>Keep it</Button>
      <Text>Your collection is private.</Text>
    </PolliProvider>
  );
}
```

Mount one `PolliProvider` above navigation. It supplies semantic colours, font families, and the native portal host. Dialogs, menus, selects, and tooltips need this host. Keep app content inside a safe area and handle keyboard avoidance at the screen level. An app embedding native modal screens may need a provider inside that native modal so its portals appear above it.

Set `mode` to `light`, `dark`, or `system`. Pass partial `theme` colours or `fonts={{ body: 'Inter', heading: 'Lora', input: 'PatrickHand' }}` after loading those fonts with `expo-font`. Polli does not download fonts at runtime. System fonts are the fallback. Native text does not inherit fonts or colours from a surrounding View. Use Polli `Text`, or pass explicit styles to custom text children.

## API migration

| Browser API in 0.1 | Universal API in 0.2 |
| --- | --- |
| `onClick` | `onPress` |
| `onChange={event => ...event.target.value}` | `onChangeText={value => ...}` |
| `className` and CSS variables | `style`, `textStyle`, and `PolliProvider` |
| `<div>`, `<span>`, `<p>` | React Native `View` and Polli `Text` |
| `aria-label` | `accessibilityLabel` |
| `<NativeSelect><option ... /></NativeSelect>` | `options={[{ value, label }]}` and `onValueChange` |
| `buttonVariants` | `Button` variants and `style` |
| Indeterminate checkbox | Boolean `checked`; use a separate UI for partial selection |
| DOM refs | React Native component refs |
| Menu `onSelect` | Menu item `onPress` |
| `asChild` on every HTML wrapper | Use `asChild` on primitive triggers and closes, or compose a Pressable around a layout component |

Strings inside Polli buttons, badges, menu items, tabs, and content wrappers become `Text` automatically. Custom View children still need their own Text nodes. For icons, use `lucide-react-native` rather than `lucide-react`.

`Checkbox`, `Switch`, and `Tabs` support controlled and uncontrolled state. `NativeSelect` takes an array of options, with optional disabled items. Supply accessible labels to controls outside a `Field`. On Android, Field connects the control to its label with `accessibilityLabelledBy`. Field also supplies an accessible name directly for iOS, which does not support that association.

`DialogTrigger`, `DialogClose`, `DropdownMenuTrigger`, and `TooltipTrigger` compose with `<Button>` through `asChild`. Always give dialogs a `DialogTitle` and `DialogDescription`. Tooltips use native press gestures and web hover/focus. They must not contain the only explanation of a required action. RN Primitives handles Android back dismissal and web keyboard/focus behavior.

`AnimatedIcon` plays only after its `actionKey` changes. `InkText` adds a persistent underline after `underlineKey` changes and supports `crossedOut`. Native ink marks use text decoration instead of browser SVG stroke animation. `InkRemoval` fades out, excludes removed content from accessibility, and calls `onExitComplete` once. The parent removes the row and closes its layout gap. Reduced-motion settings suppress icon/removal motion. Nothing animates on mount.

## Existing web apps

The previous DOM components remain available under an explicit compatibility path:

```tsx
import { Button } from '@samarinara/polli-ui/web/components/button';
import '@samarinara/polli-ui/styles.css';
```

The complete legacy API is also available from `@samarinara/polli-ui/web`. The existing Vite documentation site and shadcn registry target that API. Its HTML examples are not universal components. Do not import `/web` or `styles.css` into a native app. Move one screen at a time to the main package.

Universal components also have individual entry points such as `@samarinara/polli-ui/components/button`. Both main and component exports resolve to the same implementation on all platforms. Metro resolves the underlying primitive libraries' `.web` implementations for web and their native implementations for iOS and Android. Do not prebundle those dependencies into a platform-neutral library bundle.

For a non-Expo web bundler, alias `react-native` to `react-native-web` and resolve `.web.js` and `.web.mjs` before `.js` and `.mjs`. Expo Metro supplies this configuration.

## Run and validate

From the repository root:

```sh
npm ci
npm run build
npm run typecheck
npm test
npm run test:universal
npm run typecheck:expo
npm run build:expo
npx playwright install chromium
npm run test:expo
npm run expo
# Or run only the web gallery:
npm run expo:web
```

The Expo gallery imports the built package, so rebuild the library after changing its source. `npm run build:expo` produces web assets and iOS/Android JavaScript bundles. It does not compile native binaries or exercise VoiceOver/TalkBack. Before release, test the gallery in an iOS simulator and Android emulator or Expo Go, including screen readers, large font sizes, software keyboards, safe areas, native modal screens, and Android back dismissal.

The existing docs remain available through `npm run dev`. CI validates both APIs and exports the gallery for all platforms. The 0.2 release line is intentionally separate from the old 0.1 DOM contract.
