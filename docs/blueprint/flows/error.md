# Feature Flow: Error

**Figma Nodes:** 2:1411
**Last Updated:** 2026-06-23

---

## Overview

A generic, stateless error screen shown when something goes wrong during the purchase flow (e.g. a network failure or server error while creating a purchase). The user sees a clear error message, a "Try again" CTA that returns them to the billing form, and a support phone number as a fallback.

---

## Screens

### GeneralErrorScreen (`error/GeneralErrorScreen`)

**Screenshot:** `docs/blueprint/screenshots/error/GeneralErrorScreen.png`

**Node ID:** `2:1411`
**Navigator:** Main Stack
**Entry point:** Navigated to from `BillingFormScreen` on any unhandled purchase-creation error
**Exit points:**
- "Try again" → `BillingFormScreen` (pop or goBack)
- Phone link → `Linking.openURL('tel:...')` (external)

---

**Layout:**

```
SafeAreaView (flex: 1, background: #ffffff)
└── View (flex: 1, flexDirection: column)
    ├── MobileNavBar                         — 48px, background #03135e, borderRadius: {topLeft:0, topRight:0, bottomLeft:32, bottomRight:32} [top overlay]
    │   ├── (left) View row, gap: 12
    │   │   ├── menu icon (24×24 SVG)
    │   │   ├── white_redflag logo (73.5×14.7 SVG)
    │   │   ├── vertical divider (1px, #8189AF, height: 30)
    │   │   └── Park Leisure logo (100×33 SVG)
    │   └── (right) View, width: 88 — (cart + bell icons, not rendered in error state)
    │
    ├── ScrollView (flex: 1)
    │   └── View (background: #EDF8FE, padding: 28 16, gap: 48, minHeight: fill)
    │       │
    │       ├── [Error messaging] View (flexDirection: column, gap: 32, alignSelf: stretch)
    │       │   ├── icon-triangle-exclamation.svg  — 48×48
    │       │   ├── Text "We couldn't complete your Wi-Fi voucher purchase"
    │       │   │       fontFamily: Inter, fontSize: 28, fontWeight: 400, lineHeight: 32,
    │       │   │       color: #020D42, width: 275 (fixed), textAlign: left
    │       │   ├── Text "Something went wrong while processing your request.\n
    │       │   │        Your Wi-Fi voucher has not been issued yet. Please try again,
    │       │   │        or contact support if the problem continues."
    │       │   │       fontFamily: Inter, fontSize: 18, fontWeight: 400, lineHeight: 24,
    │       │   │       color: #020D42, alignSelf: stretch
    │       │   └── PrimaryButton "Try again"
    │       │           alignSelf: stretch, padding: 12 24, background: #03135E,
    │       │           borderRadius: 9999, Label/md white text (16px semibold)
    │       │
    │       └── [Contact support] View (flexDirection: column, gap: 16, alignSelf: stretch)
    │           ├── Text "If you were charged or are unsure, please contact support
    │           │        before trying again.\nContact us on:"
    │           │       fontSize: 16, fontWeight: 400, lineHeight: 20, color: #020D42
    │           └── PhoneLink — View row, gap: 2
    │               ├── phone icon (20×20 SVG)
    │               └── View column, gap: 2
    │                   ├── Text "12345 1245 1224"  — Label/md (16px semibold, #020D42)
    │                   └── View "Underline"        — height: 0, borderBottom: 2px #8189AF
    │
    └── AppFooter (background: #03135E, padding: 24 48, gap: 32, height: 182)
        ├── View column, gap: 12
        │   ├── Text "2026 Park Holidays Limited"  — Label/sm, #ffffff
        │   ├── Link "Terms & conditions"          — Label/sm, #ffffff, no-op
        │   └── Link "Privacy"                     — Label/sm, #ffffff, no-op
        └── View row, justifyContent: flex-end, gap: 6
            ├── icon-fb.svg   (24×24)
            ├── icon-youtube.svg (24×24)
            ├── icon-fb.svg   (24×24)
            └── icon-youtube.svg (24×24)
```

---

**Exact copy (confirmed from Figma):**

