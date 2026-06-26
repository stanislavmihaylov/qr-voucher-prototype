import React from 'react'
import { View, StyleSheet } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { VoucherListScreen } from '../screens/VoucherListScreen'
import { BillingFormScreen } from '../screens/BillingFormScreen'
import { QRCodeScreen } from '../screens/QRCodeScreen'
import { GeneralErrorScreen } from '../screens/GeneralErrorScreen'
import type { RootStackParamList } from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()

/**
 * RootNavigator — full-width app shell.
 *
 * The 480 px maxWidth centering constraint has moved into `WebContentFrame`
 * (apps/mobile/src/components/ui/WebContentFrame.tsx) so that the navy
 * chrome (MobileNavBar, StepBarHeader, AppFooter) spans the full viewport
 * on web while only the screen content area is centred at mobile width.
 */
export function RootNavigator() {
  return (
    <View style={styles.root} testID="app-frame">
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="VoucherList" component={VoucherListScreen} />
        <Stack.Screen name="Billing" component={BillingFormScreen} />
        {/* QRCode is a terminal screen — swipe-back gesture disabled */}
        <Stack.Screen
          name="QRCode"
          component={QRCodeScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="GeneralError" component={GeneralErrorScreen} />
      </Stack.Navigator>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#03135e',
  },
})
