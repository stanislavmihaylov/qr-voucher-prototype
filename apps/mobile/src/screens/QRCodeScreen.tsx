/**
 * QRCodeScreen — terminal screen shown after a successful purchase.
 *
 * Design spec (nodes 2:1481, 2:1512):
 *   Background: #03135E (navy)
 *   Displays a scannable QR code, formatted voucher code, copy + share actions.
 *   Green toast auto-dismisses on mount (~3 s).
 *   No back navigation — reached via navigation.replace; gestureEnabled: false.
 *
 * Layout (top → bottom):
 *   SafeAreaView edges=['top']
 *     StatusBar light-content
 *     MobileNavBar (navy, no cart/bell)
 *     ScrollView (navy bg)
 *       Container (paddingH: 16, paddingV: 28, gap: 48)
 *         Heading "Connect more devices"
 *         VoucherCard (white, borderRadius: 12)
 *           WifiIcon 56×56
 *           "Your {voucherName} code" (H5)
 *           "Scan the QR code…" (H4)
 *           QRCode 256×256
 *           "You can also connect…" (H5)
 *           voucherCode text (H4)
 *           "Copy code" button (outline)
 *           "Send code" button (fill)
 *     AppFooter
 *   Toast (absolute, top 37, fades after 3 s)
 */
import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import * as Clipboard from 'expo-clipboard'
import QRCode from 'react-native-qrcode-svg'
import type { RootStackScreenProps } from '../navigation/types'
import { MobileNavBar } from '../components/MobileNavBar'
import { AppFooter } from '../components/AppFooter'
import { Toast } from '../components/qr-code/Toast'
import { usePurchase } from '../hooks/usePurchaseQueries'
import WifiIcon from '../../assets/features/qr-code/icon-wifi.svg'
import CopyIcon from '../../assets/features/qr-code/icon-copy.svg'

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export function QRCodeScreen({ route }: RootStackScreenProps<'QRCode'>) {
  const { purchaseId, qrCode, voucherCode, voucherName } = route.params

  // Edge-case fallback: if qrCode param is missing, fetch from API
  const needsFetch = !qrCode
  const { data: fetchedPurchase, isLoading: isFetching, isError: fetchError } = usePurchase(
    needsFetch ? purchaseId : '',
  )

  const resolvedQrCode = qrCode || fetchedPurchase?.qrCode || ''
  const resolvedVoucherCode = voucherCode || fetchedPurchase?.voucherCode || ''
  const resolvedVoucherName = voucherName || fetchedPurchase?.voucherName || ''

  // Copy button label state
  const [copyLabel, setCopyLabel] = useState<'Copy code' | 'Copied!'>('Copy code')

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleCopy = useCallback(async () => {
    await Clipboard.setStringAsync(resolvedVoucherCode)
    setCopyLabel('Copied!')
    setTimeout(() => setCopyLabel('Copy code'), 1500)
  }, [resolvedVoucherCode])

  const handleSend = useCallback(async () => {
    try {
      await Share.share({ message: resolvedVoucherCode })
    } catch {
      // Web Share API unavailable (desktop browsers without HTTPS, or unsupported browser).
      // Fall back to clipboard copy with the same "Copied!" feedback.
      await Clipboard.setStringAsync(resolvedVoucherCode)
      setCopyLabel('Copied!')
      setTimeout(() => setCopyLabel('Copy code'), 1500)
    }
  }, [resolvedVoucherCode])

  // ---------------------------------------------------------------------------
  // Edge-case states
  // ---------------------------------------------------------------------------

  if (needsFetch && isFetching) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <StatusBar style="light" />
        <MobileNavBar />
        <View style={styles.loadingContainer}>
          <ActivityIndicator testID="loading-indicator" size="large" color="#FFFFFF" />
          <View testID="qr-skeleton" style={styles.qrSkeleton} />
        </View>
      </SafeAreaView>
    )
  }

  if (needsFetch && (fetchError || !fetchedPurchase)) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <StatusBar style="light" />
        <MobileNavBar />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText} testID="error-message">
            Unable to load your voucher. Please try again.
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  // ---------------------------------------------------------------------------
  // Happy path render
  // ---------------------------------------------------------------------------

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar style="light" />
      <MobileNavBar />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        bounces={Platform.OS === 'ios'}
        overScrollMode={Platform.OS === 'android' ? 'never' : undefined}
      >
        {/* Screen heading */}
        <Text style={styles.heading}>Connect more devices</Text>

        {/* Voucher card */}
        <View style={styles.card}>
          {/* Wifi icon + voucher name */}
          <View style={styles.cardHeader}>
            <WifiIcon width={56} height={56} />
            <Text style={styles.voucherNameLabel}>
              Your {resolvedVoucherName} code
            </Text>
          </View>

          {/* Instructional text */}
          <Text style={styles.instructionText}>
            Scan the QR code with the device you'd like to connect.
          </Text>

          {/* QR code */}
          <View
            testID="qr-code-container"
            accessibilityLabel="QR code for your Wi-Fi voucher"
            accessibilityRole="image"
          >
            <QRCode value={resolvedQrCode || ' '} size={256} />
          </View>

          {/* Fallback label */}
          <Text style={styles.fallbackLabel}>
            You can also connect using your voucher code.
          </Text>

          {/* Voucher code */}
          <Text
            testID="voucher-code"
            style={styles.voucherCode}
            accessibilityLabel={`Voucher code: ${resolvedVoucherCode}`}
          >
            {resolvedVoucherCode}
          </Text>

          {/* Copy code button */}
          <TouchableOpacity
            testID="copy-button"
            style={styles.outlineButton}
            onPress={handleCopy}
            accessibilityRole="button"
            accessibilityLabel="Copy voucher code to clipboard"
          >
            <CopyIcon width={24} height={24} />
            <Text style={styles.outlineButtonLabel}>{copyLabel}</Text>
          </TouchableOpacity>

          {/* Send code button */}
          <TouchableOpacity
            testID="send-button"
            style={styles.fillButton}
            onPress={handleSend}
            accessibilityRole="button"
            accessibilityLabel="Share voucher code"
          >
            <Text style={styles.fillButtonLabel}>Send code</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <AppFooter />
      </ScrollView>

      {/* Success toast — auto-dismisses after ~3 s */}
      <Toast message="Your Wi-Fi code is active on your device" />
    </SafeAreaView>
  )
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#03135E',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#03135E',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 28,
    gap: 48,
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 28,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    gap: 16,
    alignItems: 'center',
    width: 343,
    alignSelf: 'center',
  },
  cardHeader: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
  },
  voucherNameLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#020D42',
    lineHeight: 24,
  },
  instructionText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#020D42',
    lineHeight: 28,
    width: '100%',
  },
  fallbackLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#020D42',
    lineHeight: 24,
    width: '100%',
  },
  voucherCode: {
    fontSize: 24,
    fontWeight: '600',
    color: '#020D42',
    lineHeight: 28,
    width: '100%',
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: '#03135E',
    borderRadius: 9999,
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 44,
  },
  outlineButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#020D42',
    lineHeight: 20,
  },
  fillButton: {
    width: '100%',
    backgroundColor: '#03135E',
    borderRadius: 9999,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  fillButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  qrSkeleton: {
    width: 256,
    height: 256,
    backgroundColor: '#4A5568',
    borderRadius: 8,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
  },
})
