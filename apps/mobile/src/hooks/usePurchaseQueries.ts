import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { CreatePurchaseRequest, PurchaseResponse } from '@repo/types'

/**
 * Mutation hook for creating a new purchase.
 * POSTs to /api/purchases — anonymous (no auth header per CLAUDE.md).
 */
export function useCreatePurchase() {
  return useMutation({
    mutationFn: (data: CreatePurchaseRequest) =>
      api.post<PurchaseResponse>('/api/purchases', data),
  })
}

/**
 * Query hook for fetching a single purchase by ID.
 * GETs /api/purchases/:id — anonymous (no auth header per CLAUDE.md).
 * Only used as a fallback on QRCodeScreen if qrCode param is missing.
 */
export function usePurchase(id: string) {
  return useQuery({
    queryKey: ['purchases', id],
    queryFn: () => api.get<PurchaseResponse>(`/api/purchases/${id}`),
    enabled: !!id,
  })
}
