/**
 * WifiVoucherIcon
 *
 * Renders the wifi base SVG asset with the duration number overlaid as a Text
 * element. This ensures the icon is always correct for any durationDays value
 * (including 3/5/10-day which have no dedicated Figma asset).
 *
 * Size: 85×77 — matches Figma spec for WifiVoucherCard icon area.
 */
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import WiFiBaseSvg from '../../../assets/features/voucher-selection/icon-wifi-1day.svg'

interface WifiVoucherIconProps {
  durationDays: number
}

export function WifiVoucherIcon({ durationDays }: WifiVoucherIconProps) {
  return (
    <View testID="wifi-voucher-icon" style={styles.container}>
      <WiFiBaseSvg width={85} height={77} />
      <Text style={styles.number} accessibilityLabel={`${durationDays} day icon`}>
        {durationDays}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 85,
    height: 77,
    position: 'relative',
  },
  number: {
    position: 'absolute',
    bottom: 6,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#03135e',
    lineHeight: 20,
  },
})
