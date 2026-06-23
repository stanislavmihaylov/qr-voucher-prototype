# Feature Flow: Billing

**Figma Nodes:** 2:1457
**Feature Slug:** `billing`
**Navigator:** Main Stack
**Last Updated:** 2026-06-22

---

## Overview

The user fills in their billing/address details before completing a mock purchase. Payment processing is out of scope for this prototype — tapping "Confirm and pay" skips the payment provider and directly creates the purchase + billing address record in the database.

**Screenshot:** `docs/blueprint/screenshots/billing/BillingFormScreen.png` (750×2040 px @2×)

---

## Screens

### BillingFormScreen (`billing/BillingFormScreen`)

**Node ID:** `2:1457`
**Navigator:** Main Stack
**Entry point:** Tap "Buy Now" / "Buy X-day voucher" on VoucherSelectedScreen
**Exit points:**
- → QRCodeScreen (on successful POST /api/purchases)
- → GeneralErrorScreen (on network/server error)

---

### Layout

The screen is a column of four layers rendered at 375 px width:

```
┌──────────────────────────────────────┐
│  MobileNavBar (48px, navy, y=0)      │  ← overlaid at top, borderRadius: "32px 32px 0px 0px"
├──────────────────────────────────────┤
│  Form header (navy, desktop-width    │  ← Header/Form/Desktop — 1440px wide component,
│  component clipped to 375px)         │     padding 16px 48px in Figma, override to 16px on mobile
│    "Back to verify booking" link     │
│    "Wi Fi voucher booking" H3        │
│    StepBar: [✓ Select package] ──── [2 Payment]  │
├──────────────────────────────────────┤
│  "Conteiner" (scroll area, #EDF8FE)  │  ← padding: 28px 16px, gap: 48px between sections
│    "User address" Label/lg heading   │
│    ┌──────────────────────────────┐  │
│    │ 6 stacked input fields       │  │  ← gap: 29px between fields (confirmed), section gap: 24px
│    │ 1. Address line 1 (required) │  │
│    │ 2. Address line 2 (optional) │  │
│    │ 3. Town/City (required)      │  │
│    │ 4. County (required)         │  │
│    │ 5. Post code (required)      │  │
│    │ 6. Country (select, filled)  │  │
│    └──────────────────────────────┘  │
├──────────────────────────────────────┤
│  Total bar (y=904, white, sticky)    │  ← padding: 16px, gap: 12px, borderTopWidth: 1
│    Voucher name | Total: £X.XX | [Confirm and pay] │
└──────────────────────────────────────┘
```

**Root:**
- `SafeAreaView`, flex: 1, backgroundColor: `#EDF8FE`
- Status bar style: **light** (white icons on dark navy nav bar)

---

### MobileNavBar (top, 48 px — confirmed from Figma)

Component: `Main Navigation/Mobile/Default` (componentId: `0:1892`)

- `View`, flexDirection: row, padding: `0px 16px`, justifyContent: space-between, alignItems: center
- dimensions: 375×48 px
- backgroundColor: `#03135e`
- borderRadius: `32px 32px 0px 0px` — **top corners rounded 32 px, bottom corners square**
- locationRelativeToParent: `{x: 0, y: 0}` — overlaid at the top of the screen

Left group (gap: 12px):
- Hamburger icon: `icon-menu.svg` 24×24 (componentId: `0:1456`)
- Logo container (gap: 8px, alignItems: center):
  - Park Holidays red-flag logo: `logo-redflag.svg` in a 75×24 frame, borderRadius: 8px — actual SVG is 73.48×14.67 px
  - Vertical divider line: `height: 30, width: 0`, stroke `#8189AF`, strokeWeight: 1px
  - Wi-Fi Park Holidays wordmark: `logo-wifiparkholidays.svg` 100×33, borderRadius: 8px (componentId: `0:1516`)

Right group: **empty** (width: 88px, no icons — confirmed from Figma). No cart or bell on this screen.

---

### Form Header (below nav bar, scrolls with content — confirmed from Figma)

Component: `Header/Form/Desktop` (componentId: `0:306`)

