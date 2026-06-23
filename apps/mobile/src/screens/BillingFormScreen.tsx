/**
 * BillingFormScreen — collects a 6-field billing address and submits a mock purchase.
 *
 * Design spec: docs/blueprint/flows/billing.md  (node 2:1457)
 *
 * Layout (top → bottom):
 *   MobileNavBar (48px, navy)
 *   Header section (navy bg): back link + page title + StepBar (step 2)
 *   ScrollView (form area, #EDF8FE bg): "User address" heading + 6 input fields
 *   TotalBar (sticky bottom, white): voucher name + price + "Confirm and pay" CTA
 */
import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import type { RootStackScreenProps } from '../navigation/types'
import { MobileNavBar } from '../components/MobileNavBar'
import { StepBarHeader } from '../components/StepBarHeader'
import { useVoucher } from '../hooks/useVoucherQueries'
import { useCreatePurchase } from '../hooks/usePurchaseQueries'
import { useCountries } from '../hooks/useCountriesQueries'
import ArrowBackSvg from '../../assets/features/billing/icon-arrow-back.svg'
import ArrowDropDownSvg from '../../assets/features/billing/icon-arrow-drop-down.svg'
import type { Country } from '@repo/types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FormErrors {
  addressLine1?: string
  city?: string
  county?: string
  postCode?: string
  country?: string
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface FormInputProps {
  label: string
  value: string
  onChangeText: (text: string) => void
  testID?: string
  hint?: string
  error?: string
  placeholder?: string
  required?: boolean
}

function FormInput({
  label,
  value,
  onChangeText,
  testID,
  hint,
  error,
  placeholder,
}: FormInputProps) {
  return (
    <View style={inputStyles.container}>
      <View style={inputStyles.labelRow}>
        <Text style={inputStyles.label}>{label}</Text>
        {hint ? <Text style={inputStyles.hint}>{hint}</Text> : null}
      </View>
      <TextInput
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8f8f8f"
        accessibilityLabel={label}
        style={[inputStyles.input, error ? inputStyles.inputError : null]}
      />
      {error ? (
        <Text
          style={inputStyles.errorText}
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      ) : null}
    </View>
  )
}

const inputStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#020d42',
  },
  hint: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8f8f8f',
  },
  input: {
    height: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#cdc9c9',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    fontSize: 16,
    fontWeight: '400',
    color: '#1c2b6e',
  },
  inputError: {
    borderColor: '#b0000a',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#b0000a',
  },
})

// ---------------------------------------------------------------------------
// CountrySelect
// ---------------------------------------------------------------------------

interface CountrySelectProps {
  label: string
  value: string
  onValueChange: (country: string) => void
  options: Country[]
  error?: string
  loading?: boolean
}

