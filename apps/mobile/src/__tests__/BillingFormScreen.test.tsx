/**
 * BillingFormScreen tests — 6 TDD vertical slices.
 *
 * Slice 1: renders all 6 form fields in correct order; Address line 2 shows "Optional" hint.
 * Slice 2: required-field validation fires on submit with empty fields.
 * Slice 3: useCreatePurchase calls api.post with correctly mapped field names.
 * Slice 4: valid submit → navigation.replace('QRCode', { purchaseId, voucherId }).
 * Slice 5: mutation error → navigation.navigate('GeneralError', { errorMessage }).
 * Slice 6: TotalBar shows derived voucher name and price; loading disables button.
 */
import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { View, Text } from 'react-native'
import { BillingFormScreen } from '../screens/BillingFormScreen'
import type { RootStackParamList, RootStackScreenProps } from '../navigation/types'
import { api } from '../lib/api'

jest.mock('../lib/api')

const mockedApi = api as jest.Mocked<typeof api>

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MOCK_VOUCHER = {
  id: 'voucher-123',
  durationDays: 1,
  maxDevices: 2,
  priceGBP: 7.99,
}

const MOCK_PURCHASE = {
  id: 'purchase-abc',
  voucherId: 'voucher-123',
  qrCode: 'uuid-qr-code',
  status: 'COMPLETED' as const,
}

const VALID_FORM = {
  addressLine1: '42 Park Lane',
  city: 'London',
  county: 'Greater London',
  postCode: 'W1K 1AA',
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: Infinity,         // prevent background refetches after first success
        refetchOnWindowFocus: false, // disable focus-triggered refetches in tests
        refetchOnReconnect: false,   // disable reconnect-triggered refetches in tests
      },
      mutations: { retry: false },
    },
  })
}

// Stub downstream screens so the navigator is fully typed
function QRCodeStub({ route }: RootStackScreenProps<'QRCode'>) {
  return (
    <View>
      <Text testID="qr-screen">QR: {route.params?.purchaseId}</Text>
    </View>
  )
}
function GeneralErrorStub({ route }: RootStackScreenProps<'GeneralError'>) {
  return (
    <View>
      <Text testID="error-screen">{route.params?.errorMessage}</Text>
    </View>
  )
}

/**
 * Create a fresh Stack navigator per render to avoid shared state
 * between tests when using createNativeStackNavigator at module level.
 */
function renderScreen(queryClient = makeQueryClient()) {
  const Stack = createNativeStackNavigator<RootStackParamList>()
  return render(
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Billing"
            component={BillingFormScreen}
            initialParams={{ voucherId: MOCK_VOUCHER.id }}
          />
          <Stack.Screen name="QRCode" component={QRCodeStub} />
          <Stack.Screen name="GeneralError" component={GeneralErrorStub} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>,
  )
}

// ---------------------------------------------------------------------------
// Slice 1: renders all 6 fields + "Optional" hint on Address line 2
// ---------------------------------------------------------------------------

describe('BillingFormScreen — field rendering', () => {
  beforeEach(() => {
    mockedApi.get.mockResolvedValue(MOCK_VOUCHER)
  })
  afterEach(() => jest.clearAllMocks())

  it('renders all 6 form fields with correct labels in order', async () => {
    const { getByText } = await renderScreen()

    await waitFor(() => {
      expect(getByText('Address line 1')).toBeTruthy()
      expect(getByText('Address line 2')).toBeTruthy()
      expect(getByText('Town/City')).toBeTruthy()
      expect(getByText('County')).toBeTruthy()
      expect(getByText('Post code')).toBeTruthy()
      expect(getByText('Country')).toBeTruthy()
    })
  })

  it('shows "Optional" hint only on Address line 2', async () => {
    const { getAllByText } = await renderScreen()

    await waitFor(() => {
      const optionals = getAllByText('Optional')
      expect(optionals).toHaveLength(1)
    })
  })
})

// ---------------------------------------------------------------------------
// Slice 2: required-field validation on submit with empty fields
// ---------------------------------------------------------------------------