> **Mobile note:** This is a 1440 px-wide desktop component with `padding: 16px 48px`. On mobile (375 px) you must override horizontal padding to `16px` and constrain width to `100%`.

- backgroundColor: `#03135e`
- paddingHorizontal: 16 (mobile override — desktop spec is 48px)
- Two-column layout clipped into single column on mobile:

**Back link row** (Link component, componentId: `0:192`, Type=Inverted):
- flexDirection: row, alignItems: center, gap: 6px
- `icon-arrow-back.svg` 20×20 (componentId: `0:27`, white / transparent fill)
- Text: `"Back to verify booking"` — style: Label/md (16px, 600), color: `#ffffff`

**Title + StepBar row** (flexDirection: row, justifyContent: space-between, flexWrap: wrap, gap: 12px):
- Text: `"Wi Fi voucher booking"` — style: Heading/H3 (28px/400), color: `#ffffff`
  > Note: Figma text omits the hyphen; use brand-correct `"Wi-Fi voucher booking"` in implementation.
- **StepBar** (componentId: `0:278`, `Property 1=3 Steps`):
  - flexDirection: row, alignItems: center, gap: 16px
  - Step 1 — `Step Item` State=Past (componentId: `0:261`): circular badge, fill `#ffffff`, contains `check` icon (componentId: `0:254`), label text: `"Select package"`, Paragraph/md, color `#ffffff`
  - Connector line: width 37px, height 0, stroke `#8189AF`, strokeWeight 1px
  - Step 2 — `Step Item` State=Current (componentId: `0:259`): circular badge, fill `#ffffff`, text `"2"`, Label/lg, color `#020d42`, label text: `"Payment"`, Paragraph/md, color `#ffffff`

---

### Form area (ScrollView — confirmed from Figma)

Component: `Conteiner` (sic) (componentId: `0:326`, `Property 1=Base container, Property 2=375`)

- backgroundColor: `#EDF8FE`
- padding: 28px top/bottom, 16px left/right
- gap: 48px between sections (only one section on this screen)
- alignSelf: stretch, sizing: fill horizontal

**Section: "User address"**
- Inner column: gap 24px (between heading and fields container)
- Heading: `"User address"` — style: Label/lg (18px/600), color: `#020d42`, width: 220px (fixed)
- Fields container: flexDirection column, alignItems stretch, gap: **29px** (confirmed), width: 343px

**Input field anatomy** (`Input field` component, componentId: `0:2072`, `Type=Text, State=Placeholder`):
- Container: flexDirection column, alignSelf stretch, gap: 6px, sizing: fill horizontal
- Label row (`EL-025e8e16`): flexDirection row, alignSelf stretch, alignItems center, height: 18px
  - Label text: Label/sm (14px/600), color: `#020d42`
  - Hint text (optional, visible only when `Hint=true`): Paragraph/xs (12px/400), color: `#8f8f8f`, textAlignHorizontal: RIGHT
- Input box (`_Base input element`, componentId: `0:2030`):
  - flexDirection row, alignSelf stretch, padding: 12px 16px, alignItems center, gap: 8px
  - dimensions: fill horizontal × 48px fixed height
  - backgroundColor: `#ffffff`, borderWidth: 1, borderColor: `#cdc9c9`, borderRadius: 4px
  - Input text: Paragraph/md (16px/400), color: `#1c2b6e`
  - Placeholder text: same style, color: `#8f8f8f`

**Fields (exact labels and properties from Figma):**

| # | Label | Hint Shown | `Hint` Prop | Confirmed Placeholder | Notes |
|---|-------|-----------|-------------|----------------------|-------|
| 1 | `"Address line 1"` | No | `false` | *(empty)* | Required |
| 2 | `"Address line 2"` | Yes — `"Optional"` | `true` | *(empty)* | Optional |
| 3 | `"Town/City"` | No | `false` | *(empty, placeholder color `#8f8f8f`)* | Required |
| 4 | `"County "` (trailing space in Figma — trim in code) | No | `false` | `"(123)-123-1234"` ← Figma artifact, use empty placeholder | Required — text input, not phone |
| 5 | `"Post code"` | No | `false` | `"ect 1235"` ← Figma artifact, use empty placeholder | Required |
| 6 | `"Country"` | No | `false` | — | Required — `Input select` component (see below) |

