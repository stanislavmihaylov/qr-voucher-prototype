import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { VoucherListScreen } from '../screens/VoucherListScreen'
import type { RootStackParamList } from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()

/**
 * Placeholder for the Billing screen — implemented by a later feature agent.
 * Accepts the `voucherId` param so the navigator type is satisfied.
 */
function BillingPlaceholder() {
  return null
}

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VoucherList" component={VoucherListScreen} />
      <Stack.Screen name="Billing" component={BillingPlaceholder} />
    </Stack.Navigator>
  )
}
