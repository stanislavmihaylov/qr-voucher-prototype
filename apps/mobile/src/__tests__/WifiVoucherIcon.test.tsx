import React from 'react'
import { render } from '@testing-library/react-native'
import { WifiVoucherIcon } from '../components/voucher/WifiVoucherIcon'

describe('WifiVoucherIcon', () => {
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
})
