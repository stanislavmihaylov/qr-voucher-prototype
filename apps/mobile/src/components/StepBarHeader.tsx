/**
 * StepBarHeader — displays the page title and a 2-step progress indicator.
 *
 * Design spec (node I2:1388):
 *   backgroundColor: '#03135e'
 *   paddingHorizontal: 16 (desktop=48, override to 16 for mobile)
 *   paddingVertical: 16
 *   borderBottomWidth: 1, borderBottomColor: '#cdc9c9'
 *
 *   Step active:   filled white circle, dark number
 *   Step inactive: outlined white circle, white number
 *   Connector:     dashed white line (borderTopWidth:1, borderStyle:'dashed')
 */
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface StepBarHeaderProps {
  currentStep: 1 | 2
  title: string
}

interface StepProps {
  number: 1 | 2
  label: string
  isActive: boolean
}

function Step({ number, label, isActive }: StepProps) {
  return (
    <View style={styles.stepWrapper}>
      <View
        style={[styles.circle, isActive ? styles.circleActive : styles.circleInactive]}
        accessibilityRole="text"
        accessibilityLabel={`Step ${number} of 2: ${label}${isActive ? ', current step' : ''}`}
      >
        <Text style={[styles.circleNumber, isActive ? styles.circleNumberActive : styles.circleNumberInactive]}>
          {number}
        </Text>
      </View>
      <Text style={[styles.stepLabel, isActive ? styles.stepLabelActive : styles.stepLabelInactive]}>
        {label}
      </Text>
    </View>
  )
}

export function StepBarHeader({ currentStep, title }: StepBarHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.stepBar}>
        <Step number={1} label="Select package" isActive={currentStep === 1} />

        {/* Dashed connector between steps */}
        <View style={styles.connector} />

        <Step number={2} label="Payment" isActive={currentStep === 2} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#03135e',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#cdc9c9',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 32,
  },
  stepBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: {
    backgroundColor: '#ffffff',
  },
  circleInactive: {
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: 'transparent',
  },
  circleNumber: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
  },
  circleNumberActive: {
    color: '#020d42',
  },
  circleNumberInactive: {
    color: '#ffffff',
  },
  stepLabel: {
    fontSize: 16,
    lineHeight: 20,
    color: '#ffffff',
  },
  stepLabelActive: {
    fontWeight: '600',
  },
  stepLabelInactive: {
    fontWeight: '400',
  },
  connector: {
    width: 37,
    borderTopWidth: 1,
    borderTopColor: '#ffffff',
    borderStyle: 'dashed',
  },
})
