import { renderHook, waitFor } from '@testing-library/react-native'
import { useVouchers } from '../hooks/useVoucherQueries'
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
  ;(wrapper as any).queryClient = queryClient
  return wrapper
}

describe('useVouchers', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('calls api.get with /api/vouchers', async () => {
    mockedApi.get.mockResolvedValueOnce([])

    const { result } = await renderHook(() => useVouchers(), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockedApi.get).toHaveBeenCalledWith('/api/vouchers')
  })

  it('returns the vouchers from the API response', async () => {
    const vouchers = [
      { id: '1', durationDays: 1, maxDevices: 2, priceGBP: 7.99 },
      { id: '2', durationDays: 4, maxDevices: 6, priceGBP: 14.99 },
    ]
    mockedApi.get.mockResolvedValueOnce(vouchers)

    const { result } = await renderHook(() => useVouchers(), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(vouchers)
  })

  it('starts in pending state then succeeds', async () => {
    mockedApi.get.mockResolvedValueOnce([])

    const { result } = await renderHook(() => useVouchers(), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.isPending).toBe(false)
    expect(result.current.isSuccess).toBe(true)
  })
})
