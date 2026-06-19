import { createNativeStackNavigator } from '@react-navigation/native-stack'

// Screens will be added by feature implementation agents
const Stack = createNativeStackNavigator()

function PlaceholderScreen() {
  return null
}

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VoucherList" component={PlaceholderScreen} />
    </Stack.Navigator>
  )
}
