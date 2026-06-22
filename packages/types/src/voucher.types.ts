// Shared types for voucher-selection feature.
// Derived from apps/backend/src/voucher/dto/voucher-response.dto.ts

/**
 * Response shape returned by:
 *   GET /api/vouchers        → WifiVoucherResponse[]
 *   GET /api/vouchers/:id    → WifiVoucherResponse
 *
 * All display strings (card title, CTA label, device bullet, duration text)
 * are DERIVED on the client from `durationDays` and `maxDevices`.
 * No name / iconKey / durationLabel fields are persisted.
 */
export interface WifiVoucherResponse {
  id: string;
  durationDays: number;
  maxDevices: number;
  /** Prisma Decimal serialised to JS number by the backend */
  priceGBP: number;
}
