# Feature Flow: QR Code

**Figma Nodes:** 2:1481 (with toast — initial state), 2:1512 (settled state — no toast)
**Last Updated:** 2026-06-23

---

## Overview

After a mock payment succeeds, the user lands on a single terminal screen showing a scannable QR code for their Wi-Fi voucher. A green success toast auto-dismisses on arrival. The user can either scan the QR code or copy/send their numeric voucher code manually to connect additional devices. There is no back navigation — this is the end of the purchase flow.

---

## Screens

### QRCodeScreen (`qr-code/QRCodeScreen`)

**Figma Nodes:** `2:1481` (with toast), `2:1512` (settled/no toast)  
**Navigator:** Main Stack  
**Entry point:** `navigation.replace('QRCodeScreen', { purchaseId, voucherId, qrCode, voucherCode })` from `BillingFormScreen` on successful POST `/api/purchases`  
**Exit points:** None explicit in the design — the hamburger menu in the nav bar is present but inert in prototype scope

---

**Layout (root → leaf):**

```
SafeAreaView (flex: 1, backgroundColor: #03135E, edges: ['top'])
  └── StatusBar (barStyle: "light-content")
  └── MobileNavBar (height: 48, backgroundColor: #03135E, borderRadius: "32 32 0 0")
      ├── Left: hamburger icon (24×24) + gap:12 + ParkHolidays logo (73×15) + divider + ParkLeisure logo (100×33)
      └── Right: empty (88px placeholder — no cart/bell on this screen)
  └── ScrollView (flex: 1, backgroundColor: #03135E)
      └── Container (paddingHorizontal: 16, paddingTop: 28, paddingBottom: 28, gap: 48)
          ├── Section header
          │     └── Text "Connect more devices"
          │           style: Heading/H4 (Inter 24/28 SemiBold), color: #FFFFFF, fill: horizontal
          └── VoucherCard (white card)
                backgroundColor: #FFFFFF, borderRadius: 12, padding: 24, gap: 16
                alignItems: center, width: 343
                ├── Content block (column, gap: 12, fill width)
                │     ├── WifiIcon (SVG, 56×56)
                │     └── Text "Your 1-day voucher code"
                │           style: Heading/H5 (Inter 20/24 SemiBold), color: #020D42
                ├── Text "Scan the QR code with the device you'd like to connect."
                │     style: Heading/H4 (Inter 24/28 SemiBold), color: #020D42, fill width
                ├── QRCode component (256×256)
                │     renders qrCode value from route params using react-native-qrcode-svg
                ├── Text "You can also connect using your voucher code."
                │     style: Heading/H5 (Inter 20/24 SemiBold), color: #020D42, fill width
                ├── Text "{voucherCode}" — e.g. "81353 - 42142"
                │     style: Heading/H4 (Inter 24/28 SemiBold), color: #020D42, fill width
                ├── Button "Copy code" (Outline variant)
                │     fill: none, stroke: #03135E 1px, borderRadius: 9999
                │     padding: 12 24, gap: 8, fill width
                │     left icon: copy SVG (24×24), label color: #020D42, Label/md
                └── Button "Send code" (Fill variant)
                      backgroundColor: #03135E, borderRadius: 9999
                      padding: 12 24, fill width
                      label: "Send code", color: #FFFFFF, Label/md
  └── AppFooter
        backgroundColor: #03135E, padding: "24 48", gap: 32, height: 182
        ├── Links column (gap: 12)
        │     ├── Text "2026 Park Holidays Limited" — Label/sm (Inter 14/18 SemiBold), color: #FFFFFF
        │     ├── Link "Terms & conditions" — Label/sm, color: #FFFFFF (no-op in prototype)
        │     └── Link "Privacy" — Label/sm, color: #FFFFFF (no-op in prototype)
        └── Social icons row (gap: 6, justifyContent: flex-end)
              FB icon × 2, YouTube icon × 2 (each 24×24)

  *** Toast overlay (initial state only — visible ~3 s then fades out) ***
  Absolutely positioned at top of screen (y ≈ 37, x: 10, width: 355)
  backgroundColor: #037C08, borderRadius: 4, padding: 16
  Text "Your Wi-Fi code is active on your device"
       style: Label/md (Inter 16/20 SemiBold), color: #FFFFFF
```

