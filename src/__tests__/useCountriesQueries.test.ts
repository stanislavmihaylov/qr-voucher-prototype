/**
 * useCountriesQueries tests
 *
 * Slice A: useCountries calls api.get('/api/countries').
 */
import { renderHook, waitFor } from '@testing-library/react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useCountries } from '../hooks/useCountriesQueries'
import { api } from '../lib/api'
import type { Country } from '@repo/types'

jest.mock('../lib/api')

const mockedApi = api as jest.Mocked<typeof api>

const MOCK_COUNTRIES: Country[] = [
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'FR', name: 'France' },
]

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('useCountries — Slice A', () => {
  afterEach(() => jest.clearAllMocks())

  it('calls api.get with /api/countries and returns the list', async () => {
    mockedApi.get.mockResolvedValue(MOCK_COUNTRIES)

    const { result } = renderHook(() => useCountries(), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockedApi.get).toHaveBeenCalledWith('/api/countries')
    expect(result.current.data).toEqual(MOCK_COUNTRIES)
  })
})
