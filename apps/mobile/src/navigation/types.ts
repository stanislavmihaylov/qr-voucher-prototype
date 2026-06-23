import type { NativeStackScreenProps } from '@react-navigation/native-stack'

/**
 * Root stack param list — all screen routes and their typed params.
 * Add new routes here as features are implemented.
 */
export type RootStackParamList = {
  /** Entry screen — shows all Wi-Fi voucher packages */
  VoucherList: undefined
  /** Billing form — receives the selected voucher id as a param */
  Billing: { voucherId: string }
  /**
   * QR code display screen — terminal screen after purchase success.
   * `qrCode` is the raw QR payload; `voucherCode` is the human-readable code;
   * `voucherName` is the display name of the purchased voucher.
   */
  QRCode: {
    purchaseId: string
    voucherId: string
    qrCode: string
    voucherCode: string
    voucherName: string
  }
  /**
   * General error screen — owned by the `error` feature.
   * Registered here as a placeholder so billing nav type-checks.
   */
  GeneralError: { errorMessage: string }
}

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>
