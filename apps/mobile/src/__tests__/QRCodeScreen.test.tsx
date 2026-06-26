/**
 * QRCodeScreen tests — 7 TDD vertical slices.
 *
 * Slice 1: Renders the QR code container using the `qrCode` route param.
 * Slice 2: Renders `voucherCode` text and "Your {voucherName} code" label.
 * Slice 3: Toast appears on mount with correct text.
 * Slice 4: "Copy code" → Clipboard.setStringAsync(voucherCode); label shows "Copied!".
 * Slice 5: "Send code" → Share.share({ message: voucherCode }).
 * Slice 6: usePurchase(id) hook calls api.get('/api/purchases/:id').
 * Slice 7: Missing qrCode param → shows loading then content (or error).
 */
import { render, fireEvent, act, waitFor } from '@testing-library/react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Share } from 'react-native'
import { QRCodeScreen } from '../screens/QRCodeScreen'
import type { RootStackParamList } from '../navigation/types'
import { api } from '../lib/api'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('../lib/api')
const mockedApi = api as jest.Mocked<typeof api>

// Mock expo-clipboard
jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn().mockResolvedValue(undefined),
}))
import * as Clipboard from 'expo-clipboard'

// Mock React Native Share
jest.spyOn(Share, 'share').mockResolvedValue({ action: 'sharedAction' })

// Mock react-native-qrcode-svg — renders a View with testID so assertions can find it
jest.mock('react-native-qrcode-svg', () => {
  const React = require('react')
  const { View } = require('react-native')
  return function QRCodeMock({ value, size }: { value: string; size: number }) {
    return (
      <View
        testID="qr-code-svg"
        accessibilityLabel={`QR code value: ${value}`}
        style={{ width: size, height: size }}
      />
    )
  }
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MOCK_PARAMS = {
  purchaseId: 'purchase-abc',
  voucherId: 'voucher-123',
  qrCode: 'uuid-qr-payload-abc123',
  voucherCode: '81353 - 42142',
  voucherName: '1-day voucher',
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
      mutations: { retry: false },
    },
  })
}

/** Renders QRCodeScreen inside a minimal navigator pre-navigated to QRCode. */
async function renderScreen(
  params: Partial<typeof MOCK_PARAMS> = {},
  queryClient = makeQueryClient(),
) {
  const mergedParams = { ...MOCK_PARAMS, ...params }
  const Stack = createNativeStackNavigator<RootStackParamList>()

  return render(
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="QRCode"
            component={QRCodeScreen}
            initialParams={mergedParams}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>,
  )
}

// ---------------------------------------------------------------------------
// Slice 1: QR code renders using the qrCode route param
// ---------------------------------------------------------------------------

describe('Slice 1 — QR code renders', () => {
  beforeEach(() => {
    mockedApi.get.mockResolvedValue({
      id: 'purchase-abc',
      voucherId: 'voucher-123',
      qrCode: 'uuid-qr-payload-abc123',
      voucherCode: '81353 - 42142',
      voucherName: '1-day voucher',
      status: 'COMPLETED' as const,
    })
  })
  afterEach(() => jest.clearAllMocks())

  it('renders the QR code component using the qrCode route param', async () => {
    const { getByTestId } = await renderScreen()

    await waitFor(() => {
      expect(getByTestId('qr-code-container')).toBeTruthy()
      expect(getByTestId('qr-code-svg')).toBeTruthy()
    })
  })
})

// ---------------------------------------------------------------------------
// Slice 2: voucherCode and voucherName label render
// ---------------------------------------------------------------------------

describe('Slice 2 — voucherCode and voucherName', () => {
  afterEach(() => jest.clearAllMocks())

  it('renders the voucher code text', async () => {
    const { getByTestId } = await renderScreen()

    await waitFor(() => {
      expect(getByTestId('voucher-code')).toBeTruthy()
    })
    expect(getByTestId('voucher-code').props.children).toBe('81353 - 42142')
  })

  it('renders "Your {voucherName} code" heading', async () => {
    const { getByText } = await renderScreen()
    await waitFor(() => {
      expect(getByText('Your 1-day voucher code')).toBeTruthy()
    })
  })

  it('renders the screen heading "Connect more devices"', async () => {
    const { getByText } = await renderScreen()
    await waitFor(() => {
      expect(getByText('Connect more devices')).toBeTruthy()
    })
  })
})

// ---------------------------------------------------------------------------
// Slice 3: Toast renders on mount with correct message
// ---------------------------------------------------------------------------

describe('Slice 3 — Toast on mount', () => {
  afterEach(() => jest.clearAllMocks())

  it('shows the success toast with correct text on mount', async () => {
    const { getByTestId, getByText } = await renderScreen()
    await waitFor(() => {
      expect(getByTestId('toast')).toBeTruthy()
      expect(getByText('Your Wi-Fi code is active on your device')).toBeTruthy()
    })
  })
})

// ---------------------------------------------------------------------------
// Slice 4: "Copy code" copies to clipboard and shows "Copied!"
// ---------------------------------------------------------------------------

