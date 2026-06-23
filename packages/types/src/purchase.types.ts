// Shared types for billing / purchase feature.
// Derived from apps/backend/src/purchase/dto/*.ts

/**
 * Billing address input — matches the 6-field form.
 * All fields required except addressLine2 (optional).
 */
export interface BillingAddressInput {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county: string;
  postCode: string;
  country: string;
}

/**
 * Request body for POST /api/purchases
 */
export interface CreatePurchaseRequest {
  voucherId: string;
  billingAddress: BillingAddressInput;
}

/**
 * Response shape returned by POST /api/purchases and GET /api/purchases/:id.
 * qrCode is the server-generated UUID payload used for QR rendering.
 */
export interface PurchaseResponse {
  id: string;
  voucherId: string;
  /** UUID string — QR payload; render client-side */
  qrCode: string;
  /** Short human-readable code for manual entry, e.g. "81353 - 42142" */
  voucherCode: string;
  /** Display name of the purchased voucher, e.g. "1-day voucher" */
  voucherName: string;
  status: 'COMPLETED';
}
