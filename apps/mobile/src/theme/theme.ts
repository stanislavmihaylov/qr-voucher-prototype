import { MD3LightTheme } from 'react-native-paper'

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#03135e',
    primaryContainer: '#edf8fe',
    secondary: '#1c2b6e',
    background: '#ffffff',
    surface: '#ffffff',
    surfaceVariant: '#edf8fe',
    error: '#b0000a',
    onPrimary: '#ffffff',
    onBackground: '#020d42',
    onSurface: '#020d42',
    outline: '#cdc9c9',
  },
}

export type AppTheme = typeof lightTheme