function CountrySelect({ label, value, onValueChange, options, error, loading }: CountrySelectProps) {
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <View style={inputStyles.container}>
      <View style={inputStyles.labelRow}>
        <Text style={inputStyles.label}>{label}</Text>
      </View>

      <TouchableOpacity
        testID="country-select-trigger"
        accessibilityRole="button"
        accessibilityLabel={`Country, currently ${value}`}
        style={[
          inputStyles.input,
          countryStyles.select,
          value ? countryStyles.selectFilled : null,
          error ? inputStyles.inputError : null,
        ]}
        activeOpacity={0.8}
        onPress={() => {
          if (!loading) setModalVisible(true)
        }}
        disabled={loading}
      >
        <Text style={countryStyles.selectText}>{value}</Text>
        <ArrowDropDownSvg testID="chevron-icon" width={24} height={24} />
      </TouchableOpacity>

      {error ? (
        <Text style={inputStyles.errorText} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        transparent
        animationType="slide"
      >
        <TouchableOpacity
          style={countryStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={countryStyles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  accessibilityRole="button"
                  style={countryStyles.option}
                  onPress={() => {
                    onValueChange(item.name)
                    setModalVisible(false)
                  }}
                >
                  <Text style={countryStyles.optionText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const countryStyles = StyleSheet.create({
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectFilled: {
    borderColor: '#03135e',
  },
  selectText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1c2b6e',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
    paddingVertical: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    minHeight: 44,
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#020d42',
  },
})

// ---------------------------------------------------------------------------
// TotalBar
// ---------------------------------------------------------------------------

interface TotalBarProps {
  voucherName: string
  priceGBP: number | null
  onConfirm: () => void
  isLoading: boolean
  bottomInset: number
}

function TotalBar({ voucherName, priceGBP, onConfirm, isLoading, bottomInset }: TotalBarProps) {
  return (
    <View style={[totalBarStyles.container, { paddingBottom: 16 + bottomInset }]}>
      {/* Voucher name */}
      <Text style={totalBarStyles.voucherName}>{voucherName}</Text>

      {/* Price row + CTA */}
      <View style={totalBarStyles.row}>
        <View style={totalBarStyles.priceColumn}>
          <Text style={totalBarStyles.totalLabel}>Total:</Text>
          {priceGBP !== null ? (
            <Text style={totalBarStyles.price}>£{priceGBP.toFixed(2)}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          testID={isLoading ? 'confirm-button-loading' : 'confirm-button'}
          onPress={isLoading ? undefined : onConfirm}
          disabled={isLoading}
          style={[totalBarStyles.button, isLoading ? totalBarStyles.buttonDisabled : null]}
          accessibilityRole="button"
          accessibilityLabel="Confirm and pay"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={totalBarStyles.buttonLabel}>Confirm and pay</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const totalBarStyles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#cdc9c9',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  voucherName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#020d42',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceColumn: {
    flexDirection: 'column',
    gap: 2,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#020d42',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#020d42',
  },
  button: {
    backgroundColor: '#03135e',
    borderRadius: 9999,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
    minHeight: 44,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
})

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export function BillingFormScreen({ navigation, route }: RootStackScreenProps<'Billing'>) {
  const { voucherId } = route.params

  // Voucher data for TotalBar
  const { data: voucher } = useVoucher(voucherId)

  // Countries list for Country selector
  const { data: countries, isLoading: countriesLoading } = useCountries()
  const countryOptions: Country[] = Array.isArray(countries) ? countries : []

  // Purchase mutation
  const createPurchase = useCreatePurchase()

  // Form state
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [county, setCounty] = useState('')
  const [postCode, setPostCode] = useState('')
  const [country, setCountry] = useState('United Kingdom')

  // Validation errors
  const [errors, setErrors] = useState<FormErrors>({})

  // Derived display values
  const voucherName = voucher
    ? `${voucher.durationDays}-day Wi-Fi voucher`
    : ''
  const priceGBP = voucher?.priceGBP ?? null

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  function validate(): boolean {
    const next: FormErrors = {}
    if (!addressLine1.trim()) next.addressLine1 = 'Address line 1 is required'
    if (!city.trim()) next.city = 'Town/City is required'
    if (!county.trim()) next.county = 'County is required'
    if (!postCode.trim()) next.postCode = 'Post code is required'
    if (!country.trim()) next.country = 'Country is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  function handleConfirm() {
    if (!validate()) return

    createPurchase.mutate(
      {
        voucherId,
        billingAddress: {
          addressLine1: addressLine1.trim(),
          ...(addressLine2.trim() ? { addressLine2: addressLine2.trim() } : {}),
          city: city.trim(),
          county: county.trim(),
          postCode: postCode.trim(),
          country: country.trim(),
        },
      },
      {
        onSuccess: (purchase) => {
          navigation.replace('QRCode', { purchaseId: purchase.id, voucherId })
        },
        onError: (err) => {
          const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
          navigation.navigate('GeneralError', { errorMessage })
        },
      },
    )
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar style="light" />

      {/* Top nav bar */}
      <MobileNavBar />

      {/* Header: back link + title + step bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backLink}
          accessibilityRole="button"
          accessibilityLabel="Back to verify booking"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowBackSvg width={20} height={20} />
          <Text style={styles.backLinkText}>Back to verify booking</Text>
        </TouchableOpacity>

        <StepBarHeader currentStep={2} title="Wi-Fi voucher booking" />
      </View>

      {/* Scrollable form area */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionHeading}>User address</Text>

        <View style={styles.fieldList}>
          {/* 1. Address line 1 */}
          <FormInput
            label="Address line 1"
            value={addressLine1}
            onChangeText={setAddressLine1}
            testID="input-addressLine1"
            required
            error={errors.addressLine1}
          />

          {/* 2. Address line 2 (optional) */}
          <FormInput
            label="Address line 2"
            value={addressLine2}
            onChangeText={setAddressLine2}
            testID="input-addressLine2"
            hint="Optional"
          />

          {/* 3. Town/City */}
          <FormInput
            label="Town/City"
            value={city}
            onChangeText={setCity}
            testID="input-city"
            required
            error={errors.city}
          />

          {/* 4. County */}
          <FormInput
            label="County"
            value={county}
            onChangeText={setCounty}
            testID="input-county"
            required
            error={errors.county}
          />

          {/* 5. Post code */}
          <FormInput
            label="Post code"
            value={postCode}
            onChangeText={setPostCode}
            testID="input-postCode"
            required
            error={errors.postCode}
          />

          {/* 6. Country (real selector — defaults to United Kingdom) */}
          <CountrySelect
            label="Country"
            value={country}
            onValueChange={setCountry}
            options={countryOptions}
            error={errors.country}
            loading={countriesLoading}
          />
        </View>
      </ScrollView>

      {/* Sticky total bar — SafeAreaView handles bottom inset */}
      <SafeAreaView edges={['bottom']} style={styles.totalBarSafeArea}>
        <TotalBar
          voucherName={voucherName}
          priceGBP={priceGBP}
          onConfirm={handleConfirm}
          isLoading={createPurchase.isPending}
          bottomInset={0}
        />
      </SafeAreaView>
    </SafeAreaView>
  )
}

// ---------------------------------------------------------------------------
// Screen-level styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#03135e',
  },
  totalBarSafeArea: {
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#03135e',
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  backLinkText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#edf8fe',
  },
  scrollContent: {
    padding: 28,
    paddingHorizontal: 16,
    gap: 48,
    flexGrow: 1,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#020d42',
  },
  fieldList: {
    flexDirection: 'column',
    gap: 29,
  },
})
