import React from 'react'
import { render, waitFor } from '@testing-library/react-native'
import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { VoucherListScreen } from '../screens/VoucherListScreen'
import { api } from '../lib/api'

jest.mock('../lib/api')

const mockedApi = api as jest.Mocked<typeof api>

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
}

async function renderScreen(queryClient = makeQueryClient()) {
  return render(
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <VoucherListScreen />
      </NavigationContainer>
    </QueryClientProvider>,
  )
}

describe('VoucherListScreen — loading state', () => {
  it('shows skeleton cards while loading', async () => {
    // Never resolve — stays in loading state
    mockedApi.get.mockReturnValueOnce(new Promise(() => {}))

    const { getAllByTestId } = await renderScreen()

    // Should immediately show skeleton cards
    const skeletons = getAllByTestId('skeleton-card')
    expect(skeletons.length).toBe(3)
  })
})

describe('VoucherListScreen — error state', () => {
  it('shows ErrorMessage and Retry button on API failure', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('Network error'))

    const { getByTestId, getByText } = await renderScreen()

    await waitFor(() => {
      expect(getByTestId('retry-button')).toBeTruthy()
      expect(getByText('Retry')).toBeTruthy()
    })
  })
})

describe('VoucherListScreen — empty state', () => {
  it('shows EmptyState when API returns empty array', async () => {
    mockedApi.get.mockResolvedValueOnce([])

    const { getByText } = await renderScreen()

    await waitFor(() => {
      expect(getByText('No Wi-Fi packages available')).toBeTruthy()
    })
  })
})
