/**
 * Pure label-derivation helpers for the voucher-selection feature.
 *
 * All display strings (card title, CTA, bullets, icon number) are derived
 * from `durationDays` and `maxDevices` — nothing is hardcoded per-package.
 */

/** "24 hours" for 1-day; "{n} days" for everything else */
export const durationText = (d: number): string =>
  d === 1 ? '24 hours' : `${d} days`

/** "1-day", "10-day", etc. */
export const durationLabel = (d: number): string => `${d}-day`

/** "1-day Wi-Fi voucher" */
export const voucherName = (d: number): string =>
  `${durationLabel(d)} Wi-Fi voucher`

/** "Buy 1-day voucher" */
export const buyLabel = (d: number): string => `Buy ${durationLabel(d)} voucher`

/** "• Up to 12 devices" */
export const deviceBullet = (n: number): string => `• Up to ${n} devices`

/** "• Valid for 24 hours from activation" */
export const durationBullet = (d: number): string =>
  `• Valid for ${durationText(d)} from activation`

/** "£7.99" */
export const formatPrice = (gbp: number): string => `£${gbp.toFixed(2)}`
