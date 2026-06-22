/**
 * WifiVoucherIcon
 *
 * Renders the wifi signal waves SVG (waves-only, no baked-in day number) with a
 * dynamic numbered circle drawn as a React Native View + Text. This means the
 * circle always shows the correct durationDays value from the API for any
 * package (1, 4, 7, 10 days, etc.).
 *
 * Layout matches the original Figma design (node 2:1395/1396/1397):
 *   - Outer container: 85×77 (viewBox of the original asset)
 *   - Waves SVG: full 85×77, upper-right arcs
 *   - Numbered circle: 40×40, positioned bottom-left at (4, 33) — matching
 *     the original circle center of (24, 53) with radius 20 in the Figma asset
 *
 * Size: 85×77 — matches Figma spec for WifiVoucherCard icon area.
 */
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import WifiWavesSvg from '../../../assets/features/voucher-selection/icon-wifi-waves.svg'

interface WifiVoucherIconProps {
  durationDays: number
}

export function WifiVoucherIcon({ durationDays }: WifiVoucherIconProps) {
  return (
    <View
      testID="wifi-voucher-icon"
      accessibilityLabel={`${durationDays} day Wi-Fi icon`}
      style={styles.container}
    >
      {/* Waves-only SVG — no baked-in number */}
      <WifiWavesSvg testID="wifi-waves-svg" width={85} height={77} />

      {/* Dynamic numbered circle — positioned to match the original Figma circle location.
          Circle center in Figma: (24, 53) with radius 20
          → left: 24 - 20 = 4, top: 53 - 20 = 33, size: 40×40 */}
      <View style={styles.circle}>
        <Text style={styles.number} accessibilityLabel={`${durationDays} day icon`}>
          {durationDays}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 85,
    height: 77,
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    left: 4,
    top: 33,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 4,
    borderColor: '#03135e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: 22,
    fontWeight: '700',
    color: '#03135e',
    textAlign: 'center',
    includeFontPadding: false,
  },
})
