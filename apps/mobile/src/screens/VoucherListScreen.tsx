/**
 * VoucherListScreen — root screen of the Main Stack.
 *
 * Fetches all Wi-Fi voucher packages from GET /api/vouchers via TanStack Query
 * and renders one WifiVoucherCard per row. Tapping "Buy X-day voucher" stores
 * the selected voucher in Zustand and navigates to BillingFormScreen.
 *
 * Design spec: docs/blueprint/flows/voucher-selection.md
 *   Root: SafeAreaView (#03135e) → ScrollView
 *   Content area: backgroundColor '#edf8fe', paddingH 16, paddingV 28, gap 32
 */
import React from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { useVouchers } from '../hooks/useVoucherQueries'
import { useVoucherStore } from '../store/voucher.store'
import { WifiVoucherCard } from '../components/voucher/WifiVoucherCard'
import { SkeletonCard } from '../components/voucher/SkeletonCard'
import { MobileNavBar } from '../components/MobileNavBar'
import { StepBarHeader } from '../components/StepBarHeader'
import { AppFooter } from '../components/AppFooter'
import { EmptyState, ErrorMessage, WebContentFrame } from '../components/ui'
import type { RootStackParamList } from '../navigation/types'
import type { WifiVoucherResponse } from '@repo/types'

type Nav = NativeStackNavigationProp<RootStackParamList>

export function VoucherListScreen() {
  const navigation = useNavigation<Nav>()
  const { setSelectedVoucherId } = useVoucherStore()
  const { data: vouchers, status, error, refetch, isRefetching } = useVouchers()

  const handleSelect = (voucher: WifiVoucherResponse) => {
    setSelectedVoucherId(voucher.id)
    navigation.navigate('Billing', { voucherId: voucher.id })
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        bounces
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#ffffff"
          />
        }
      >
        <MobileNavBar />
        <StepBarHeader currentStep={1} title="Buy Wi-Fi access" />

        {/* Content area — centred at 480 px on web; full-width on native */}
        <WebContentFrame testID="web-content-frame" style={styles.contentArea}>
          <Text style={styles.introParagraph} accessibilityRole="text">
            Select a Wi-Fi package. Your access period begins when you complete your purchase.
          </Text>

          {/* Loading state — 3 skeleton cards */}
          {status === 'pending' && (
            <View style={styles.cardList} testID="loading-state">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </View>
          )}

          {/* Error state */}
          {status === 'error' && (
            <View testID="error-state">
              <ErrorMessage message={error?.message ?? 'Failed to load vouchers'} />
              <TouchableOpacity
                onPress={() => refetch()}
                style={styles.retryButton}
                accessibilityRole="button"
                accessibilityLabel="Retry loading vouchers"
                testID="retry-button"
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Empty state */}
          {status === 'success' && vouchers?.length === 0 && (
            <EmptyState
              title="No Wi-Fi packages available"
              description="Please try again later."
            />
          )}

          {/* Voucher cards */}
          {status === 'success' && vouchers && vouchers.length > 0 && (
            <View style={styles.cardList} testID="voucher-list">
              {vouchers.map((voucher) => (
                <WifiVoucherCard
                  key={voucher.id}
                  voucher={voucher}
                  onPress={() => handleSelect(voucher)}
                />
              ))}
            </View>
          )}
        </WebContentFrame>

        <AppFooter />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#03135e',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentArea: {
    backgroundColor: '#edf8fe',
    paddingHorizontal: 16,
    paddingVertical: 28,
    width: '100%',
    gap: 32,
  },
  introParagraph: {
    fontSize: 18,
    fontWeight: '400',
    color: '#020d42',
    lineHeight: 24,
  },
  cardList: {
    gap: 32,
  },
  retryButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#03135e',
    borderRadius: 9999,
    alignSelf: 'flex-start',
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
})