describe('Slice 4 — Copy code', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(Clipboard.setStringAsync as jest.Mock).mockResolvedValue(undefined)
  })

  it('calls Clipboard.setStringAsync with voucherCode on press', async () => {
    const { getByTestId } = await renderScreen()

    await waitFor(() => {
      expect(getByTestId('copy-button')).toBeTruthy()
    })

    await act(async () => {
      fireEvent.press(getByTestId('copy-button'))
    })

    expect(Clipboard.setStringAsync).toHaveBeenCalledWith('81353 - 42142')
  })

  it('changes button label to "Copied!" after copy', async () => {
    const { getByTestId, getByText } = await renderScreen()

    await waitFor(() => {
      expect(getByText('Copy code')).toBeTruthy()
    })

    await act(async () => {
      fireEvent.press(getByTestId('copy-button'))
    })

    await waitFor(() => {
      expect(getByText('Copied!')).toBeTruthy()
    })
  })
})

// ---------------------------------------------------------------------------
// Slice 5: "Send code" opens native share sheet
// ---------------------------------------------------------------------------

describe('Slice 5 — Send code', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(Share.share as jest.Mock).mockResolvedValue({ action: 'sharedAction' })
  })

  it('calls Share.share with voucherCode on press', async () => {
    const { getByTestId } = await renderScreen()

    await waitFor(() => {
      expect(getByTestId('send-button')).toBeTruthy()
    })

    await act(async () => {
      fireEvent.press(getByTestId('send-button'))
    })

    expect(Share.share).toHaveBeenCalledWith({ message: '81353 - 42142' })
  })
})

// ---------------------------------------------------------------------------
// Slice 5b: "Send code" falls back to clipboard when Share.share rejects
//           (e.g. desktop browser where navigator.share is unavailable)
// ---------------------------------------------------------------------------

describe('Slice 5b — Send code Share fallback', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(Share.share as jest.Mock).mockRejectedValue(new Error('navigator.share not supported'))
    ;(Clipboard.setStringAsync as jest.Mock).mockResolvedValue(undefined)
  })

  it('copies to clipboard when Share.share rejects', async () => {
    const { getByTestId } = await renderScreen()

    await waitFor(() => {
      expect(getByTestId('send-button')).toBeTruthy()
    })

    await act(async () => {
      fireEvent.press(getByTestId('send-button'))
    })

    await waitFor(() => {
      expect(Clipboard.setStringAsync).toHaveBeenCalledWith('81353 - 42142')
    })
  })

  it('shows "Copied!" label on copy-button after Share fallback', async () => {
    const { getByTestId, getByText } = await renderScreen()

    await waitFor(() => {
      expect(getByText('Copy code')).toBeTruthy()
    })

    await act(async () => {
      fireEvent.press(getByTestId('send-button'))
    })

    await waitFor(() => {
      expect(getByText('Copied!')).toBeTruthy()
    })
  })
})

// ---------------------------------------------------------------------------
// Slice 6: usePurchase hook calls api.get for the purchase
// ---------------------------------------------------------------------------

describe('Slice 6 — usePurchase fallback hook', () => {
  it('calls api.get with the correct purchase endpoint', async () => {
    const mockPurchase = {
      id: 'purchase-abc',
      voucherId: 'voucher-123',
      qrCode: 'fetched-qr-code',
      voucherCode: '11111 - 22222',
      voucherName: '4-day voucher',
      status: 'COMPLETED' as const,
    }
    mockedApi.get.mockResolvedValue(mockPurchase)

    // Render without qrCode param to trigger the fallback fetch
    await renderScreen({ qrCode: '', voucherCode: '', voucherName: '' })

    await waitFor(() => {
      expect(mockedApi.get).toHaveBeenCalledWith('/api/purchases/purchase-abc')
    })
  })
})

// ---------------------------------------------------------------------------
// Slice 7: Missing qrCode param → loading state then content
// ---------------------------------------------------------------------------

describe('Slice 7 — Missing qrCode fallback flow', () => {
  it('shows loading indicator while fetching when qrCode param is missing', async () => {
    // Delay the mock so we can assert the loading state
    mockedApi.get.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                id: 'purchase-abc',
                voucherId: 'voucher-123',
                qrCode: 'fetched-qr',
                voucherCode: '33333 - 44444',
                voucherName: '7-day voucher',
                status: 'COMPLETED' as const,
              }),
            500,
          ),
        ),
    )

    const { getByTestId } = await renderScreen({ qrCode: '', voucherCode: '', voucherName: '' })

    await waitFor(() => {
      expect(getByTestId('loading-indicator')).toBeTruthy()
    })
  })

  it('shows error state if qrCode param missing and fetch fails', async () => {
    mockedApi.get.mockRejectedValue(new Error('Network error'))

    const { getByTestId } = await renderScreen({ qrCode: '', voucherCode: '', voucherName: '' })

    await waitFor(() => {
      expect(getByTestId('error-message')).toBeTruthy()
    })
  })
})