---

**Components used:**

| Component | Description | Props |
|---|---|---|
| `MobileNavBar` | Top nav bar — shared with all screens | (reused from voucher-selection) |
| `AppFooter` | Dark-navy footer with links and social icons | (reused from voucher-selection) |
| `QRCode` | QR code renderer (react-native-qrcode-svg) | `value: string`, `size: number` |
| `Toast` (local animated overlay) | Success banner, fades out after ~3 s | `message: string`, `visible: boolean` |
| Outline `Button` | "Copy code" — pill-shaped with left icon | `label`, `onPress`, `leftIcon` |
| Fill `Button` | "Send code" — filled navy pill | `label`, `onPress` |

---

**States:**

| State | Behaviour |
|---|---|
| **Initial (with toast)** | Screen mounts; Toast visible at top, fades after ~3 s via `Animated.timing` → opacity 0 |
| **Settled** | Toast gone; QR code and buttons fully visible |
| **Loading (edge case)** | If screen receives purchaseId but must fetch qrCode from API, show skeleton over QR area (256×256 grey rect) and disable buttons |
| **Error (edge case)** | If qrCode is undefined/null (navigation params missing), show inline error message with a "Go back" button — unlikely in happy path |

---

**Interactions:**

| Element | Action | Outcome |
|---|---|---|
| Toast | Auto-dismiss on mount | `Animated.timing` fade-out after 3000 ms; `useEffect` on mount |
| "Copy code" button | `onPress` | Call `Clipboard.setStringAsync(voucherCode)` (Expo Clipboard); show brief feedback (button label briefly changes to "Copied!" for 1.5 s) |
| "Send code" button | `onPress` | Call `Share.share({ message: voucherCode })` (React Native Share API) — opens native share sheet |
| Hamburger menu icon | `onPress` | No-op in prototype scope |
| "Terms & conditions" link | `onPress` | No-op in prototype scope |
| "Privacy" link | `onPress` | No-op in prototype scope |

---

**Data displayed:**

| Field | Source | Example |
|---|---|---|
| `qrCode` | Route param from BillingFormScreen (returned by POST `/api/purchases`) | UUID or opaque string |
| `voucherCode` | Route param from BillingFormScreen (returned by POST `/api/purchases`) | `"81353 - 42142"` |
| Voucher name label | Route param `voucherName` or read from `voucher.store.ts` | `"Your 1-day voucher code"` |

> **QR encoding:** The design shows a standard QR code. The `qrCode` field returned by the API is the raw string encoded into the QR code. The exact format (UUID, URL, opaque token) is decided by the backend — the mobile screen renders whatever string it receives. For prototype purposes, encoding the `purchaseId` UUID is sufficient.

> **Voucher code text:** The formatted numeric code (e.g., "81353 - 42142") is a separate `voucherCode` field — shorter and more human-readable than the QR payload. This may be derived from the `purchaseId` on the backend (e.g., last 10 hex chars formatted as `XXXXX - XXXXX`) or stored as a separate column on `Purchase`.

---

**Accessibility:**

- `MobileNavBar` hamburger: `accessibilityLabel="Menu"`, `accessibilityRole="button"`
- QR code container: `accessibilityLabel="QR code for your Wi-Fi voucher"`, `accessibilityRole="image"`
- Voucher code Text: `accessibilityLabel="Voucher code: {voucherCode}"` (so screen reader reads digits clearly)
- "Copy code" button: `accessibilityLabel="Copy voucher code to clipboard"`, `accessibilityRole="button"`
- "Send code" button: `accessibilityLabel="Share voucher code"`, `accessibilityRole="button"`
- Toast: `accessibilityLiveRegion="polite"` — screen reader announces text when it appears
- Minimum touch target: 44×44 pt for all interactive elements

---

**Mobile-specific notes:**

