/**
 * GeneralErrorScreen — shown when purchase creation fails.
 *
 * Design spec: docs/blueprint/flows/error.md  (node 2:1411)
 *
 * Layout (top → bottom):
 *   SafeAreaView (edges: top, bg: #03135e)
 *   MobileNavBar (48px, navy)
 *   ScrollView (flex 1, bg: #EDF8FE)
 *     Error messaging block: icon + heading + body + "Try again" CTA
 *     Contact support block: preamble + PhoneLink (icon + underlined number)
 *   AppFooter (182px, navy)
 */
import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { MobileNavBar } from '../components/MobileNavBar'
import { AppFooter } from '../components/AppFooter'
import TriangleExclamationSvg from '../../assets/features/error/icon-triangle-exclamation.svg'
import PhoneSvg from '../../assets/features/error/icon-phone.svg'
import type { RootStackScreenProps } from '../navigation/types'

export function GeneralErrorScreen({ navigation }: RootStackScreenProps<'GeneralError'>) {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar style="light" />

      {/* Top navigation bar */}
      <MobileNavBar />

      {/* Scrollable content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {/* ---- Error messaging block ---- */}
        <View style={styles.errorBlock}>
          {/* Triangle exclamation icon — wrapping View carries accessibility props
              because the SVG mock in jest strips non-standard props */}
          <View
            accessibilityRole="image"
            accessibilityLabel="Error icon"
            style={styles.iconWrapper}
          >
            <TriangleExclamationSvg width={48} height={48} />
          </View>

          {/* Heading */}
          <Text
            style={styles.heading}
            accessibilityLiveRegion="polite"
          >
            {"We couldn't complete your Wi-Fi voucher purchase"}
          </Text>

          {/* Body copy */}
          <Text style={styles.body}>
            {'Something went wrong while processing your request. \nYour Wi-Fi voucher has not been issued yet. Please try again, or contact support if the problem continues.'}
          </Text>

          {/* "Try again" CTA */}
          <TouchableOpacity
            style={styles.tryAgainButton}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Try again"
          >
            <Text style={styles.tryAgainLabel}>Try again</Text>
          </TouchableOpacity>
        </View>

        {/* ---- Contact support block ---- */}
        <View style={styles.supportBlock}>
          {/* Preamble */}
          <Text style={styles.supportPreamble}>
            {'If you were charged or are unsure, please contact support before trying again. \nContact us on:'}
          </Text>

          {/* PhoneLink — inline: icon + underlined number */}
          <TouchableOpacity
            style={styles.phoneLink}
            onPress={() => Linking.openURL('tel:123451245224')}
            accessibilityRole="link"
            accessibilityLabel="Call support on 12345 1245 1224"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <PhoneSvg width={20} height={20} />
            <View style={styles.phoneLabelColumn}>
              <Text style={styles.phoneNumber}>12345 1245 1224</Text>
              <View style={styles.phoneUnderline} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <AppFooter />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#03135e',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: '#EDF8FE',
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 16,
    gap: 48,
    flexGrow: 1,
  },
  // Error messaging block
  errorBlock: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    gap: 32,
  },
  heading: {
    fontFamily: 'Inter',
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 32,
    color: '#020D42',
    width: 275,
    textAlign: 'left',
  },
  body: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 24,
    color: '#020D42',
    alignSelf: 'stretch',
  },
  tryAgainButton: {
    alignSelf: 'stretch',
    backgroundColor: '#03135E',
    borderRadius: 9999,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    alignSelf: 'flex-start',
  },
  tryAgainLabel: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 20,
  },
  // Contact support block
  supportBlock: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    gap: 16,
  },
  supportPreamble: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 20,
    color: '#020D42',
  },
  phoneLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    alignSelf: 'flex-start',
  },
  phoneLabelColumn: {
    flexDirection: 'column',
    gap: 2,
  },
  phoneNumber: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    color: '#020D42',
    lineHeight: 20,
  },
  phoneUnderline: {
    height: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#8189AF',
    alignSelf: 'stretch',
  },
})
