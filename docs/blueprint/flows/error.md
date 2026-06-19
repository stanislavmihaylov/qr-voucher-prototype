# Feature Flow: Error

**Figma Node IDs:** 2:1411
**Feature Slug:** `error`
**Navigator:** Main Stack (modal or inline)
**Last Updated:** 2026-06-19

---

## Overview

A generic error screen shown when something goes wrong during the purchase flow (e.g., a network failure or server error during purchase creation). The user can retry or contact support.

---

## Screens

### GeneralErrorScreen

**Node ID:** `2:1411`
**Navigator:** Main Stack
**Entry point:** Any unhandled error in the purchase flow (triggered from BillingFormScreen)
**Exit points:** → BillingFormScreen or VoucherListScreen (tap retry CTA) → external contact (tap support link)

**Content & layout (inferred):**
- Header/nav bar at top (mobile, 48px)
- Warning/exclamation triangle icon (48×48px)
- Primary error heading (275px wide, ~96px tall)
- Error detail/description copy (343px wide, ~140px tall)
- Retry CTA button (343px wide, 48px tall)
- "Contact support" section below:
  - Support copy text (343×76px)
  - Support link (343×22px)
- Footer with copyright and social links

**Key interactions:**
- Tap retry CTA → return to BillingFormScreen (or restart flow)
- Tap support link → open external contact URL or email

**Data displayed:**
- Generic error heading and description (static copy)
- Support contact details

**Data submitted:**
- None

---

## Business Rules

- This screen is shown for any unrecoverable error during purchase creation
- The retry action returns the user to the billing form with their previously entered data preserved if possible
- The support link is always visible as a fallback
# TODO: confirm whether form data is preserved on retry or the user must re-enter

---

## Acceptance Criteria

- [ ] Error screen renders with icon, heading, description, and retry button
- [ ] Retry button navigates back to BillingFormScreen
- [ ] Support link is tappable and opens the correct contact destination
- [ ] Screen is reachable from BillingFormScreen on purchase failure

---

## Open Questions

1. What is the exact error heading and description copy?
2. Where does the support link point (email, phone, web URL)?
3. Should the retry go back to BillingFormScreen or all the way to VoucherListScreen?
4. Are there different error messages for different failure types, or always the same generic copy?