**Country select field** (`Input select`, componentId: `0:2805`, `State=Filled`):
- Container: flexDirection column, alignSelf stretch, gap: 6px
- Label row identical to Input field above; Label/sm `"Country"`, color `#020d42`
- Input box (`_Base input element`): same dimensions as text inputs
  - **backgroundColor: `#ffffff`**
  - **borderColor: `#03135e`** (brand primary — confirmed `strokes=fill_37189b50`) — active/filled state
  - `Show Right Icon: true` — trailing `arrow_drop_down` icon (componentId: `0:2202`, `icon-arrow-drop-down.svg` 24×24)
  - Value text: Paragraph/md (16px/400), color: `#020d42` — **`"United Kingdom"`** (confirmed)
- In React Native: implement as `TouchableOpacity` opening a `Modal` with `FlatList` of country options, or `react-native-picker-select` / React Native Paper `Menu`

---

### Total bar (sticky footer — confirmed from Figma)

Frame: `"total containr"` (sic), node `2:1473`

- `View`, flexDirection column, padding: 16px, gap: 12px
- dimensions: 375×(hug) fixed width
- locationRelativeToParent: `{x: 0, y: 904}` — positioned at bottom of screen
- backgroundColor: `#ffffff`
- borderTopWidth: 1px, borderTopColor: `#cdc9c9` (top border only — `strokeWeight: "1px 0px 0px"`)

Row 1:
- `Text` — dynamic voucher name (Figma shows `"1-day Wi-Fi voucher"`)
- style: Label/lg (18px/600), color: `#020d42`, textAlignHorizontal: LEFT

Row 2 (flexDirection row, alignSelf stretch, justifyContent space-between):
- Left column (flexDirection column, gap: 4px):
  - `"Total:"` — Label/sm (14px/600), color: `#020d42`
  - Dynamic price (Figma shows `"£7.99"`) — Label/lg (18px/600), color: `#020d42`
- Right: **"Confirm and pay"** button (`Button` component, componentId: `0:447`, `Size=md, Variant=Fill, Color=Primary`):
  - flexDirection row, padding: 12px 24px, justifyContent center, alignItems center, gap: 8px
  - backgroundColor: `#03135e`, borderRadius: 9999px (pill)
  - Label: `"Confirm and pay"` — Label/md (16px/600), color: `#ffffff`
  - Wrapper frame height: 24px fixed

---

### States

- **Default:** All inputs empty. "Confirm and pay" button enabled (no disabled state in design — validation fires on submit).
- **Input focused:** Keyboard appears; `KeyboardAvoidingView` scrolls screen to keep focused field visible. Border color change not specified in design — use `#03135e` for focused border (consistent with Country field filled state).
- **Input filled:** Text color `#1c2b6e`. Country field shows `#03135e` border when value selected (confirmed from Figma).
- **Required field error (on submit):** Show red border (`#b0000a`) on empty required fields. Show error message below field using `Atomic/Field/Message` component (componentId: `0:2056`, `Type=Info`) with error color.
- **Loading/submitting:** Disable "Confirm and pay" button; show activity indicator inside or over button.
- **Success:** Navigate to QRCodeScreen via `navigation.replace('QRCodeScreen', { purchaseId, voucherId })`. User cannot navigate back to billing form.
- **Error:** Navigate to GeneralErrorScreen via `navigation.navigate('GeneralErrorScreen', { errorMessage })`.

---

### Interactions

- Tap `"Back to verify booking"` → `navigation.goBack()` → VoucherSelectedScreen
- Tap any `TextInput` → keyboard opens; `ScrollView` + `KeyboardAvoidingView` keep focused field in view
- Tap Country field → opens country picker (Modal or Paper Menu)
- Pull to refresh: not applicable on this screen
- Tap `"Confirm and pay"`:
  1. Validate required fields (Address line 1, Town/City, County, Post code, Country)
  2. If invalid → show inline error on each empty required field, do **not** submit
  3. If valid → POST `/api/purchases` with voucherId + billingAddress data
  4. On 2xx → `navigation.replace('QRCodeScreen', { purchaseId, voucherId })`
  5. On non-2xx or network error → `navigation.navigate('GeneralErrorScreen', { errorMessage })`

