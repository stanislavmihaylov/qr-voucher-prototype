# Data Model — Initial Skeleton

> ⚠️ This is an inferred skeleton from screen names and visible UI. Confirm and refine during plan-feature.

## Entities

### WifiVoucher

Represents a purchasable Wi-Fi package displayed on the VoucherListScreen. There are three visible on the design (three `Card/wi-fi` instances). The card likely shows plan name, device count, duration, and price.

- id: String (cuid, PK)
- name: String (e.g., "Basic", "Standard", "Premium")
- description: String
- priceGBP: Decimal
- durationDays: Int
- maxDevices: Int
- createdAt: DateTime
- updatedAt: DateTime
# TODO: confirm exact fields (price, duration, device count) from design-analyst-flow on `voucher-selection`

### Purchase

Represents a completed (mock) purchase. Created when the user taps "Pay" on the BillingFormScreen. Holds the QR code payload and billing info.

- id: String (cuid, PK)
- voucherId: String (FK → WifiVoucher)
- qrCodeData: String (the data encoded in the QR code — could be a URL, token, or UUID)
- status: PurchaseStatus (enum: PENDING | COMPLETED | ERROR)
- createdAt: DateTime
- updatedAt: DateTime
# TODO: confirm whether purchase is persisted server-side or just generated client-side (prototype scope)

### BillingAddress

Collected on BillingFormScreen. The design shows 6 input fields under "User address" (address line 1, address line 2, city, postcode, country, plus one select). Attached to a Purchase.

- id: String (cuid, PK)
- purchaseId: String (FK → Purchase, unique 1:1)
- line1: String
- line2: String?
- city: String
- postcode: String
- county: String?
- country: String (select field)
- createdAt: DateTime
# TODO: confirm exact field labels from design-analyst-flow on `billing`

## Enums

```
enum PurchaseStatus {
  PENDING
  COMPLETED
  ERROR
}
```

## Relationships

- WifiVoucher has many Purchases
- Purchase has one BillingAddress
- Purchase has one QR code (embedded as `qrCodeData` string — no separate entity needed)

## Notes

- **No auth in prototype** — user identity is not tracked; purchases are anonymous
- **Payment is mocked** — tapping "Pay" creates a Purchase with status=COMPLETED directly, no payment provider
- **QR code generation** — `qrCodeData` is generated server-side (or client-side as a UUID) and rendered via a QR library (e.g., `react-native-qrcode-svg`)
- All entities include `createdAt`/`updatedAt` timestamps
- Soft deletes: not needed for this prototype scope
