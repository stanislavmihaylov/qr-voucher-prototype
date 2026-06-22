/**
 * MobileNavBar — top navigation bar shown on all screens.
 *
 * Design spec (node 2:1410):
 *   backgroundColor: '#03135e', height: 48, paddingHorizontal: 16
 *   Left cluster: hamburger icon → Park Holidays logo → divider → Park Leisure logo
 *   Right cluster: empty View (no actions in prototype)
 *
 * logo-park-holidays.svg and logo-park-leisure.svg are reconstructed from Figma nodes:
 *   I2:1410;1841:84723  (Park Holidays wordmark)
 *   I2:1410;6169:130133 (Park Leisure logo)
 */
import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import MenuSvg from '../../assets/features/voucher-selection/icon-menu.svg'
import ParkHolidaysLogo from '../../assets/features/voucher-selection/logo-park-holidays.svg'
import ParkLeisureLogo from '../../assets/features/voucher-selection/logo-park-leisure.svg'

export function MobileNavBar() {
  return (
    <View style={styles.container}>
      {/* Left cluster */}
      <View style={styles.leftCluster}>
        <TouchableOpacity
          onPress={() => {/* no-op — prototype */}}
          accessibilityRole="button"
          accessibilityLabel="Menu"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MenuSvg width={24} height={24} />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <ParkHolidaysLogo width={75} height={24} />
        </View>

        <View style={styles.divider} />

        <View style={styles.leisureContainer}>
          <ParkLeisureLogo width={100} height={33} />
        </View>
      </View>

      {/* Right cluster — empty (no actions in prototype) */}
      <View style={styles.rightCluster} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    backgroundColor: '#03135e',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    height: 24,
    width: 75,
    borderRadius: 8,
    overflow: 'hidden',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#ffffff',
  },
  leisureContainer: {
    height: 33,
    width: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  rightCluster: {
    width: 88,
    height: 36,
  },
})