---

### Data

**Read from Zustand `selectedVoucher`:**
- `name` — displayed in total bar row 1
- `priceGBP` — displayed in total bar row 2 (formatted as `£X.XX`)
- `id` — sent as `voucherId` in POST body

**Submitted (POST /api/purchases):**
```ts
{
  voucherId: string,
  billingAddress: {
    addressLine1: string,     // required
    addressLine2?: string,    // optional
    city: string,             // "Town/City" field → maps to `city`
    county: string,           // required (trim trailing space from label)
    postCode: string,         // required
    country: string,          // required, default "United Kingdom"
  }
}
```

**Response (success):** `{ id: purchaseId, voucherId, qrCode: string, status: "COMPLETED" }`
**Response (error):** NestJS standard `{ statusCode, message, error }`

---

### Accessibility

- All `TextInput` fields: `accessibilityLabel` = trimmed field label (e.g. `"Address line 1"`, `"County"`)
- Country selector: `accessibilityRole="button"`, `accessibilityLabel="Country, currently United Kingdom"` (updated dynamically)
- "Confirm and pay" button: `accessibilityRole="button"`, `accessibilityLabel="Confirm and pay"`
- Back link: `accessibilityRole="button"`, `accessibilityLabel="Back to verify booking"`
- Error messages: `accessibilityLiveRegion="polite"` on error text
- Minimum touch target: 44×44pt on all interactive elements

---

### Mobile-specific notes

- Wrap entire screen in `KeyboardAvoidingView` with `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`
- Use `ScrollView` with `keyboardShouldPersistTaps="handled"` for the form area
- Total bar must stay above keyboard — use `KeyboardAvoidingView` offset or `position: 'absolute'` bottom with inset from `useSafeAreaInsets().bottom`
- Safe area: apply `useSafeAreaInsets().bottom` to total bar bottom padding
- Safe area: apply `useSafeAreaInsets().top` to top of screen (MobileNavBar sits at y=0 over the safe area)
- Status bar: **light** content (white icons) — `<StatusBar barStyle="light-content" />`
- MobileNavBar has `borderRadius: "32px 32px 0px 0px"` — in React Native use `borderTopLeftRadius: 32, borderTopRightRadius: 32` (note: this creates visible rounding at the physical top of the screen against the status bar; may need visual QA)
- Desktop form header component is 1440px wide — in React Native use `width: '100%'`, override padding to 16px horizontal

---

## Component Inventory

| Component Name | Figma Component ID | Props | States | Reused In |
|---|---|---|---|---|
| `MobileNavBar` | `0:1892` | *(static for prototype)* | default | VoucherListScreen, VoucherSelectedScreen, BillingFormScreen |
| `StepBar` | `0:278` | `currentStep: 1 \| 2` | step1=past+check / step2=current | BillingFormScreen (step 2), VoucherSelectedScreen (step 1) |
| `FormInput` | `0:2072` | `label`, `value`, `onChangeText`, `required`, `hint?`, `error?`, `placeholder?` | default, focused, error, filled | BillingFormScreen ×5 text fields |
| `CountrySelect` | `0:2805` | `value`, `onValueChange`, `error?` | default, selected/filled (`#03135e` border), error | BillingFormScreen country field |
| `TotalBar` | *(custom)* | `voucherName`, `priceGBP`, `onConfirm`, `isLoading` | default, loading | BillingFormScreen |
| `PrimaryButton` | `0:447` | `label`, `onPress`, `disabled?`, `loading?` | default, pressed, disabled, loading | TotalBar |
| `FieldMessage` | `0:2056` | `message`, `type` | info/error | BillingFormScreen (inline field errors) |

> `MobileNavBar`, `StepBar`, `PrimaryButton` are defined first in the `voucher-selection` feature — reuse those implementations here.

---

## Navigation Flow

```
VoucherSelectedScreen
  → [tap "Buy X-day voucher"] → BillingFormScreen

BillingFormScreen
  → [tap back link] → VoucherSelectedScreen (goBack)
  → [Confirm and pay, success] → QRCodeScreen (replace — no back to billing)
  → [Confirm and pay, error] → GeneralErrorScreen (navigate)
```