- **Safe area:** `<SafeAreaView edges={['top']}>` — nav bar is inside the safe area; footer can extend to bottom (no bottom safe area edge needed since footer has its own padding)
- **Status bar:** `<StatusBar barStyle="light-content" />` — white icons on dark navy background
- **Scroll:** `<ScrollView bounces={true}>` on iOS; `overScrollMode="never"` on Android
- **No keyboard:** no text inputs on this screen — `KeyboardAvoidingView` not needed
- **Toast animation:** use `Animated.Value` starting at 1, animate to 0 with `Animated.timing` after 3000 ms delay; wrap toast in `<Animated.View style={{ opacity: fadeAnim }}>` with `pointerEvents="none"` after fade
- **QR library:** `react-native-qrcode-svg` (renders via `react-native-svg`); install if not already present:
  ```bash
  pnpm add react-native-qrcode-svg
  ```
  Usage:
  ```tsx
  import QRCode from 'react-native-qrcode-svg'
  <QRCode value={qrCode} size={256} />
  ```
- **Clipboard:** Use `expo-clipboard` (included in Expo managed):
  ```tsx
  import * as Clipboard from 'expo-clipboard'
  await Clipboard.setStringAsync(voucherCode)
  ```

---

## Navigation Flow

```
BillingFormScreen
  → [POST /api/purchases success]
    navigation.replace('QRCodeScreen', {
      purchaseId: string,
      voucherId: string,
      qrCode: string,       // raw QR payload
      voucherCode: string,  // formatted display code e.g. "81353 - 42142"
      voucherName: string,  // e.g. "1-day voucher"
    })

QRCodeScreen
  → (no forward navigation — terminal screen)
  → Hamburger menu (no-op in prototype)
```

No back navigation is available — the screen replaces the stack so pressing the hardware back button (Android) takes the user back to the start of the purchase flow or exits the app, which is acceptable for prototype scope. Consider `navigationOptions: { gestureEnabled: false }` to prevent accidental swipe-back.

---

## Component Inventory

| Component Name | Props | States | Reused In |
|---|---|---|---|
| `MobileNavBar` | — | default | VoucherListScreen, VoucherSelectedScreen, BillingFormScreen, QRCodeScreen |
| `AppFooter` | — | default | VoucherListScreen, VoucherSelectedScreen, BillingFormScreen, QRCodeScreen |
| `QRCode` (react-native-qrcode-svg) | `value: string`, `size: number`, `color?: string`, `backgroundColor?: string` | default | QRCodeScreen |
| Outline `Button` | `label: string`, `onPress: () => void`, `leftIcon?: ReactNode`, `disabled?: boolean` | default, pressed, disabled | BillingFormScreen, QRCodeScreen |
| Fill `Button` | `label: string`, `onPress: () => void`, `loading?: boolean` | default, pressed, loading | BillingFormScreen, QRCodeScreen |
| `Toast` (local) | `message: string`, `visible: boolean`, `onDismiss?: () => void` | visible, dismissing | QRCodeScreen |

---

## API Interactions

| Action | Method | Endpoint | Notes |
|---|---|---|---|
| Fetch purchase details (optional) | GET | `/api/purchases/:id` | Only needed if QR data is not passed via route params. Prefer passing via params to avoid an extra round-trip. |

> The primary API call (POST `/api/purchases`) is made in `BillingFormScreen` and its response data is forwarded to `QRCodeScreen` via navigation params — no API call needed on this screen in the happy path.

---

## Design Tokens Used

| Token | Value | Used For |
|---|---|---|
| `Color/background/brand/primary` | `#03135E` | Screen background, nav bar, fill button, footer |
| `Color/background/neutral/primary` | `#FFFFFF` | Voucher card background |
| `Color/background/system/success/primary` | `#037C08` | Toast background |
| `Color/foreground/neutral/primary` | `#020D42` | Card text (headings, voucher code) |
| `Color/foreground/neutral/primary-inverse` | `#FFFFFF` | Screen heading, nav text, fill button label, footer text |
| `Color/stroke/brand/primary` | `#03135E` | Outline button border |
| `Heading/H4` | Inter 24/28 SemiBold | "Connect more devices", instructional text, voucher code |
| `Heading/H5` | Inter 20/24 SemiBold | Voucher name, fallback code label |
| `Label/md` | Inter 16/20 SemiBold | Button labels, toast text |
| `Label/sm` | Inter 14/18 SemiBold | Footer links and copyright |
| `Rounding/btn-rounding` | 9999 (pill) | Both action buttons |
| `Rounding/radius-card` | 12 | Voucher card |
| `Spacing/gap-md` | 24 | Card padding |
| `Spacing/gap-lg` | 28 | Container top/bottom padding |
| `Spacing/gap-xl` | 32 | Container section gap |

