// Generic SVG mock for Jest — replaces all .svg imports with a simple View
import React from 'react'
import { View } from 'react-native'

const SvgMock: React.FC<{ width?: number; height?: number; testID?: string }> = ({
  width,
  height,
  testID,
}) => <View testID={testID} style={{ width, height }} />

export default SvgMock
