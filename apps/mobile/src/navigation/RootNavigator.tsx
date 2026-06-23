import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { VoucherListScreen } from '../screens/VoucherListScreen'
import { BillingFormScreen } from '../screens/BillingFormScreen'
import { QRCodeScreen } from '../screens/QRCodeScreen'
import { GeneralErrorScreen } from '../screens/GeneralErrorScreen'
import type { RootStackParamList } from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()

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
      <Stack.Screen name="GeneralError" component={GeneralErrorScreen} />
    </Stack.Navigator>
  )
}
