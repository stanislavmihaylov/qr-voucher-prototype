import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Text, View } from 'react-native'
import { VoucherListScreen } from '../screens/VoucherListScreen'
import { api } from '../lib/api'
import { useVoucherStore } from '../store/voucher.store'
import type { WifiVoucherResponse } from '@repo/types'

jest.mock('../lib/api')

const mockedApi = api as jest.Mocked<typeof api>

const MOCK_VOUCHERS: WifiVoucherResponse[] = [
  { id: 'v-abc', durationDays: 4, maxDevices: 6, priceGBP: 14.99 },
]

// Minimal Billing screen placeholder to verify navigation
function BillingScreen({ route }: any) {
  return (
    <View>
      <Text testID="billing-screen">Billing: {route.params?.voucherId}</Text>
    </View>
  )
}

const Stack = createNativeStackNavigator()

function makeWrapper(queryClient: QueryClient) {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="VoucherList" component={VoucherListScreen} />
          <Stack.Screen name="Billing" component={BillingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  )
}

describe('VoucherListScreen — navigation', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    })
    // Reset Zustand store before each test
    useVoucherStore.setState({ selectedVoucherId: null })
  })

  afterEach(() => {
    jest.clearAllMocks()
    queryClient.clear()
  })

  it('calls setSelectedVoucherId and navigates to Billing when CTA is pressed', async () => {
    mockedApi.get.mockResolvedValueOnce(MOCK_VOUCHERS)

    const { getByText, getByTestId } = await render(makeWrapper(queryClient))

    // Wait for card to appear
    await waitFor(() => {
      expect(getByText('Buy 4-day voucher')).toBeTruthy()
    })

    // Press the CTA button
    fireEvent.press(getByText('Buy 4-day voucher'))

    // Zustand store should be updated
    await waitFor(() => {
      expect(useVoucherStore.getState().selectedVoucherId).toBe('v-abc')
    })

    // Should navigate to Billing screen with the voucherId param
    await waitFor(() => {
      expect(getByTestId('billing-screen')).toBeTruthy()
    })
  })
})
