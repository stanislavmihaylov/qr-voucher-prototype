# Design Blueprint Index

**Figma File:** Wi-Fi Park Holidays App
**Figma File Key:** W37yVPZEuwtY0UWMyiyFwL
**Extracted:** 2026-06-19
**Stack:** React Native (Expo) + NestJS + Passport-JWT

## Screen Inventory

| Screen Name | Navigator | Frame/Node ID | Feature |
|---|---|---|---|
| VoucherListScreen | Main Stack | 2:1386 | `voucher-selection` |
| VoucherSelectedScreen | Main Stack | 2:1437 | `voucher-selection` |
| BillingFormScreen | Main Stack | 2:1457 | `billing` |
| QRCodeScreen | Main Stack | 2:1481 | `qr-code` |
| QRCodeScreen (with toast) | Main Stack | 2:1512 | `qr-code` |
| GeneralErrorScreen | Main Stack | 2:1411 | `error` |

## Navigation Map

Single linear flow — no auth, no tabs (prototype scope):

- **Main Stack (unauthenticated):**
  VoucherListScreen → VoucherSelectedScreen → BillingFormScreen → QRCodeScreen
  └─ (on error) → GeneralErrorScreen → back to VoucherListScreen

**Key flow notes:**
- User lands on the voucher list and picks a Wi-Fi package
- Selecting a card highlights it and reveals pricing; a "Buy Now" CTA advances to billing
- Billing form collects address/contact details; tapping "Pay" skips payment (prototype) and goes directly to QR code
- QR code screen shows a scannable code and "Connect more devices" copy; a toast confirms success
- Any backend/validation error routes to GeneralErrorScreen with a retry button

## Design Tokens

### Colors

| Token Name | Value | Semantic Use |
|---|---|---|
| `Color/background/neutral/primary` | #ffffff | Screen background, card background |
| `Color/background/neutral/quaternary` | #edf8fe | Subtle section backgrounds |
| `Color/background/brand/primary` | #03135e | Primary header/nav bar |
| `Color/background/brand/inverted` | #ffffff | Inverted brand surface |
| `Color/background/system/danger/primary` | #b0000a | Error states |
| `Color/background/system/success/primary` | #037c08 | Success states |
| `Color/foreground/neutral/primary` | #020d42 | Primary text |
| `Color/foreground/neutral/secondary` | #1c2b6e | Secondary text |
| `Color/foreground/neutral/tertiary` | #8f8f8f | Placeholder / muted text |
| `Color/foreground/neutral/primary-inverse` | #ffffff | Text on dark backgrounds |
| `Color/foreground/brand/primary-strong` | #020d42 | Brand-tinted headings |
| `Color/stroke/neutral/primary` | #cdc9c9 | Input borders, dividers |
| `Color/stroke/neutral/secondary` | #8189af | Secondary/focused borders |
| `Color/stroke/brand/primary` | #03135e | Brand border (selected state) |
| `Color/stroke/brand/inverse` | #ffffff | Border on dark surfaces |

### Typography

All fonts use **Inter**. Line height values are in px.

| Token Name | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `Heading/H3` | 28 | 600 | 32 | Page titles |
| `Heading/H4` | 24 | 600 | 28 | Section headings |
| `Heading/H5` | 20 | 600 | 24 | Card headings |
| `Label/lg` | 18 | 600 | 24 | Button labels (large) |
| `Label/md` | 16 | 600 | 20 | Button labels (default) |
| `Label/sm` | 14 | 600 | 18 | Small labels / tags |
| `Paragraph/lg` | 18 | 400 | 24 | Body copy (large) |
| `Paragraph/md` | 16 | 400 | 20 | Body copy (default) |
| `Paragraph/xs` | 12 | 400 | 14 | Captions, footnotes |

### Spacing

| Token Name | Value (px) |
|---|---|
| `Spacing/0` | 0 |
| `Spacing/0-5` | 2 |
| `Spacing/1-5` | 6 |
| `Spacing/2` | 8 |
| `Spacing/3` | 12 |
| `Spacing/4` / `Spacing/gap-sm` | 16 |
| `Spacing/gap-md` | 24 |
| `Spacing/gap-lg` | 28 |
| `Spacing/gap-xl` | 32 |
| `Spacing/12` / `Spacing/margin-lg` | 48 |
| `Spacing/margin-m` | 16 |
| `Spacing/screen-size` | 1440 (web ref, ignore for mobile) |

### Border Radius

| Token Name | Value |
|---|---|
| `Rounding/btn-rounding` | 9999 (pill/fully rounded) |
| `Rounding/radius-card` | 12 |
| `Rounding/radius-controls-small` | 4 |
| `Special/Corner Radius/Image` | 8 |

### Icons

Default icon size: **24×24 px** (`icon/width`, `icon/height`).

## Feature → Node ID Mapping

Use this table when running `design-analyst-flow` for each feature.

| Feature Slug | Node IDs | Navigator | Description |
|---|---|---|---|
| `voucher-selection` | 2:1386, 2:1437 | Main Stack | Browse Wi-Fi packages; tap to select a card |
| `billing` | 2:1457 | Main Stack | Address/contact form before "payment" |
| `qr-code` | 2:1481, 2:1512 | Main Stack | QR code display after mock payment success |
| `error` | 2:1411 | Main Stack | Generic error screen with retry CTA |
| `web-support` | NO_FIGMA | n/a | Infrastructure: react-native-web browser support — design-analyst-flow must skip Figma and emit required output fields directly (see flows/web-support.md) |

## Next Steps

Run `design-analyst-flow` for each feature, passing the feature slug and its node IDs.

Feature order (suggested by flow order):
1. `voucher-selection`
2. `billing`
3. `qr-code`
4. `error`
5. `web-support` — no Figma step; design-analyst-flow reads the existing flow spec and outputs feature_slug/feature_description directly
