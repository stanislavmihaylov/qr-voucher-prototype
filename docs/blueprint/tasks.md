# Feature Task List

> Managed by the pipeline orchestrator. Mark [x] when a feature is merged.
> Order reflects implementation dependency — later features may depend on earlier ones.
> Derived from: Wi-Fi Park Holidays App (Figma file W37yVPZEuwtY0UWMyiyFwL).

## Backlog

- [x] `voucher-selection` — Browse and select a Wi-Fi package from the list (depends on: nothing)
- [x] `billing` — Enter billing/address details before mock payment (depends on: voucher-selection)
- [x] `qr-code` — Display QR code after mock payment success (depends on: billing)
- [x] `error` — Generic error screen with retry CTA (depends on: nothing)
- [x] `error` — Generic error screen with retry CTA (depends on: nothing)
- [x] `web-support` — Enable the app to run in a browser via react-native-web (depends on: nothing) **[NO_FIGMA_DESIGN]**

## In Progress

_none_

## Completed

_none_

---

## Feature: Voucher Selection
> Display three Wi-Fi package cards (1-day, 4-day, 7-day) and navigate to billing when the user taps a card's buy button.

### Backend
- [ ] Prisma model: `WifiVoucher` (fields: `id`, `name`, `durationLabel`, `deviceLimit`, `priceGBP`, `iconKey`, `createdAt`)
- [ ] Seed: insert the 3 package rows in `prisma/seed.ts` (1-day £7.99, 4-day £14.99, 7-day £17.99 — all 6 devices)
- [ ] GET `/api/vouchers` — list all vouchers, sorted by duration ascending, no auth guard
- [ ] GET `/api/vouchers/:id` — get single voucher by ID (used by billing screen to confirm selection)

### Frontend
- [ ] `useVoucherQueries.ts` — `useVouchers()` hook (TanStack Query `useQuery` via `api.ts` wrapper)
- [ ] `voucher.store.ts` — add/confirm `setSelectedVoucher(voucher: WifiVoucher)` action and `selectedVoucher` state slice
- [ ] `VoucherListScreen` — scrollable screen with `MobileNavBar`, `StepBarHeader` (step 1), intro text, 3 `WifiVoucherCard` components, `AppFooter`; loading/error/empty states handled
- [ ] `WifiVoucherCard` component — displays SVG icon (85×77), name, bullets (device limit + duration), price, "Buy X-day voucher" pill button; `onPress` receives callback from parent
- [ ] `MobileNavBar` component — 48px nav bar with hamburger icon + dual logos (Park Holidays + Park Leisure) on dark navy background
- [ ] `StepBarHeader` component — "Buy Wi-Fi access" title + 2-step progress bar; prop `currentStep: 1 | 2`; reused by BillingFormScreen at step 2
- [ ] `AppFooter` component — dark navy footer with copyright, legal links (no-op), social icons (fb × 2, youtube × 2)
- [ ] React Navigation: register `VoucherListScreen` as the root screen of Main Stack in `RootNavigator`
- [ ] Install and configure `react-native-svg` + `react-native-svg-transformer` (update `metro.config.js` + `tsconfig.json`)

### Assets
- [x] `icon-wifi-1day.svg` — exported (SVG, confirmed) → `apps/mobile/assets/features/voucher-selection/`
- [x] `icon-wifi-4day.svg` — exported (SVG, confirmed) → same dir
- [x] `icon-wifi-7day.svg` — exported (SVG, confirmed) → same dir
- [x] `icon-menu.svg` — exported (SVG, confirmed) → same dir
- [x] `icon-facebook.svg` — exported (SVG, confirmed) → same dir
- [x] `icon-youtube.svg` — exported (SVG, confirmed) → same dir
- [ ] `logo-park-holidays.svg` — **MISSING** — export from Figma node `I2:1410;1841:84723` as SVG → same dir
- [ ] `logo-park-leisure.svg` — **MISSING** — export from Figma node `I2:1410;6169:130133` as SVG → same dir
- [ ] Verify all 8 SVG assets render correctly in Expo dev build (requires `react-native-svg` + transformer) before shipping the screen

