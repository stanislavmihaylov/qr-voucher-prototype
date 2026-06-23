import React from 'react'
import { View, Text } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { VoucherListScreen } from '../screens/VoucherListScreen'
import { BillingFormScreen } from '../screens/BillingFormScreen'
import { QRCodeScreen } from '../screens/QRCodeScreen'
import type { RootStackParamList } from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()

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
      {/* QRCode is a terminal screen — swipe-back gesture disabled */}
      <Stack.Screen
        name="QRCode"
        component={QRCodeScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="GeneralError" component={GeneralErrorPlaceholder} />
    </Stack.Navigator>
  )
}
