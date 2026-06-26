import React from 'react'
import { View, StyleSheet, useWindowDimensions } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { VoucherListScreen } from '../screens/VoucherListScreen'
import { BillingFormScreen } from '../screens/BillingFormScreen'
import { QRCodeScreen } from '../screens/QRCodeScreen'
import { GeneralErrorScreen } from '../screens/GeneralErrorScreen'
import type { RootStackParamList } from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()

export function RootNavigator() {
  const { width } = useWindowDimensions()
  const isWeb = width > 520

  return (
    <View style={styles.root}>
      <View
        style={[styles.app, isWeb && styles.webFrame]}
        testID="app-frame"
      >
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
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#03135e',
    alignItems: 'center',
  },
  app: {
    flex: 1,
    width: '100%',
  },
  webFrame: {
    maxWidth: 480,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
})
