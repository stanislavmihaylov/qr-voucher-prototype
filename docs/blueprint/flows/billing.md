# Feature Flow: Billing

**Figma Node IDs:** 2:1457
**Feature Slug:** `billing`
**Navigator:** Main Stack
**Last Updated:** 2026-06-19

---

## Overview

The user fills in their billing/address details before completing a mock purchase. Payment processing is out of scope for this prototype — tapping "Pay" skips the payment provider and directly creates the purchase.

---

## Screens

### BillingFormScreen

**Node ID:** `2:1457`
**Navigator:** Main Stack
**Entry point:** Tap "Buy Now" on VoucherSelectedScreen
**Exit points:** → QRCodeScreen (tap "Pay", no errors) → GeneralErrorScreen (on error)

**Content & layout (inferred):**
- Header/nav bar at top (mobile, 48px)
- "User address" section heading
- 6 input fields stacked vertically (5 text inputs + 1 select/dropdown):
  - Address line 1
  - Address line 2
  - City
  - Postcode
  - County (# TODO: confirm — may be county or phone/email)
  - Country (select dropdown)
- Sticky bottom bar showing order total + "Pay" CTA button (176px wide)
- Total price display (currency + amount)

**Key interactions:**
- Fill all required fields → tap "Pay" → navigate to QRCodeScreen (prototype: no real payment)
- Tap back → return to VoucherSelectedScreen

**Data displayed:**
- Selected voucher price in the sticky total bar

**Data submitted:**
- `BillingAddress`: line1, line2, city, postcode, county?, country
- `Purchase`: voucherId (from previous screen), status set to COMPLETED

**Validation rules (inferred):**
- line1, city, postcode, country are required
- line2, county are optional
# TODO: confirm required vs optional fields

---

## Business Rules

- Payment is mocked — tapping "Pay" directly creates a `Purchase` with status=COMPLETED
- No real card details are collected or processed
- A `BillingAddress` record is created alongside the `Purchase`
# TODO: confirm whether billing address is stored server-side or only used for display

---

## Acceptance Criteria

- [ ] All 6 form fields render correctly with appropriate input types
- [ ] Country field renders as a select/dropdown
- [ ] Required field validation prevents submission if empty
- [ ] Tapping "Pay" creates a Purchase and navigates to QRCodeScreen
- [ ] On any server error, the user is routed to GeneralErrorScreen
- [ ] The order total shown matches the selected voucher price

---

## Open Questions

1. What are the exact labels for all 6 form fields?
2. Which fields are required vs optional?
3. Is the billing address persisted server-side or only used locally?
4. What error conditions trigger the GeneralErrorScreen (network failure, validation failure, both)?