## Feature: Billing
> Collect a user's billing address via a 6-field form and submit a mock purchase, navigating to the QR code screen on success.

### Backend
- [ ] Prisma model: `BillingAddress` (fields: `id`, `purchaseId`, `addressLine1`, `addressLine2?`, `city`, `county`, `postCode`, `country`, `createdAt`)
- [ ] Prisma model: `Purchase` (fields: `id`, `voucherId`, `status` enum `COMPLETED`, `billingAddressId?`, `createdAt`)
- [ ] POST `/api/purchases` — create Purchase (status=COMPLETED) + nested BillingAddress; return `{ id, voucherId, qrCode, status }`
- [ ] QR code generation: encode `purchaseId` (or a UUID token) as the QR payload — can use `qrcode` npm package server-side or pass raw string to mobile for client-side rendering

### Frontend
- [ ] `usePurchaseQueries.ts` — `useCreatePurchase()` mutation hook (TanStack Query `useMutation` via `api.ts`)
- [ ] `BillingFormScreen` — form with 6 fields (Address line 1, Address line 2 optional, Town/City, County, Post code, Country select); sticky `TotalBar` footer; `KeyboardAvoidingView`; inline required-field validation on submit
- [ ] `FormInput` component — reusable labeled text input with optional hint and error state (Label/sm label, TextInput, optional "Optional" hint, error message below)
- [ ] `CountrySelect` component — `TouchableOpacity` triggering a Modal/Picker with country list; displays selected value + dropdown chevron; filled state has `#03135e` border
- [ ] `TotalBar` component — sticky bottom bar showing voucher name + "Total: £X.XX" + "Confirm and pay" pill button; props: `voucherName`, `priceGBP`, `onConfirm`, `isLoading`
- [ ] React Navigation: register `BillingFormScreen` in Main Stack, after `VoucherSelectedScreen`; on success use `navigation.replace('QRCodeScreen', { purchaseId, voucherId })`
- [ ] Zustand: read `selectedVoucher` from `voucher.store.ts` in `BillingFormScreen` — no new store slice needed

### Assets
- [ ] Confirm `logo-redflag.svg`, `logo-wifiparkholidays.svg`, `icon-menu.svg`, `icon-arrow-back.svg` in `apps/mobile/assets/features/billing/` load correctly (all exported ✅)
- [ ] Consider consolidating duplicate logo/icon assets shared with `voucher-selection` into `apps/mobile/assets/shared/` to avoid duplication

## Feature: QR Code
> Display a scannable QR code and formatted voucher code after mock purchase success, with a success toast and copy/share actions.

### Backend
- [ ] Add `qrCode: String` field to `Purchase` model (unique per purchase — store the raw QR payload, e.g. `purchaseId` UUID)
- [ ] Add `voucherCode: String` field to `Purchase` model (short human-readable code, e.g. `"81353 - 42142"` — generate from purchaseId or store separately)
- [ ] POST `/api/purchases` — update response to include `{ id, voucherId, qrCode, voucherCode, status }` (qrCode and voucherCode already need to be generated at creation time)
- [ ] GET `/api/purchases/:id` — return single purchase with `qrCode`, `voucherCode`, `voucherId`, `status` (for re-fetch if needed)

### Frontend
- [ ] Install `react-native-qrcode-svg`: `pnpm add react-native-qrcode-svg` (depends on `react-native-svg` already configured in voucher-selection)
- [ ] `usePurchaseQueries.ts` — add `usePurchase(id)` hook (`useQuery` fetching GET `/api/purchases/:id`) alongside existing `useCreatePurchase()` mutation
- [ ] `QRCodeScreen` — terminal screen; receives route params `{ purchaseId, voucherId, qrCode, voucherCode, voucherName }`; renders wifi icon, voucher name, QR code (256×256 via `react-native-qrcode-svg`), voucher code text, "Copy code" + "Send code" buttons, `AppFooter`
- [ ] Toast animation — `Animated.Value` fade-out over 500 ms after 3000 ms delay; rendered as absolutely-positioned overlay
- [ ] "Copy code" handler — `Clipboard.setStringAsync(voucherCode)` + temporary "Copied!" button label feedback (1.5 s timeout)
- [ ] "Send code" handler — `Share.share({ message: voucherCode })` native share sheet
- [ ] React Navigation: register `QRCodeScreen` in Main Stack; `BillingFormScreen` uses `navigation.replace('QRCodeScreen', params)` on success; disable swipe-back gesture (`gestureEnabled: false`)

