import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { WifiVoucherResponse } from '@repo/types'

export const VOUCHERS_QUERY_KEY = ['vouchers'] as const

/** Fetches all Wi-Fi voucher packages sorted by durationDays ascending */
export function useVouchers() {
  return useQuery({
    queryKey: VOUCHERS_QUERY_KEY,
    queryFn: () => api.get<WifiVoucherResponse[]>('/api/vouchers'),
  })
}

/** Fetches a single Wi-Fi voucher package by id */
export function useVoucher(id: string) {
  return useQuery({
    queryKey: [...VOUCHERS_QUERY_KEY, id],
    queryFn: () => api.get<WifiVoucherResponse>(`/api/vouchers/${id}`),
    enabled: !!id,
  })
}
