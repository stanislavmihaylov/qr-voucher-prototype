/**
 * Toast — animated success banner that auto-dismisses.
 *
 * Design spec (node 2:1481):
 *   Absolutely positioned at top of screen, y ≈ 37, x: 10, width: 355
 *   backgroundColor: #037C08, borderRadius: 4, padding: 16
 *   Text: Label/md (Inter 16/20 SemiBold), color: #FFFFFF
 *
 * Behaviour:
 *   - Mounts fully opaque (opacity: 1)
 *   - After `delay` ms, fades to opacity 0 via Animated.timing
 *   - pointerEvents="none" so it never blocks underlying UI after fade begins
 *   - accessibilityLiveRegion="polite" so screen readers announce it on mount
 */
import React, { useEffect, useRef } from 'react'
import { Animated, Text, StyleSheet } from 'react-native'

interface ToastProps {
  /** The message text to display. */
  message: string
  /**
   * Delay in ms before the fade-out animation begins.
   * Defaults to 3000 ms per design spec.
   */
  delay?: number
  /**
   * Duration of the fade-out animation in ms.
   * Defaults to 400 ms.
   */
  fadeDuration?: number
}

export function Toast({ message, delay = 3000, fadeDuration = 400 }: ToastProps) {
  const opacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: fadeDuration,
        useNativeDriver: true,
      }).start()
    }, delay)

    return () => clearTimeout(timer)
  }, [delay, fadeDuration, opacity])

  return (
    <Animated.View
      testID="toast"
      style={[styles.container, { opacity }]}
      pointerEvents="none"
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 37,
    left: 10,
    width: 355,
    backgroundColor: '#037C08',
    borderRadius: 4,
    padding: 16,
    zIndex: 100,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 20,
  },
})
