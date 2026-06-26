/**
 * WebContentFrame tests — web-support feature.
 *
 * Slice 2: The component applies `maxWidth: 480` + `alignSelf: 'center'` when
 *          `useWindowDimensions` reports width > 520 (web/desktop), and renders
 *          full-width (no maxWidth) when width <= 520 (mobile).
 */
import React from 'react'
import { Text } from 'react-native'
import { render } from '@testing-library/react-native'
import { WebContentFrame } from '../components/ui/WebContentFrame'

afterEach(() => jest.restoreAllMocks())

describe('WebContentFrame', () => {
  it('applies maxWidth 480 and alignSelf center when viewport width > 520', async () => {
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({ width: 1440, height: 900, scale: 1, fontScale: 1 })

    const { getByTestId } = await render(
      <WebContentFrame testID="content-frame">
        <Text>content</Text>
      </WebContentFrame>,
    )

    expect(getByTestId('content-frame')).toHaveStyle({ maxWidth: 480 })
    expect(getByTestId('content-frame')).toHaveStyle({ alignSelf: 'center' })
  })

  it('does NOT apply maxWidth when viewport width <= 520', async () => {
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({ width: 390, height: 844, scale: 1, fontScale: 1 })

    const { getByTestId } = await render(
      <WebContentFrame testID="content-frame">
        <Text>content</Text>
      </WebContentFrame>,
    )

    expect(getByTestId('content-frame')).not.toHaveStyle({ maxWidth: 480 })
  })

  it('renders children', async () => {
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({ width: 390, height: 844, scale: 1, fontScale: 1 })

    const { getByText } = await render(
      <WebContentFrame>
        <Text>hello world</Text>
      </WebContentFrame>,
    )

    expect(getByText('hello world')).toBeTruthy()
  })

  it('merges a caller-supplied style prop', async () => {
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({ width: 1440, height: 900, scale: 1, fontScale: 1 })

    const { getByTestId } = await render(
      <WebContentFrame testID="content-frame" style={{ backgroundColor: '#edf8fe' }}>
        <Text>content</Text>
      </WebContentFrame>,
    )

    expect(getByTestId('content-frame')).toHaveStyle({ backgroundColor: '#edf8fe' })
    expect(getByTestId('content-frame')).toHaveStyle({ maxWidth: 480 })
  })
})
