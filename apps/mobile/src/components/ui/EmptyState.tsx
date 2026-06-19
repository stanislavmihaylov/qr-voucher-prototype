import { View, Text, StyleSheet } from 'react-native'
import { spacing, typography } from '@/theme'

interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {action && <View style={styles.action}>{action}</View>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  title: { ...typography.h5, textAlign: 'center', color: '#020d42' },
  description: { ...typography.bodyMd, textAlign: 'center', color: '#8f8f8f', marginTop: spacing.sm },
  action: { marginTop: spacing.lg },
})
