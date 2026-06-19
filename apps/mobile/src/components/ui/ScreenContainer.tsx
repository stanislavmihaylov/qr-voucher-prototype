import { View, StyleSheet, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { spacing } from '@/theme'

interface ScreenContainerProps {
  children: React.ReactNode
  scrollable?: boolean
  noPadding?: boolean
}

export function ScreenContainer({ children, scrollable = false, noPadding = false }: ScreenContainerProps) {
  const insets = useSafeAreaInsets()
  const style = [styles.container, !noPadding && styles.padding]

  if (scrollable) {
    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[...style, { paddingBottom: insets.bottom + spacing.lg }]}
      >
        {children}
      </ScrollView>
    )
  }

  return <View style={style}>{children}</View>
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  padding: { padding: spacing.md },
})
