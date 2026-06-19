# Feature Flow: QR Code

**Figma Node IDs:** 2:1481, 2:1512
**Feature Slug:** `qr-code`
**Navigator:** Main Stack
**Last Updated:** 2026-06-19

---

## Overview

After a mock payment succeeds, the user is shown a screen with a scannable QR code representing their Wi-Fi voucher. The screen allows them to connect additional devices. A toast notification confirms purchase success.

---

## Screens

### QRCodeScreen

**Node ID:** `2:1481` (with toast), `2:1512` (without toast / settled state)
**Navigator:** Main Stack
**Entry point:** Successful mock payment on BillingFormScreen
**Exit points:** → VoucherListScreen (tap "Buy another" or nav) — no explicit back (purchase is done)

**Content & layout (inferred):**
- Header/nav bar at top (mobile, 48px)
- Toast notification at top of screen (355×52px) — visible immediately after arrival, then dismisses (node 2:1481 variant)
- Section heading: "Connect more devices"
- Wi-Fi icon (56×56px)
- Voucher/plan name label
- Descriptive copy (84px tall text block)
- QR code image (256×256px, rounded rectangle)
- Copy/share text below QR code (48px tall)
- Caption text (28px tall)
- Two action buttons (295px wide each):
  - Primary: likely "Copy code" or "Share"
  - Secondary: likely "Buy another" or "Done"
- Footer with copyright and social links

**Key interactions:**
- Toast auto-dismisses after a short delay
- Tap primary button → copy QR code data or share sheet
- Tap secondary button → return to VoucherListScreen or close flow

**Data displayed:**
- `Purchase.qrCodeData` — rendered as a QR code image
- `WifiVoucher.name` — shown as the plan name label

**Data submitted:**
- None — read-only screen

---

## Business Rules

- QR code is generated from `Purchase.qrCodeData` (a UUID or opaque token assigned at purchase creation)
- The QR code is valid immediately upon display — no activation step
- Multiple vouchers can be purchased; each has its own QR code
# TODO: confirm what data is encoded in the QR code (URL, token, UUID?)

---

## Acceptance Criteria

- [ ] QR code renders correctly and is scannable
- [ ] Toast notification appears on screen entry and dismisses automatically
- [ ] Voucher name/plan details match the selected package
- [ ] Primary action button copies or shares the QR code data
- [ ] Secondary action button returns to the voucher list

---

## Open Questions

1. What data is encoded in the QR code — a URL, a raw token, or a UUID?
2. Does the QR code need to work offline (static data) or does it require a live lookup?
3. What are the exact labels on the two action buttons?
4. What is the toast message text?