---

## API Interactions

| Action | Method | Endpoint | Payload |
|---|---|---|---|
| Create purchase + billing address | POST | `/api/purchases` | `{ voucherId, billingAddress: { addressLine1, addressLine2?, city, county, postCode, country } }` |

*(Endpoints are inferred — actual shape confirmed in plan-feature)*

---

## Design Tokens Used

| Token | Value | Used For |
|---|---|---|
| `Color/background/brand/primary` | `#03135e` | Nav bar, form header bg, Country border (filled), "Confirm and pay" button |
| `Color/background/neutral/quaternary` | `#edf8fe` | Form scroll area background |
| `Color/background/neutral/primary` | `#ffffff` | Input backgrounds, total bar background |
| `Color/foreground/neutral/primary` | `#020d42` | Section heading, total labels, price, Country value text |
| `Color/foreground/neutral/secondary` | `#1c2b6e` | Input text value (filled inputs) |
| `Color/foreground/neutral/tertiary` | `#8f8f8f` | "Optional" hint text, placeholder color |
| `Color/foreground/neutral/primary-inverse` | `#ffffff` | Form header text, back link text, button label |
| `Color/stroke/neutral/primary` | `#cdc9c9` | Input borders (default), total bar top border |
| `Color/stroke/brand/primary` | `#03135e` | Country select border when filled (confirmed) |
| `Color/stroke/neutral/secondary` | `#8189AF` | Step bar connector line, nav bar vertical divider |
| `Color/background/system/danger/primary` | `#b0000a` | Required field error border + error message text |
| `Rounding/radius-controls-small` | `4` | Input field border radius |
| `Rounding/btn-rounding` | `9999` | "Confirm and pay" pill button |
| `Label/lg` | 18px / 600 | Section heading, voucher name in total bar, price |
| `Label/md` | 16px / 600 | Button label, back link text |
| `Label/sm` | 14px / 600 | Field labels, "Total:" label |
| `Heading/H3` | 28px / 400 | Page title |
| `Paragraph/md` | 16px / 400 | Input text values, step labels |
| `Paragraph/xs` | 12px / 400 | "Optional" hint |

---

## Assets

All assets are SVG vectors exported from Figma. They require `react-native-svg` + `react-native-svg-transformer`.

| Asset | Figma Node | Type | Dimensions | Saved Path | Used In | RN Usage |
|-------|-----------|------|-----------|-----------|---------|----------|
| Park Holidays red-flag logo | `I2:1472;1841:84725` | SVG | 73×15 | `apps/mobile/assets/features/billing/logo-redflag.svg` | MobileNavBar | `import LogoSvg from '...'; <LogoSvg width={73} height={15} />` |
| Wi-Fi Park Holidays wordmark | `I2:1472;6169:130133` | SVG | 102×33 | `apps/mobile/assets/features/billing/logo-wifiparkholidays.svg` | MobileNavBar | `import LogoSvg from '...'; <LogoSvg width={100} height={33} />` |
| Menu / hamburger icon | `I2:1472;1841:84721` | SVG | 24×24 | `apps/mobile/assets/features/billing/icon-menu.svg` | MobileNavBar | `import MenuIcon from '...'; <MenuIcon width={24} height={24} />` |
| Back arrow icon | `I2:1459;1540:126952;28054:8101` | SVG | 20×20 | `apps/mobile/assets/features/billing/icon-arrow-back.svg` | Form header back link | `import ArrowBack from '...'; <ArrowBack width={20} height={20} />` |
| Dropdown chevron icon | `I2:1471;5626:154507;2:1469;19560:119899;19522:10900` | SVG | 24×24 | `apps/mobile/assets/features/billing/icon-arrow-drop-down.svg` | CountrySelect trailing icon | `import ChevronDown from '...'; <ChevronDown width={24} height={24} />` |

**SVG note:** All 5 assets are SVGs. The implementation agent must verify that `react-native-svg` and `react-native-svg-transformer` are installed and configured in `metro.config.js` and `tsconfig.json` before using them (first installed in `voucher-selection` feature — confirm before proceeding).

