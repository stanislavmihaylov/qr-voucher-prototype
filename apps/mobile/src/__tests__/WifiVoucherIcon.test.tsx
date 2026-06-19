import React from 'react'
import { render } from '@testing-library/react-native'
import { WifiVoucherIcon } from '../components/voucher/WifiVoucherIcon'

describe('WifiVoucherIcon', () => {
  // --- Slice 3: dynamic number in circle ---

  it('renders the durationDays number as text', async () => {
    const { getByText } = await render(<WifiVoucherIcon durationDays={10} />)
    expect(getByText('10')).toBeTruthy()
  })

  it('renders different day numbers dynamically', async () => {
    const { getByText } = await render(<WifiVoucherIcon durationDays={3} />)
    expect(getByText('3')).toBeTruthy()
  })

  it('renders without error for any valid durationDays', async () => {
    const result = await render(<WifiVoucherIcon durationDays={7} />)
    expect(result).toBeTruthy()
    const { getByText } = result
    expect(getByText('7')).toBeTruthy()
  })

  // --- Slice 2: waves-only SVG rendering ---

  it('renders the wifi waves SVG element (testID wifi-waves-svg)', async () => {
    const { getByTestId } = await render(<WifiVoucherIcon durationDays={1} />)
    // The waves-only SVG asset must be present (mocked as a View with testID)
    expect(getByTestId('wifi-waves-svg')).toBeTruthy()
  })

  it('does not display a baked-in static "1" alongside the dynamic number', async () => {
    // When durationDays=4, only "4" should appear — not "1" from the old baked-in SVG
    const { getByText, queryAllByText } = await render(
      <WifiVoucherIcon durationDays={4} />,
    )
    // The dynamic number must be present
    expect(getByText('4')).toBeTruthy()
    // The baked-in "1" must NOT appear as a separate Text element
    expect(queryAllByText('1').length).toBe(0)
  })
})
