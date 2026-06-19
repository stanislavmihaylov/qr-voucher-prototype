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
}

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>