| Element | Text |
|---|---|
| Error heading | "We couldn't complete your Wi-Fi voucher purchase" |
| Error body | "Something went wrong while processing your request. \nYour Wi-Fi voucher has not been issued yet. Please try again, or contact support if the problem continues." |
| CTA button label | "Try again" |
| Support preamble | "If you were charged or are unsure, please contact support before trying again. \nContact us on:" |
| Support phone | "12345 1245 1224" *(placeholder — replace with real number before release)* |

---

**Components used:**

| Component | Source | Props / Notes |
|---|---|---|
| `MobileNavBar` | Shared — defined in `voucher-selection` | Reused as-is |
| `AppFooter` | Shared — defined in `voucher-selection` | Reused as-is |
| `PrimaryButton` | Shared — defined in `billing` | `label="Try again"`, `onPress` navigates back |
| `PhoneLink` (inline or new) | New (simple inline View) | Phone icon + underlined text + `Linking.openURL` |

> `PhoneLink` is small enough to implement inline in the screen rather than as a standalone component.

---

**States:**

This screen has a single state — it IS the error state. There are no loading, empty, or success variants.

- **Default:** render as shown above with static copy
- No skeleton/loading state required
- No empty state
- No success state (the screen itself is a terminal error stop)

---

**Interactions:**

| Trigger | Action |
|---|---|
| Tap "Try again" | `navigation.goBack()` — returns user to `BillingFormScreen` (their previously entered data is preserved in form state / Zustand) |
| Tap phone number link | `Linking.openURL('tel:123451245224')` — opens native phone dialler |
| Tap "Terms & conditions" | No-op in prototype (link renders but does nothing) |
| Tap "Privacy" | No-op in prototype |
| Tap social icons | No-op in prototype |

---

**Accessibility:**

- Triangle icon: `accessibilityRole="image"`, `accessibilityLabel="Error icon"`
- "Try again" button: `accessibilityRole="button"`, `accessibilityLabel="Try again"`
- Phone link: `accessibilityRole="link"`, `accessibilityLabel="Call support on 12345 1245 1224"`
- Minimum touch target: 44×44 pt for all interactive elements (phone link row may need padding to meet this)
- Status bar: **light** (white icons on dark nav bar)
- Screen reader: announce heading first — consider `accessibilityLiveRegion="polite"` on the error heading if the screen is pushed mid-flow

---

**Mobile-specific notes:**

- Wrap root in `<SafeAreaView>` — status bar style: **light-content**
- Nav bar sits at y=0 and is `position: absolute` (or stacked at the top of the column) — it overlaps the content area slightly due to border radius; use `paddingTop` to account for this
- `ScrollView` for the content area so long error messages remain scrollable on small devices (iPhone SE etc.)
- No `KeyboardAvoidingView` needed — no inputs on this screen
- Footer social icons: `overScrollMode="never"` on Android

---

## Component Inventory

| Component Name | Props | States | Reused In |
|---|---|---|---|
| `MobileNavBar` | *(no props — static in prototype)* | default | VoucherListScreen, VoucherSelectedScreen, BillingFormScreen, QRCodeScreen, GeneralErrorScreen |
| `AppFooter` | *(no props — static in prototype)* | default | VoucherListScreen, BillingFormScreen, QRCodeScreen, GeneralErrorScreen |
| `PrimaryButton` | `label: string`, `onPress: () => void`, `disabled?: boolean`, `loading?: boolean` | default, pressed, disabled, loading | BillingFormScreen, GeneralErrorScreen |

---

## Navigation Flow

```
BillingFormScreen
  → [useMutation onError] → GeneralErrorScreen     (push onto stack)

GeneralErrorScreen
  → [Tap "Try again"] → BillingFormScreen           (navigation.goBack())
  → [Tap phone link]  → native phone dialler (Linking.openURL)
```

> **Note:** The screen is pushed (`navigation.navigate('GeneralError')`), not replaced, so `goBack()` returns to the billing form with all previously entered field values still populated (managed by local form state or Zustand).

---

## API Interactions

None — this screen makes no API calls. It is a passive display screen triggered by a failed API call in `BillingFormScreen`.

---

## Design Tokens Used

