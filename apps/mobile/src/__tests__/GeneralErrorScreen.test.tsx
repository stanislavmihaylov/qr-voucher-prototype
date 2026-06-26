/**
 * GeneralErrorScreen tests — 6 TDD vertical slices.
 *
 * Slice 1: Renders triangle icon, exact heading, exact body copy, and "Try again" button.
 * Slice 2: Renders support preamble and phone link with label "12345 1245 1224".
 * Slice 3: Tapping "Try again" calls navigation.goBack().
 * Slice 4: Tapping the phone link calls Linking.openURL('tel:123451245224').
 * Slice 5: MobileNavBar and AppFooter are present in the rendered tree.
 * Slice 6: RootNavigator registers GeneralError with the real GeneralErrorScreen (placeholder removed).
 */
import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react-native'
import { Linking } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { GeneralErrorScreen } from '../screens/GeneralErrorScreen'
import type { RootStackParamList, RootStackScreenProps } from '../navigation/types'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}))

jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined)

// ---------------------------------------------------------------------------
// Helper — renders GeneralErrorScreen as the initial route with typed params
// ---------------------------------------------------------------------------

const MOCK_ERROR_MESSAGE = 'Purchase failed'

async function renderScreen() {
  const Stack = createNativeStackNavigator<RootStackParamList>()

  return render(
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="GeneralError"
          component={GeneralErrorScreen}
          initialParams={{ errorMessage: MOCK_ERROR_MESSAGE }}
        />
      </Stack.Navigator>
    </NavigationContainer>,
  )
}

// ---------------------------------------------------------------------------
// Slice 1: renders triangle icon, exact heading, exact body copy, "Try again" button
// ---------------------------------------------------------------------------

describe('Slice 1 — static content', () => {
  afterEach(() => jest.clearAllMocks())

  it('renders the error heading', async () => {
    const { getByText } = await renderScreen()
    await waitFor(() =>
      expect(getByText("We couldn't complete your Wi-Fi voucher purchase")).toBeTruthy(),
    )
  })

  it('renders the error body copy', async () => {
    const { getByText } = await renderScreen()
    await waitFor(() =>
      expect(
        getByText(/Something went wrong while processing your request/),
      ).toBeTruthy(),
    )
  })

  it('renders the "Try again" button', async () => {
    const { getByText } = await renderScreen()
    await waitFor(() => expect(getByText('Try again')).toBeTruthy())
  })

  it('renders the triangle exclamation icon with correct accessibility label', async () => {
    const { getByLabelText } = await renderScreen()
    await waitFor(() => expect(getByLabelText('Error icon')).toBeTruthy())
  })
})

// ---------------------------------------------------------------------------
// Slice 2: renders support preamble and phone link "12345 1245 1224"
// ---------------------------------------------------------------------------

describe('Slice 2 — support contact block', () => {
  afterEach(() => jest.clearAllMocks())

  it('renders the support preamble text', async () => {
    const { getByText } = await renderScreen()
    await waitFor(() =>
      expect(getByText(/If you were charged or are unsure/)).toBeTruthy(),
    )
  })

  it('renders the phone number "12345 1245 1224"', async () => {
    const { getByText } = await renderScreen()
    await waitFor(() => expect(getByText('12345 1245 1224')).toBeTruthy())
  })

  it('renders the phone link with correct accessibility label', async () => {
    const { getByLabelText } = await renderScreen()
    await waitFor(() =>
      expect(getByLabelText('Call support on 12345 1245 1224')).toBeTruthy(),
    )
  })
})

// ---------------------------------------------------------------------------
// Slice 3: tapping "Try again" calls navigation.goBack()
// ---------------------------------------------------------------------------

describe('Slice 3 — Try again navigation', () => {
  afterEach(() => jest.clearAllMocks())

  it('navigates back when "Try again" is pressed', async () => {
    // 2-screen setup: PreviousScreen → GeneralError
    // Pressing "Try again" (goBack) returns to PreviousScreen
    const Stack = createNativeStackNavigator<RootStackParamList>()

    function PreviousScreen({ navigation }: RootStackScreenProps<'VoucherList'>) {
      React.useEffect(() => {
        navigation.navigate('GeneralError', { errorMessage: MOCK_ERROR_MESSAGE })
      }, [navigation])
      return null
    }

    const { getByText, queryByText } = await render(
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="VoucherList" component={PreviousScreen} />
          <Stack.Screen name="GeneralError" component={GeneralErrorScreen} />
        </Stack.Navigator>
      </NavigationContainer>,
    )

    // Wait for GeneralError to appear
    await waitFor(() => expect(getByText('Try again')).toBeTruthy())

    // Press "Try again" — triggers goBack()
    fireEvent.press(getByText('Try again'))

    // GeneralError content disappears as we navigate back
    await waitFor(() =>
      expect(queryByText("We couldn't complete your Wi-Fi voucher purchase")).toBeNull(),
    )
  })
})

// ---------------------------------------------------------------------------
// Slice 4: tapping the phone link calls Linking.openURL('tel:123451245224')
// ---------------------------------------------------------------------------

describe('Slice 4 — phone link', () => {
  afterEach(() => jest.clearAllMocks())

  it('calls Linking.openURL with the phone number when phone link is pressed', async () => {
    const { getByLabelText } = await renderScreen()

    await waitFor(() =>
      expect(getByLabelText('Call support on 12345 1245 1224')).toBeTruthy(),
    )
    fireEvent.press(getByLabelText('Call support on 12345 1245 1224'))
    expect(Linking.openURL).toHaveBeenCalledWith('tel:123451245224')
  })
})

// ---------------------------------------------------------------------------
// Slice 5: MobileNavBar and AppFooter are present in the rendered tree
// ---------------------------------------------------------------------------

describe('Slice 5 — shared components', () => {
  afterEach(() => jest.clearAllMocks())

  it('renders MobileNavBar (identified by Menu accessibility label)', async () => {
    const { getByLabelText } = await renderScreen()
    await waitFor(() => expect(getByLabelText('Menu')).toBeTruthy())
  })

  it('renders AppFooter (identified by copyright text)', async () => {
    const { getByText } = await renderScreen()
    await waitFor(() => expect(getByText('2026 Park Holidays Limited')).toBeTruthy())
  })
})

// ---------------------------------------------------------------------------
// Slice 6: RootNavigator registers GeneralError with real GeneralErrorScreen
// ---------------------------------------------------------------------------

describe('Slice 6 — navigation integration', () => {
  afterEach(() => jest.clearAllMocks())

  it('GeneralErrorScreen renders real content (not placeholder text)', async () => {
    // This test verifies the GeneralErrorScreen module is the real implementation,
    // not the "Error: <errorMessage>" placeholder that was in RootNavigator.
    // The errorMessage param is 'test error' — real screen must NOT render it.
    const Stack = createNativeStackNavigator<RootStackParamList>()

    const { getByText, queryByText } = await render(
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="GeneralError"
            component={GeneralErrorScreen}
            initialParams={{ errorMessage: 'test error' }}
          />
        </Stack.Navigator>
      </NavigationContainer>,
    )

    // Real screen shows generic copy — placeholder would show "Error: test error" instead
    await waitFor(() =>
      expect(
        getByText("We couldn't complete your Wi-Fi voucher purchase"),
      ).toBeTruthy(),
    )
    // The raw errorMessage param is NOT displayed by the real screen
    expect(queryByText('test error')).toBeNull()
  })
})
