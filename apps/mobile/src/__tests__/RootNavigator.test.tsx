/**
 * RootNavigator tests — web-support feature.
 *
 * Slice 1: Renders without crashing and the centred app-frame View is present.
 * Slice 2: Applies webFrame (maxWidth 480) when width > 520, not when width <= 520.
 */
import React from 'react'
import { render } from '@testing-library/react-native'
import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RootNavigator } from '../navigation/RootNavigator'

// ---------------------------------------------------------------------------
// Mock all screen components — we're testing the navigator wrapper, not screens.
// Returning null is valid React; factories are hoisted and can't reference imports.
// ---------------------------------------------------------------------------
jest.mock('../screens/VoucherListScreen', () => ({
  VoucherListScreen: () => null,
}))
jest.mock('../screens/BillingFormScreen', () => ({
  BillingFormScreen: () => null,
}))
jest.mock('../screens/QRCodeScreen', () => ({
  QRCodeScreen: () => null,
}))
jest.mock('../screens/GeneralErrorScreen', () => ({
  GeneralErrorScreen: () => null,
}))
jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}))

// ---------------------------------------------------------------------------
// Helper — async because RNTL v14 render() returns Promise<RenderResult>
// ---------------------------------------------------------------------------
function makeQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } })
}

async function renderNavigator() {
  return render(
    <QueryClientProvider client={makeQueryClient()}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </QueryClientProvider>,
  )
}

// ---------------------------------------------------------------------------
// Slice 1 — smoke test: renders the centred frame wrapper
// ---------------------------------------------------------------------------
describe('Slice 1 — centred frame wrapper', () => {
  it('renders without crashing', async () => {
    await expect(renderNavigator()).resolves.toBeDefined()
  })

  it('contains the app-frame View', async () => {
    const { getByTestId } = await renderNavigator()
    expect(getByTestId('app-frame')).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// Slice 2 — webFrame conditional styling
// ---------------------------------------------------------------------------
describe('Slice 2 — webFrame conditional styling', () => {
  afterEach(() => jest.restoreAllMocks())

  it('applies maxWidth 480 when viewport width > 520', async () => {
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({ width: 600, height: 900, scale: 1, fontScale: 1 })

    const { getByTestId } = await renderNavigator()
    expect(getByTestId('app-frame')).toHaveStyle({ maxWidth: 480 })
  })

  it('does NOT apply maxWidth when viewport width <= 520', async () => {
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({ width: 390, height: 844, scale: 1, fontScale: 1 })

    const { getByTestId } = await renderNavigator()
    expect(getByTestId('app-frame')).not.toHaveStyle({ maxWidth: 480 })
  })
})