describe('BillingFormScreen — validation', () => {
  beforeEach(() => {
    mockedApi.get.mockResolvedValue(MOCK_VOUCHER)
  })
  afterEach(() => jest.clearAllMocks())

  it('shows inline errors on empty required fields and does NOT call api.post', async () => {
    const { getByText } = await renderScreen()

    // Wait for voucher query to settle before interacting (avoids overlapping act())
    await waitFor(() => expect(getByText('1-day Wi-Fi voucher')).toBeTruthy())

    fireEvent.press(getByText('Confirm and pay'))

    await waitFor(() => {
      expect(getByText('Address line 1 is required')).toBeTruthy()
      expect(getByText('Town/City is required')).toBeTruthy()
      expect(getByText('County is required')).toBeTruthy()
      expect(getByText('Post code is required')).toBeTruthy()
    })

    expect(mockedApi.post).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// Slice 3: useCreatePurchase calls api.post with correct payload
// ---------------------------------------------------------------------------

describe('BillingFormScreen — mutation payload', () => {
  beforeEach(() => {
    mockedApi.get.mockResolvedValue(MOCK_VOUCHER)
    mockedApi.post.mockResolvedValue(MOCK_PURCHASE)
  })
  afterEach(() => jest.clearAllMocks())

  it('POSTs to /api/purchases with correctly mapped billing fields on valid submit', async () => {
    const { getByText, getByTestId } = await renderScreen()

    // Wait for voucher query to settle before interacting (avoids overlapping act())
    await waitFor(() => expect(getByText('1-day Wi-Fi voucher')).toBeTruthy())

    // fireEvent is async in RNTL v14 — await each call so act() flushes state
    await fireEvent.changeText(getByTestId('input-addressLine1'), VALID_FORM.addressLine1)
    await fireEvent.changeText(getByTestId('input-city'), VALID_FORM.city)
    await fireEvent.changeText(getByTestId('input-county'), VALID_FORM.county)
    await fireEvent.changeText(getByTestId('input-postCode'), VALID_FORM.postCode)

    await fireEvent.press(getByText('Confirm and pay'))

    await waitFor(() => {
      expect(mockedApi.post).toHaveBeenCalledWith('/api/purchases', {
        voucherId: MOCK_VOUCHER.id,
        billingAddress: {
          addressLine1: VALID_FORM.addressLine1,
          city: VALID_FORM.city,
          county: VALID_FORM.county,
          postCode: VALID_FORM.postCode,
          country: 'United Kingdom',
        },
      })
    })
  })
})

// ---------------------------------------------------------------------------
// Slice 4: valid submit → navigation.replace('QRCode', …)
// ---------------------------------------------------------------------------

describe('BillingFormScreen — success navigation', () => {
  beforeEach(() => {
    mockedApi.get.mockResolvedValue(MOCK_VOUCHER)
    mockedApi.post.mockResolvedValue(MOCK_PURCHASE)
  })
  afterEach(() => jest.clearAllMocks())

  it('navigates to QRCode screen on successful purchase', async () => {
    const { getByText, getByTestId } = await renderScreen()

    // Wait for voucher query to settle before interacting (avoids overlapping act())
    await waitFor(() => expect(getByText('1-day Wi-Fi voucher')).toBeTruthy())

    // fireEvent is async in RNTL v14 — await each call so act() flushes state
    await fireEvent.changeText(getByTestId('input-addressLine1'), VALID_FORM.addressLine1)
    await fireEvent.changeText(getByTestId('input-city'), VALID_FORM.city)
    await fireEvent.changeText(getByTestId('input-county'), VALID_FORM.county)
    await fireEvent.changeText(getByTestId('input-postCode'), VALID_FORM.postCode)

    await fireEvent.press(getByText('Confirm and pay'))

    await waitFor(() => {
      expect(getByTestId('qr-screen')).toBeTruthy()
      expect(getByText(`QR: ${MOCK_PURCHASE.id}`)).toBeTruthy()
    }, { timeout: 3000 })
  })
})

// ---------------------------------------------------------------------------
// Slice 5: mutation error → navigation.navigate('GeneralError', …)
// ---------------------------------------------------------------------------

describe('BillingFormScreen — error navigation', () => {
  beforeEach(() => {
    mockedApi.get.mockResolvedValue(MOCK_VOUCHER)
    mockedApi.post.mockRejectedValue(new Error('Server unavailable'))
  })
  afterEach(() => jest.clearAllMocks())

  it('navigates to GeneralError screen when mutation fails', async () => {
    const { getByText, getByTestId } = await renderScreen()

    // Wait for voucher query to settle before interacting (avoids overlapping act())
    await waitFor(() => expect(getByText('1-day Wi-Fi voucher')).toBeTruthy())

    // fireEvent is async in RNTL v14 — await each call so act() flushes state
    await fireEvent.changeText(getByTestId('input-addressLine1'), VALID_FORM.addressLine1)
    await fireEvent.changeText(getByTestId('input-city'), VALID_FORM.city)
    await fireEvent.changeText(getByTestId('input-county'), VALID_FORM.county)
    await fireEvent.changeText(getByTestId('input-postCode'), VALID_FORM.postCode)

    await fireEvent.press(getByText('Confirm and pay'))

    await waitFor(() => {
      expect(getByTestId('error-screen')).toBeTruthy()
      expect(getByText('Server unavailable')).toBeTruthy()
    }, { timeout: 3000 })
  })
})

// ---------------------------------------------------------------------------
// Slice 6: TotalBar shows derived voucher name + price; loading disables button
// ---------------------------------------------------------------------------

describe('BillingFormScreen — TotalBar display', () => {
  afterEach(() => jest.clearAllMocks())

  it('shows "{durationDays}-day Wi-Fi voucher" and "£{priceGBP}" in the total bar', async () => {
    mockedApi.get.mockResolvedValue(MOCK_VOUCHER)

    const { getByText } = await renderScreen()

    await waitFor(() => {
      expect(getByText('1-day Wi-Fi voucher')).toBeTruthy()
      expect(getByText('£7.99')).toBeTruthy()
    })
  })

  it('disables the "Confirm and pay" button while submitting', async () => {
    mockedApi.get.mockResolvedValue(MOCK_VOUCHER)
    mockedApi.post.mockReturnValue(new Promise(() => {}))

    const { getByText, getByTestId } = await renderScreen()

    // Wait for voucher query to settle before interacting (avoids overlapping act())
    await waitFor(() => expect(getByText('1-day Wi-Fi voucher')).toBeTruthy())

    // fireEvent is async in RNTL v14 — await each call so act() flushes state
    await fireEvent.changeText(getByTestId('input-addressLine1'), VALID_FORM.addressLine1)
    await fireEvent.changeText(getByTestId('input-city'), VALID_FORM.city)
    await fireEvent.changeText(getByTestId('input-county'), VALID_FORM.county)
    await fireEvent.changeText(getByTestId('input-postCode'), VALID_FORM.postCode)

    await fireEvent.press(getByText('Confirm and pay'))

    await waitFor(() => {
      expect(getByTestId('confirm-button-loading')).toBeTruthy()
    })
  })
})
