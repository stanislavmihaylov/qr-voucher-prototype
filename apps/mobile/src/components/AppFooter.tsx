/**
 * AppFooter — bottom footer shown on all screens.
 *
 * Design spec (node 2:1399):
 *   backgroundColor: '#03135e'
 *   paddingHorizontal: 48, paddingVertical: 24
 *   height: 182 (fixed)
 *   gap: 32 between LinkContent block and SocialRow
 *
 *   SocialRow: fb, yt, fb, yt — four icons, two pairs (design intent)
 */
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import FacebookSvg from '../../assets/features/voucher-selection/icon-facebook.svg'
import YoutubeSvg from '../../assets/features/voucher-selection/icon-youtube.svg'

export function AppFooter() {
  return (
    <View style={styles.container}>
      {/* Link content */}
      <View style={styles.linkContent}>
        <Text style={styles.copyright}>2026 Park Holidays Limited</Text>

        <TouchableOpacity
          onPress={() => {/* no-op — prototype */}}
          accessibilityRole="button"
          accessibilityLabel="Terms and conditions"
        >
          <Text style={styles.link}>Terms &amp; conditions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {/* no-op — prototype */}}
          accessibilityRole="button"
          accessibilityLabel="Privacy policy"
        >
          <Text style={styles.link}>Privacy</Text>
        </TouchableOpacity>
      </View>

      {/* Social row — fb, yt, fb, yt (design shows two pairs) */}
      <View style={styles.socialRow}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Facebook">
          <FacebookSvg width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="YouTube">
          <YoutubeSvg width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Facebook">
          <FacebookSvg width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="YouTube">
          <YoutubeSvg width={24} height={24} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#03135e',
    paddingHorizontal: 48,
    paddingVertical: 24,
    height: 182,
    flexDirection: 'column',
    gap: 32,
  },
  linkContent: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
  },
  copyright: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 18,
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 18,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
})
