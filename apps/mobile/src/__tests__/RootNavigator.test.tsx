/**
 * RootNavigator tests — web-support feature.
 *
 * Slice 1: Renders without crashing and all four screens are registered.
 * Slice 2: The navigator frame is FULL-WIDTH at every viewport size — the 480 px
 *          maxWidth constraint has been moved into WebContentFrame (per-screen).
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
// Slice 1 — smoke test: renders all four screens, no crash
// ---------------------------------------------------------------------------
describe('Slice 1 — full-width navigator', () => {
  it('renders without crashing', async () => {
    await expect(renderNavigator()).resolves.toBeDefined()
  })

  it('contains the app-frame View', async () => {
    const { getByTestId } = await renderNavigator()
    expect(getByTestId('app-frame')).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// Slice 2 — app-frame is FULL-WIDTH at every viewport size
//
// The 480 px maxWidth constraint is now in WebContentFrame (per-screen).
// The navigator frame must NOT constrain width at any viewport size.
// ---------------------------------------------------------------------------
describe('Slice 2 — app-frame has no maxWidth at any viewport size', () => {
  afterEach(() => jest.restoreAllMocks())

  it('does NOT apply maxWidth 480 on a wide (>520) viewport', async () => {
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({ width: 1440, height: 900, scale: 1, fontScale: 1 })

    const { getByTestId } = await renderNavigator()
    expect(getByTestId('app-frame')).not.toHaveStyle({ maxWidth: 480 })
  })

  it('does NOT apply maxWidth 480 on a mobile (<=520) viewport', async () => {
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({ width: 390, height: 844, scale: 1, fontScale: 1 })

    const { getByTestId } = await renderNavigator()
    expect(getByTestId('app-frame')).not.toHaveStyle({ maxWidth: 480 })
  })
})
