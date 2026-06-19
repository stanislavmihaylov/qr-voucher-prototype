# Feature Flow: Voucher Selection

**Figma Node IDs:** 2:1386, 2:1437
**Feature Slug:** `voucher-selection`
**Navigator:** Main Stack
**Last Updated:** 2026-06-19

---

## Overview

The user lands on a list of available Wi-Fi packages and selects one. Selecting a card highlights it and signals intent to purchase. This is the entry point of the entire flow — no auth required.

---

## Screens

### VoucherListScreen

**Node ID:** `2:1386`
**Navigator:** Main Stack (root screen)
**Entry point:** App launch
**Exit points:** → VoucherSelectedScreen (on card tap) → BillingFormScreen (on CTA tap)

**Content & layout (inferred):**
- Header/nav bar at top (mobile, 48px)
- Introductory copy: "Select a Wi-Fi package. Your access period begins when you complete your purchase."
- List of 3 Wi-Fi package cards (`Card/wi-fi` component), each ~327px tall
- Footer with copyright and social links

**Key interactions:**
- Tap a card → card enters selected state (VoucherSelectedScreen)

**Data displayed:**
- `WifiVoucher`: name, description, price, duration, device count
# TODO: confirm exact card fields from design-analyst-flow on this feature

**Data submitted:**
- None — selection is held in local state

---

### VoucherSelectedScreen

**Node ID:** `2:1437`
**Navigator:** Main Stack
**Entry point:** Tap a card on VoucherListScreen
**Exit points:** → BillingFormScreen (tap "Buy Now" / proceed CTA) → VoucherListScreen (tap back / deselect)

**Content & layout (inferred):**
- Same card list but one card is in a highlighted/active/selected state (first card is 238px vs 327px for the others — likely a collapsed vs expanded pattern)
- Selected card likely shows a "Buy Now" CTA or the CTA becomes active in a sticky footer

**Key interactions:**
- Tap "Buy Now" → navigate to BillingFormScreen with selected voucher ID

**Data displayed:**
- Same as VoucherListScreen, with the selected card visually distinguished

**Data submitted:**
- Selected `WifiVoucher.id` passed to next screen

---

## Business Rules

- Only one voucher can be selected at a time
- The access period starts at the moment of purchase (not at first scan)
- Multiple purchases are allowed — each generates a separate QR code
# TODO: confirm "access period begins at purchase" copy is accurate for the backend

---

## Acceptance Criteria

- [ ] All available Wi-Fi packages are listed on load
- [ ] Tapping a card selects it and updates its visual state
- [ ] Tapping a selected card again deselects it (or navigates back)
- [ ] "Buy Now" CTA is only active when a card is selected
- [ ] Tapping "Buy Now" navigates to BillingFormScreen with the correct voucher data

---

## Open Questions

1. Are the 3 packages hardcoded or fetched from an API?
2. What are the actual package names, prices, and durations shown on the cards?
3. Does deselecting a card return the user to the list view or stay on the same screen?
