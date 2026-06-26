/**
 * WebContentFrame — centres content at 480 px mobile width on web.
 *
 * On viewports wider than 520 px (web / desktop), wraps children in a
 * 480 px max-width centred column so content aligns with the mobile
 * design intent while the chrome (MobileNavBar, AppFooter, etc.) remains
 * full-width as a direct sibling rendered outside this component.
 *
 * On native (or narrow web viewports ≤ 520 px) it is transparent — children
 * fill the full available width with no added constraint.
 *
 * Usage:
 *   <MobileNavBar />          ← full-width chrome
 *   <WebContentFrame style={styles.contentArea}>
 *     {content}               ← centred at 480 px on web
 *   </WebContentFrame>
 *   <AppFooter />             ← full-width chrome
 */
import React from 'react'
import { View, StyleSheet, useWindowDimensions } from 'react-native'
import type { ViewStyle, StyleProp } from 'react-native'

const WEB_BREAKPOINT = 520
const MOBILE_MAX_WIDTH = 480

interface WebContentFrameProps {
  children: React.ReactNode
  /** Optional additional styles merged onto the wrapper (e.g. backgroundColor, padding). */
  style?: StyleProp<ViewStyle>
  /** testID forwarded to the wrapper View — useful in tests. */
  testID?: string
}

export function WebContentFrame({ children, style, testID }: WebContentFrameProps) {
  const { width } = useWindowDimensions()
  const isWeb = width > WEB_BREAKPOINT

  return (
    <View
      testID={testID}
      style={[styles.base, isWeb && styles.webFrame, style]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
  },
  webFrame: {
    maxWidth: MOBILE_MAX_WIDTH,
    alignSelf: 'center',
  },
})
