/**
 * SkeletonCard — loading placeholder for a WifiVoucherCard.
 * Shown (×N) while TanStack Query fetches /api/vouchers.
 *
 * Design: white card, borderRadius:12, height:~220 (approx WifiVoucherCard height)
 */
import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet } from 'react-native'

interface SkeletonCardProps {
  height?: number
}

export function SkeletonCard({ height = 220 }: SkeletonCardProps) {
  const opacity = useRef(new Animated.Value(0.4)).current

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    )
    anim.start()
    return () => anim.stop()
  }, [opacity])

  return (
    <Animated.View
      testID="skeleton-card"
      style={[styles.card, { height }, { opacity }]}
    />
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '100%',
  },
})
