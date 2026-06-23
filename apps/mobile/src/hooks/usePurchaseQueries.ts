import { useMutation } from '@tanstack/react-query'
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
