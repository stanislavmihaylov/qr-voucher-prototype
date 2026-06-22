import React from 'react'
import { View, Text } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { VoucherListScreen } from '../screens/VoucherListScreen'
import { BillingFormScreen } from '../screens/BillingFormScreen'
import type { RootStackParamList } from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()

/**
 * Placeholder for the QR code screen — owned by the `qr-code` feature.
 * Registered here so billing navigation type-checks and runs in tests.
 */
function QRCodePlaceholder({ route }: any) {
  return (
    <View>
      <Text>QRCode screen — purchaseId: {route.params?.purchaseId}</Text>
    </View>
  )
}

/**
 * Placeholder for the general error screen — owned by the `error` feature.
 * Registered here so billing navigation type-checks and runs in tests.
 */
function GeneralErrorPlaceholder({ route }: any) {
  return (
    <View>
      <Text>Error: {route.params?.errorMessage}</Text>
    </View>
  )
}

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VoucherList" component={VoucherListScreen} />
      <Stack.Screen name="Billing" component={BillingFormScreen} />
      {/* Placeholders — these screens are implemented by later feature agents */}
      <Stack.Screen name="QRCode" component={QRCodePlaceholder} />
      <Stack.Screen name="GeneralError" component={GeneralErrorPlaceholder} />
    </Stack.Navigator>
  )
}
