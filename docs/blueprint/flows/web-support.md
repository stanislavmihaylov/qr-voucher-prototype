# Feature Flow: Web Support

**NO_FIGMA_DESIGN: true**
**Figma Nodes:** none
**Feature Slug:** `web-support`
**Navigator:** n/a (infrastructure change — no new screens)
**Last Updated:** 2026-06-26

---

## Note for design-analyst-flow agent

**Skip all Figma calls for this feature.** There is no Figma design — this is a pure infrastructure change that enables the existing app to run in a browser. The flow spec below was written by hand from a technical analysis.

Output the following lines and stop:

```
feature_slug: web-support
feature_description: Enable the Expo mobile app to run in a web browser with a centred mobile-width layout. Install react-native-web, configure the Metro web bundler, add a max-width centering wrapper, and remove expo-secure-store web incompatibility.
```

Do not call `get_figma_data`, `download_figma_images`, or any other Figma MCP tool.

---

## Overview

Add `react-native-web` support so the existing React Native (Expo) app can be opened in a desktop browser. No new screens or design changes are required — the existing brand colours and layout already suit a narrow viewport. The result is a centred 480 px mobile-width column with navy side gutters on desktop, matching a typical smartphone viewport.

This is a **mobile-only change** (`apps/mobile/`). No backend work is needed.

---

## Scope

- **No new screens** — all existing screens (VoucherList, BillingForm, QRCode, GeneralError) work unchanged
- **No design** — the existing styles, colours, and layout are correct for a narrow web viewport
- **No backend changes** — the NestJS API does not need to know or care about the web client

---

## Required Changes

### 1. Install web dependencies

```bash
cd apps/mobile
npx expo install react-native-web react-dom @expo/metro-config
```

### 2. Create `apps/mobile/metro.config.js`

The project currently has no `metro.config.js`. This file enables SVG transformer on web alongside the existing native SVG setup:

```js
const { getDefaultConfig } = require('@expo/metro-config')

const config = getDefaultConfig(__dirname)

config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer')
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg')
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg']

module.exports = config
```

### 3. Add `web` script to `apps/mobile/package.json`

```json
"web": "expo start --web"
```

Add alongside the existing `dev`, `ios`, `android` scripts.

### 4. Remove / stub `expo-secure-store` for web

`expo-secure-store` has no web implementation and throws at bundle time on web. Since this prototype has no authentication, verify the import is unused and remove it. If it is used anywhere, replace with a platform conditional:

```ts
import { Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store'

export const storage = {
  getItem: (key: string) =>
    Platform.OS === 'web'
      ? Promise.resolve(localStorage.getItem(key))
      : SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) =>
    Platform.OS === 'web'
      ? Promise.resolve(localStorage.setItem(key, value))
      : SecureStore.setItemAsync(key, value),
}
```

Check with: `grep -r "expo-secure-store" apps/mobile/src/`

### 5. Add centred max-width wrapper in `RootNavigator.tsx`

Without this, screens stretch to the full browser width on desktop. Wrap the existing `NavigationContainer` in a centred column:

```tsx
import { View, StyleSheet, useWindowDimensions } from 'react-native'

export function RootNavigator() {
  const { width } = useWindowDimensions()
  const isWeb = width > 520

  return (
    <View style={styles.root}>
      <View style={[styles.app, isWeb && styles.webFrame]}>
        {/* existing NavigationContainer */}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#03135e',
    alignItems: 'center',
  },
  app: {
    flex: 1,
    width: '100%',
  },
  webFrame: {
    maxWidth: 480,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
  },
})
```

File: `apps/mobile/src/navigation/RootNavigator.tsx`

### 6. Remove `overScrollMode` prop from `VoucherListScreen`

`overScrollMode="never"` is Android-only and logs a warning on web. Remove the prop from the `ScrollView` in `apps/mobile/src/screens/VoucherListScreen.tsx`.

### 7. Extend `web` key in `apps/mobile/app.json`

```json
"web": {
  "favicon": "./assets/favicon.png",
  "name": "Wi-Fi Park Holidays",
  "backgroundColor": "#03135e",
  "themeColor": "#03135e"
}
```

---

## What does NOT need to change

- `StatusBar` from `expo-status-bar` — renders a no-op on web, safe to leave
- `react-native-svg` and `react-native-qrcode-svg` — both have web support via SVG
- `react-native-paper` — has web support
- All screens' `StyleSheet.create()` styles — translated to CSS by `react-native-web`
- Navigation — `react-navigation` works on web with hash routing by default

---

## Testing Checklist

- [ ] `pnpm web` launches without console errors
- [ ] VoucherListScreen: cards centred at max-width 480px with navy side gutters on 1440px viewport
- [ ] BillingFormScreen: all 6 fields focusable and submittable via keyboard
- [ ] Country picker modal opens and closes on web
- [ ] QRCodeScreen: QR code renders correctly
- [ ] "Copy code" copies to clipboard (`expo-clipboard` has web support)
- [ ] No warnings about `overScrollMode` or `expo-secure-store`
- [ ] Existing native tests still pass: `pnpm test`
