import React from 'react'
import { render, waitFor } from '@testing-library/react-native'
import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { VoucherListScreen } from '../screens/VoucherListScreen'
import { api } from '../lib/api'
import type { WifiVoucherResponse } from '@repo/types'

jest.mock('../lib/api')

const mockedApi = api as jest.Mocked<typeof api>

const MOCK_VOUCHERS: WifiVoucherResponse[] = [
  { id: '1', durationDays: 1, maxDevices: 2, priceGBP: 7.99 },
  { id: '2', durationDays: 3, maxDevices: 4, priceGBP: 12.99 },
  { id: '3', durationDays: 4, maxDevices: 6, priceGBP: 14.99 },
  { id: '4', durationDays: 5, maxDevices: 8, priceGBP: 16.99 },
  { id: '5', durationDays: 7, maxDevices: 10, priceGBP: 17.99 },
  { id: '6', durationDays: 10, maxDevices: 12, priceGBP: 24.99 },
]

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
}

function renderScreen(queryClient = makeQueryClient()) {
  return render(
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <VoucherListScreen />
      </NavigationContainer>
    </QueryClientProvider>,
  )
}

describe('VoucherListScreen', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders one card per voucher from the API (6 cards for 6 vouchers)', async () => {
    mockedApi.get.mockResolvedValueOnce(MOCK_VOUCHERS)

    const { getAllByText } = await renderScreen()

    // Each card renders a "Buy X-day voucher" button; there should be 6 unique CTA labels
    await waitFor(() => {
      expect(getAllByText(/Buy \d+-day voucher/).length).toBe(6)
    })
  })

  it('renders each voucher with its own device count', async () => {
    mockedApi.get.mockResolvedValueOnce(MOCK_VOUCHERS)

    const { getByText } = await renderScreen()

    await waitFor(() => {
      expect(getByText('• Up to 2 devices')).toBeTruthy()    // 1-day
      expect(getByText('• Up to 12 devices')).toBeTruthy()   // 10-day
    })
  })

  it('renders the correct dynamic card title for each voucher', async () => {
    mockedApi.get.mockResolvedValueOnce(MOCK_VOUCHERS)

    const { getByText } = await renderScreen()

    await waitFor(() => {
      expect(getByText('1-day Wi-Fi voucher')).toBeTruthy()
      expect(getByText('10-day Wi-Fi voucher')).toBeTruthy()
    })
  })

  it('shows the intro paragraph', async () => {
    mockedApi.get.mockResolvedValueOnce(MOCK_VOUCHERS)

    const { getByText } = await renderScreen()

    await waitFor(() => {
      expect(
        getByText(
          'Select a Wi-Fi package. Your access period begins when you complete your purchase.',
        ),
      ).toBeTruthy()
    })
  })
})