> **Deduplication note:** `logo-redflag.svg`, `logo-wifiparkholidays.svg`, and `icon-menu.svg` are also present in `apps/mobile/assets/features/voucher-selection/`. Consider consolidating into `apps/mobile/assets/shared/` to avoid duplication.

**Missing assets:** none — all 5 assets downloaded and confirmed non-zero.

---

## Business Rules

- Payment is **mocked** — tapping "Confirm and pay" creates a `Purchase` with `status = COMPLETED` directly (no payment gateway)
- No card details are collected or displayed
- A `BillingAddress` record is created server-side alongside the `Purchase` (both persisted to DB)
- Selected voucher price and name are read from Zustand `selectedVoucher` (set on VoucherSelectedScreen)
- After a successful purchase, the stack is **replaced** — user cannot navigate back to the billing form via the back button

---

## Acceptance Criteria

- [ ] Mobile nav bar renders at top (48px navy) with hamburger icon + both logos + vertical divider
- [ ] Nav bar has rounded top corners (borderTopLeftRadius: 32, borderTopRightRadius: 32)
- [ ] Right side of nav bar is empty (no cart/bell icons on this screen)
- [ ] "Back to verify booking" link (with arrow-back icon) navigates to VoucherSelectedScreen
- [ ] Page title renders as "Wi-Fi voucher booking" (with hyphen)
- [ ] StepBar shows step 1 with check icon and label "Select package" (past state)
- [ ] StepBar shows step 2 with "2" badge and label "Payment" (current/active state)
- [ ] Connector line between steps is `#8189AF`
- [ ] Form area has `#EDF8FE` background
- [ ] Section heading "User address" renders in Label/lg (18px/600)
- [ ] All 6 form fields render in the correct order with exact labels
- [ ] Address line 2 shows "Optional" hint text; all other text fields have no hint text
- [ ] County field label is trimmed (no trailing space)
- [ ] County and Post code fields use empty placeholder strings (not design artifact text)
- [ ] Country field renders as a select/dropdown defaulting to "United Kingdom" with dropdown-chevron icon on the right
- [ ] Country field has `#03135e` border when a value is selected
- [ ] Tapping "Confirm and pay" with missing required fields shows inline errors — form does **not** submit
- [ ] Tapping "Confirm and pay" with all required fields POSTs to `/api/purchases` with correct payload structure
- [ ] On POST success, navigates to QRCodeScreen; back button does **not** return to BillingFormScreen
- [ ] On POST error, navigates to GeneralErrorScreen
- [ ] Total bar shows selected voucher name and price from Zustand `selectedVoucher`
- [ ] Total bar top border (`#cdc9c9`, 1px) is visible
- [ ] Keyboard does not obscure the focused input field (`KeyboardAvoidingView`)
- [ ] Sticky total bar remains visible above the keyboard and respects safe area bottom inset
- [ ] Status bar uses light content (white icons)

---

## Open Questions (All Resolved)

1. ~~What are the exact labels for all 6 form fields?~~ **Resolved:** Address line 1, Address line 2, Town/City, County, Post code, Country (confirmed from Figma `Label Text` component properties)
2. ~~Which fields are required vs optional?~~ **Resolved:** Address line 2 is optional (`Hint=true`, `Hint Text="Optional"`); all others required
3. ~~Is the billing address persisted server-side?~~ **Resolved:** Yes — `BillingAddress` model exists in `schema.prisma` alongside `Purchase`
4. ~~What error conditions trigger GeneralErrorScreen?~~ **Resolved:** Any non-2xx response from POST `/api/purchases`
5. ~~What are the exact StepBar labels?~~ **Resolved:** Step 1 = `"Select package"` (Past/checked), Step 2 = `"Payment"` (Current) — confirmed from Figma node tree
6. ~~Does the County field have a specific input type?~~ **Resolved:** It is a plain text input. The Figma placeholder `"(123)-123-1234"` is a design artifact — use empty placeholder in implementation
7. ~~What is the MobileNavBar border radius?~~ **Resolved:** `"32px 32px 0px 0px"` — top corners rounded 32px, bottom square
