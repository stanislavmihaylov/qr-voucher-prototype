/**
 * VoucherListScreen layout tests — web-support Slice 3.
 *
 * Asserts that the navy chrome components (MobileNavBar, StepBarHeader, AppFooter)
 * render as full-width siblings and the content area is wrapped in WebContentFrame
 * (which applies the 480 px max-width on web viewports).
 */
import React from 'react'
import { render } from '@testing-library/react-native'
import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { VoucherListScreen } from '../screens/VoucherListScreen'
import { api } from '../lib/api'

jest.mock('../lib/api')

const mockedApi = api as jest.Mocked<typeof api>

// ---------------------------------------------------------------------------
// Mock chrome components so we can detect them by testID
// ---------------------------------------------------------------------------
jest.mock('../components/MobileNavBar', () => ({
  MobileNavBar: () => {
    const { View } = require('react-native')
    return <View testID="mock-nav-bar" />
  },
}))
jest.mock('../components/StepBarHeader', () => ({
  StepBarHeader: () => {
    const { View } = require('react-native')
    return <View testID="mock-step-header" />
  },
}))
jest.mock('../components/AppFooter', () => ({
  AppFooter: () => {
    const { View } = require('react-native')
    return <View testID="mock-app-footer" />
  },
}))

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
}

async function renderScreen() {
  mockedApi.get.mockResolvedValue([])
  return render(
    <QueryClientProvider client={makeQueryClient()}>
      <NavigationContainer>
        <VoucherListScreen />
      </NavigationContainer>
    </QueryClientProvider>,
  )
}

describe('VoucherListScreen layout — web-support', () => {
  afterEach(() => jest.clearAllMocks())

  it('renders the content area inside a WebContentFrame (testID web-content-frame)', async () => {
    const { getByTestId } = await renderScreen()
    expect(getByTestId('web-content-frame')).toBeTruthy()
  })

  it('MobileNavBar is NOT a descendant of web-content-frame', async () => {
    const { getByTestId } = await renderScreen()
    const frame = getByTestId('web-content-frame')
    const navBar = getByTestId('mock-nav-bar')
    // The nav bar must NOT be inside the content frame
    expect(frame).not.toContainElement(navBar)
  })

  it('AppFooter is NOT a descendant of web-content-frame', async () => {
    const { getByTestId } = await renderScreen()
    const frame = getByTestId('web-content-frame')
    const footer = getByTestId('mock-app-footer')
    expect(frame).not.toContainElement(footer)
  })

  it('StepBarHeader is NOT a descendant of web-content-frame', async () => {
    const { getByTestId } = await renderScreen()
    const frame = getByTestId('web-content-frame')
    const stepHeader = getByTestId('mock-step-header')
    expect(frame).not.toContainElement(stepHeader)
  })
})
