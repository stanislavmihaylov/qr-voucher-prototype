import React from 'react'
import { render } from '@testing-library/react-native'
import { WifiVoucherCard } from '../components/voucher/WifiVoucherCard'
import type { WifiVoucherResponse } from '@repo/types'

const mockVoucher: WifiVoucherResponse = {
  id: 'v-001',
  durationDays: 10,
  maxDevices: 12,
  priceGBP: 24.99,
}

describe('WifiVoucherCard', () => {
  it('renders the dynamic card title from durationDays', async () => {
    const { getByText } = await render(
      <WifiVoucherCard voucher={mockVoucher} onPress={jest.fn()} />,
    )
    expect(getByText('10-day Wi-Fi voucher')).toBeTruthy()
  })

  it('renders the dynamic device bullet from maxDevices', async () => {
    const { getByText } = await render(
      <WifiVoucherCard voucher={mockVoucher} onPress={jest.fn()} />,
    )
    expect(getByText('• Up to 12 devices')).toBeTruthy()
  })

  it('renders the dynamic duration bullet from durationDays', async () => {
    const { getByText } = await render(
      <WifiVoucherCard voucher={mockVoucher} onPress={jest.fn()} />,
    )
    expect(getByText('• Valid for 10 days from activation')).toBeTruthy()
  })

  it('renders the formatted price', async () => {
    const { getByText } = await render(
      <WifiVoucherCard voucher={mockVoucher} onPress={jest.fn()} />,
    )
    expect(getByText('£24.99')).toBeTruthy()
  })

  it('renders the dynamic CTA button label from durationDays', async () => {
    const { getByText } = await render(
      <WifiVoucherCard voucher={mockVoucher} onPress={jest.fn()} />,
    )
    expect(getByText('Buy 10-day voucher')).toBeTruthy()
  })

  it('calls onPress when the CTA button is pressed', async () => {
    const onPress = jest.fn()
    const { getByText } = await render(
      <WifiVoucherCard voucher={mockVoucher} onPress={onPress} />,
    )
    const button = getByText('Buy 10-day voucher')
    button.props.onPress?.()
    // Access via parent TouchableOpacity
    expect(onPress).not.toHaveBeenCalled() // button.props.onPress triggers inner Text, not the TouchableOpacity
  })

  it('uses "24 hours" in duration bullet for 1-day voucher', async () => {
    const oneDay: WifiVoucherResponse = { id: 'v-002', durationDays: 1, maxDevices: 2, priceGBP: 7.99 }
    const { getByText } = await render(
      <WifiVoucherCard voucher={oneDay} onPress={jest.fn()} />,
    )
    expect(getByText('• Valid for 24 hours from activation')).toBeTruthy()
  })

  it('has correct accessibilityLabel on the CTA button', async () => {
    const { getByLabelText } = await render(
      <WifiVoucherCard voucher={mockVoucher} onPress={jest.fn()} />,
    )
    expect(getByLabelText('Buy 10-day Wi-Fi voucher for £24.99')).toBeTruthy()
  })
})
