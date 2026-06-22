/**
 * WifiVoucherCard
 *
 * Renders a single Wi-Fi voucher package. All display strings are derived
 * dynamically from `voucher.durationDays` and `voucher.maxDevices` — nothing
 * is hardcoded per package.
 *
 * Design spec: apps/mobile/docs/blueprint/flows/voucher-selection.md
 *   Card container: borderRadius:12, padding:24, gap:16 (content ↔ CTA)
 *   Content block: gap:12 (icon ↔ title ↔ detail)
 *   CTA: pill button (#03135e bg, borderRadius:9999, paddingV:12, paddingH:24, full-width)
 */
import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import type { WifiVoucherResponse } from '@repo/types'
import { WifiVoucherIcon } from './WifiVoucherIcon'
import {
  voucherName,
  deviceBullet,
  durationBullet,
  formatPrice,
  buyLabel,
} from '../../lib/voucherLabels'

interface WifiVoucherCardProps {
  voucher: WifiVoucherResponse
  onPress: () => void
  loading?: boolean
}

export function WifiVoucherCard({ voucher, onPress }: WifiVoucherCardProps) {
  const { durationDays, maxDevices, priceGBP } = voucher

  const name = voucherName(durationDays)
  const accessLabel = `Buy ${name} for ${formatPrice(priceGBP)}`
  const ctaLabel = buyLabel(durationDays)

  return (
    <View style={styles.card} accessibilityRole="none">
      {/* Content block */}
      <View style={styles.content}>
        <WifiVoucherIcon durationDays={durationDays} />

        <Text style={styles.name}>{name}</Text>

        <View style={styles.detail}>
          <Text style={styles.bullet}>{deviceBullet(maxDevices)}</Text>
          <Text style={styles.bullet}>{durationBullet(durationDays)}</Text>
          <Text style={styles.price}>{formatPrice(priceGBP)}</Text>
        </View>
      </View>

      {/* CTA button */}
      <TouchableOpacity
        style={styles.cta}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessLabel}
      >
        <View style={styles.ctaInner}>
          <Text style={styles.ctaLabel}>{ctaLabel}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    flexDirection: 'column',
    gap: 16,
  },
  content: {
    flexDirection: 'column',
    gap: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#020d42',
    lineHeight: 28,
  },
  detail: {
    flexDirection: 'column',
    gap: 4,
  },
  bullet: {
    fontSize: 16,
    fontWeight: '400',
    color: '#020d42',
    lineHeight: 20,
  },
  price: {
    fontSize: 28,
    fontWeight: '600',
    color: '#020d42',
    lineHeight: 32,
    marginTop: 4,
  },
  cta: {
    backgroundColor: '#03135e',
    borderRadius: 9999,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  ctaInner: {
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 20,
    textAlign: 'center',
  },
})