---

## Assets

| Asset | Type | Saved Path | Used In | RN Usage |
|---|---|---|---|---|
| Wi-Fi icon | SVG | `apps/mobile/assets/features/qr-code/icon-wifi.svg` | QRCodeScreen card header | `import WifiIcon from '...' ; <WifiIcon width={56} height={56} />` |
| Copy icon | SVG | `apps/mobile/assets/features/qr-code/icon-copy.svg` | "Copy code" button left icon | `import CopyIcon from '...' ; <CopyIcon width={24} height={24} />` |
| QR code placeholder | PNG | `apps/mobile/assets/features/qr-code/qr-code-placeholder.png` | Design reference only — **not used at runtime** (real QR rendered by react-native-qrcode-svg) | — |

> Nav bar logos (`logo-park-holidays.svg`, `logo-park-leisure.svg`, `icon-menu.svg`) and footer social icons (`icon-facebook.svg`, `icon-youtube.svg`) should be sourced from `apps/mobile/assets/features/voucher-selection/` or moved to a shared assets directory — do not duplicate.

**SVG note:** `react-native-svg` and `react-native-svg-transformer` must be installed and configured in `metro.config.js` and `tsconfig.json` before using SVG imports. This is tracked in the Voucher Selection feature tasks — confirm it is done before implementing this screen.

`react-native-qrcode-svg` also requires `react-native-svg` as a peer dependency — install it separately:
```bash
pnpm add react-native-qrcode-svg
```

**Missing assets:** none — all required assets exported successfully.

---

## Business Rules

- The QR code is generated by the backend at purchase creation time (POST `/api/purchases` response includes `qrCode` field)
- The QR code is valid immediately upon display — no activation step
- The `qrCode` field encodes a unique string per purchase (e.g., `purchaseId` UUID or a generated token)
- The `voucherCode` is a shorter, formatted human-readable code (e.g., `"81353 - 42142"`) also returned by the API — it is displayed as plain text below the QR code as a fallback connection method
- Each purchase has exactly one QR code; multiple purchases = multiple QR codes
- This screen is a terminal screen — no further purchase flow steps exist after it

---

## Acceptance Criteria

- [ ] QR code renders correctly at 256×256 and is scannable with a camera
- [ ] Toast banner appears immediately on screen mount with text "Your Wi-Fi code is active on your device" and auto-dismisses after ~3 seconds
- [ ] Toast uses green background (#037C08) and white text
- [ ] Voucher name label matches the purchased package (e.g., "Your 1-day voucher code")
- [ ] Voucher code text (e.g., "81353 - 42142") is displayed below the QR code
- [ ] "Copy code" button copies the voucher code string to clipboard and provides brief "Copied!" feedback
- [ ] "Send code" button opens the native share sheet with the voucher code
- [ ] Screen has no back navigation (nav.replace used, not nav.push); Android hardware back is disabled or returns to start of flow
- [ ] Footer renders with "2026 Park Holidays Limited", legal links, and social icons

---

## Open Questions (Resolved)

1. ~~What data is encoded in the QR code?~~ → A unique string per purchase (purchaseId UUID or derived token) returned by the API. The `voucherCode` ("81353 - 42142" style) is a separate shorter field for manual entry.
2. ~~Does QR need to work offline?~~ → Yes — the QR data is passed via navigation params and rendered client-side by `react-native-qrcode-svg`. No network call required on this screen.
3. ~~What are the exact button labels?~~ → **"Copy code"** (outline, with copy icon) and **"Send code"** (filled navy).
4. ~~What is the toast message text?~~ → **"Your Wi-Fi code is active on your device"**