### Assets
- [x] `icon-wifi.svg` — exported (SVG, 56×56, confirmed) → `apps/mobile/assets/features/qr-code/`
- [x] `icon-copy.svg` — exported (SVG, 24×24, confirmed) → `apps/mobile/assets/features/qr-code/`
- [ ] Reuse `logo-park-holidays.svg`, `logo-park-leisure.svg`, `icon-menu.svg`, `icon-facebook.svg`, `icon-youtube.svg` from `apps/mobile/assets/features/voucher-selection/` (or move to `apps/mobile/assets/shared/`)

## Feature: Error
> Display a generic, stateless error screen with a "Try again" CTA (returns to BillingFormScreen) and a support phone link when purchase creation fails.

### Backend
- No backend work required — this is a purely presentational screen triggered by a failed API call in BillingFormScreen.

### Frontend
- [ ] `GeneralErrorScreen` — renders triangle icon, error heading + body (static copy), "Try again" pill button (`navigation.goBack()`), support copy + phone `Link` row, `MobileNavBar`, `AppFooter`
- [ ] `PhoneLink` inline component — `View` row with phone SVG icon + underlined `Text`; taps `Linking.openURL('tel:...')` — small enough to keep inline in screen, no separate component file needed
- [ ] React Navigation: register `GeneralErrorScreen` in Main Stack; `BillingFormScreen` calls `navigation.navigate('GeneralError')` inside `useMutation` `onError` callback
- [ ] Confirm `MobileNavBar` and `AppFooter` shared components are already implemented (voucher-selection + qr-code features) before building this screen

### Assets
- [x] `icon-triangle-exclamation.svg` — exported (SVG, 48×48, confirmed) → `apps/mobile/assets/features/error/`
- [x] `icon-fb.svg` — exported (SVG, 24×24, confirmed) → `apps/mobile/assets/features/error/`
- [x] `icon-youtube.svg` — exported (SVG, 24×24, confirmed) → `apps/mobile/assets/features/error/`
- [ ] Consider consolidating `icon-fb.svg`, `icon-youtube.svg` (duplicated across features) into `apps/mobile/assets/shared/`
- [ ] Replace placeholder phone number `12345 1245 1224` with real Wi-Fi Park Holidays support number before release

## Feature: Web Support
> Enable the Expo mobile app to run in a desktop browser with a centred 480 px mobile-width layout using react-native-web.

### Backend
- No backend work required — the NestJS API is browser-agnostic and requires no changes.

### Frontend
- [ ] Install web deps in `apps/mobile`: `npx expo install react-native-web react-dom @expo/metro-config`
- [ ] Create `apps/mobile/metro.config.js` — enable SVG transformer for web alongside native (see flow spec for exact content)
- [ ] Add `"web": "expo start --web"` script to `apps/mobile/package.json`
- [ ] Update `apps/mobile/app.json` — add/extend `"web"` key with `favicon`, `name`, `backgroundColor: "#03135e"`, `themeColor: "#03135e"`
- [ ] `RootNavigator.tsx` — wrap `NavigationContainer` in a centred `View` with `maxWidth: 480` on web; navy `#03135e` side gutters; detect via `useWindowDimensions` width > 520
- [ ] `VoucherListScreen.tsx` — remove `overScrollMode="never"` prop from `ScrollView` (Android-only, logs warning on web)
- [ ] Audit `expo-secure-store` usage: `grep -r "expo-secure-store" apps/mobile/src/` — if found, replace with `Platform.OS === 'web'` conditional using `localStorage`; if not found, no action needed
- [ ] Verify `react-navigation` hash routing works on web (default behaviour — no extra config needed)
- [ ] Verify `react-native-paper`, `react-native-svg`, `react-native-qrcode-svg` all render correctly in browser (`expo start --web`)

### Assets
- No new assets required — all existing assets are already SVG/PNG compatible with the web bundler.
