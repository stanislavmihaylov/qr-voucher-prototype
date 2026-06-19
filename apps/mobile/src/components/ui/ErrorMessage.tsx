import { View, Text, StyleSheet } from 'react-native'
import { spacing, typography } from '@/theme'

interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.text}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: spacing.md,
    marginVertical: spacing.sm,
  },
  text: { ...typography.bodyXs, color: '#b0000a' },
})
