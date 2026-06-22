# Feature Task List

> Managed by the pipeline orchestrator. Mark [x] when a feature is merged.
> Order reflects implementation dependency — later features may depend on earlier ones.
> Derived from: Wi-Fi Park Holidays App (Figma file W37yVPZEuwtY0UWMyiyFwL).

## Backlog

- [x] `voucher-selection` — Browse and select a Wi-Fi package from the list (depends on: nothing)
- [ ] `billing` — Enter billing/address details before mock payment (depends on: voucher-selection)
- [ ] `qr-code` — Display QR code after mock payment success (depends on: billing)
- [ ] `error` — Generic error screen with retry CTA (depends on: nothing)

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