| Token | Value | Used For |
|---|---|---|
| `Color/background/neutral/quaternary` | #EDF8FE | Content area background |
| `Color/background/brand/primary` | #03135E | Nav bar, CTA button, footer |
| `Color/foreground/neutral/primary` | #020D42 | Error heading, body copy, phone label |
| `Color/foreground/neutral/primary-inverse` | #ffffff | Button label, footer text |
| `Color/stroke/neutral/secondary` | #8189AF | Phone link underline, nav divider |
| `Heading/H3` | Inter 28/32, weight 400 | Error heading |
| `Paragraph/lg` | Inter 18/24, weight 400 | Error body |
| `Paragraph/md` | Inter 16/20, weight 400 | Support copy |
| `Label/md` | Inter 16/20, weight 600 | CTA button label, phone link |
| `Label/sm` | Inter 14/18, weight 600 | Footer links, copyright |
| `Rounding/btn-rounding` | 9999 | CTA button border radius |

---

## Assets

| Asset | Type | Saved Path | Used In | RN Usage |
|---|---|---|---|---|
| Triangle exclamation icon | SVG | `apps/mobile/assets/features/error/icon-triangle-exclamation.svg` | GeneralErrorScreen | `import TriangleIcon from '...'; <TriangleIcon width={48} height={48} />` |
| Facebook icon | SVG | `apps/mobile/assets/features/error/icon-fb.svg` | GeneralErrorScreen (footer) | `import FbIcon from '...'; <FbIcon width={24} height={24} />` |
| YouTube icon | SVG | `apps/mobile/assets/features/error/icon-youtube.svg` | GeneralErrorScreen (footer) | `import YtIcon from '...'; <YtIcon width={24} height={24} />` |

> **Shared asset note:** `icon-fb.svg` and `icon-youtube.svg` are also used in the footer of other screens (`voucher-selection`, `qr-code`). Consider moving all footer icons to `apps/mobile/assets/shared/` to avoid duplication.

**SVG note:** The implementation agent must verify that `react-native-svg` and `react-native-svg-transformer` are installed and configured in `metro.config.js` and `tsconfig.json` before importing these SVG files as components. This was already flagged in the `voucher-selection` feature — confirm it is done before implementing this screen.

**Missing assets** (export failed or 0 bytes): none

---

## Business Rules

- This screen is shown for **any** unrecoverable error during purchase creation (there is only one generic copy — no per-error-type variations)
- "Try again" always returns to `BillingFormScreen` via `navigation.goBack()`; previously entered form data is preserved (managed in local component state or Zustand — not cleared on error)
- The support phone number is a placeholder (`12345 1245 1224`) — must be replaced with the real Wi-Fi Park Holidays support number before production
- Footer links (Terms & conditions, Privacy) are no-ops in the prototype
- The screen has no back arrow / explicit back navigation in the nav bar — the only exit is the "Try again" CTA

---

## Acceptance Criteria

- [ ] Error screen renders with triangle icon, heading, body copy, and "Try again" button
- [ ] Exact copy matches Figma (heading + body + support preamble confirmed above)
- [ ] "Try again" taps `navigation.goBack()` and lands on `BillingFormScreen` with form data intact
- [ ] Phone link opens native dialler via `Linking.openURL('tel:...')`
- [ ] Screen is reachable from `BillingFormScreen` on `useMutation` `onError`
- [ ] `MobileNavBar` and `AppFooter` render identically to other screens
- [ ] Status bar is light-content (white icons)
- [ ] Minimum 44×44 pt touch target on "Try again" and phone link

---

## Open Questions — Resolved

| # | Question | Resolution |
|---|---|---|
| 1 | What is the exact error heading? | **"We couldn't complete your Wi-Fi voucher purchase"** (confirmed from Figma) |
| 2 | What is the exact error body? | **"Something went wrong while processing your request. \nYour Wi-Fi voucher has not been issued yet. Please try again, or contact support if the problem continues."** |
| 3 | Where does the support link point (email, phone, web)? | **Phone number** — `12345 1245 1224` (placeholder, must be updated) |
| 4 | Should "Try again" go to BillingFormScreen or VoucherListScreen? | **BillingFormScreen** — `navigation.goBack()` (stack push pattern, not replace) |
| 5 | Are there different messages for different error types? | **No** — single generic copy for all errors |
| 6 | Is form data preserved on retry? | **Yes** — form state is not cleared; `goBack()` returns to existing screen instance |
