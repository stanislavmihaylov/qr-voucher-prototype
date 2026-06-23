/**
 * usePurchaseQueries tests — covers usePurchase(id) query hook.
 * useCreatePurchase is exercised via BillingFormScreen.test.tsx (slice 3).
 */
import { renderHook, waitFor } from '@testing-library/react-native'
import { usePurchase } from '../hooks/usePurchaseQueries'
import { api } from '../lib/api'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

jest.mock('../lib/api')

const mockedApi = api as jest.Mocked<typeof api>

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
    },
  })
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return wrapper
}

const MOCK_PURCHASE = {
  id: 'purchase-abc',
  voucherId: 'voucher-123',
  qrCode: 'uuid-qr-payload',
  voucherCode: '81353 - 42142',
  voucherName: '1-day voucher',
  status: 'COMPLETED' as const,
}

describe('usePurchase', () => {
  afterEach(() => jest.clearAllMocks())

  it('calls api.get with /api/purchases/:id', async () => {
    mockedApi.get.mockResolvedValueOnce(MOCK_PURCHASE)

    const { result } = await renderHook(() => usePurchase('purchase-abc'), {
      wrapper: makeWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockedApi.get).toHaveBeenCalledWith('/api/purchases/purchase-abc')
  })

  it('returns the purchase from the API response', async () => {
    mockedApi.get.mockResolvedValueOnce(MOCK_PURCHASE)

    const { result } = await renderHook(() => usePurchase('purchase-abc'), {
      wrapper: makeWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(MOCK_PURCHASE)
  })

  it('is disabled when id is empty string', async () => {
    const { result } = await renderHook(() => usePurchase(''), {
      wrapper: makeWrapper(),
    })

    // When disabled, status is pending (not fetching)
    expect(result.current.fetchStatus).toBe('idle')
    expect(mockedApi.get).not.toHaveBeenCalled()
  })

  it('surfaces error when api.get rejects', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('Not found'))

    const { result } = await renderHook(() => usePurchase('purchase-xyz'), {
      wrapper: makeWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeInstanceOf(Error)
  })
})
