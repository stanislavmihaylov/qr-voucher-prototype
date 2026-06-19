import {
  durationText,
  durationLabel,
  voucherName,
  buyLabel,
  deviceBullet,
  durationBullet,
  formatPrice,
} from '../lib/voucherLabels'

describe('voucherLabels', () => {
  describe('durationText', () => {
    it('returns "24 hours" for 1 day', () => {
      expect(durationText(1)).toBe('24 hours')
    })

    it('returns "<n> days" for multi-day durations', () => {
      expect(durationText(3)).toBe('3 days')
      expect(durationText(4)).toBe('4 days')
      expect(durationText(7)).toBe('7 days')
      expect(durationText(10)).toBe('10 days')
    })
  })

  describe('durationLabel', () => {
    it('returns "<n>-day" format', () => {
      expect(durationLabel(1)).toBe('1-day')
      expect(durationLabel(10)).toBe('10-day')
    })
  })

  describe('voucherName', () => {
    it('returns "<n>-day Wi-Fi voucher"', () => {
      expect(voucherName(1)).toBe('1-day Wi-Fi voucher')
      expect(voucherName(3)).toBe('3-day Wi-Fi voucher')
      expect(voucherName(7)).toBe('7-day Wi-Fi voucher')
    })
  })

  describe('buyLabel', () => {
    it('returns "Buy <n>-day voucher"', () => {
      expect(buyLabel(1)).toBe('Buy 1-day voucher')
      expect(buyLabel(10)).toBe('Buy 10-day voucher')
    })
  })

  describe('deviceBullet', () => {
    it('returns "• Up to <n> devices"', () => {
      expect(deviceBullet(2)).toBe('• Up to 2 devices')
      expect(deviceBullet(12)).toBe('• Up to 12 devices')
    })
  })

  describe('durationBullet', () => {
    it('uses "24 hours" for 1 day', () => {
      expect(durationBullet(1)).toBe('• Valid for 24 hours from activation')
    })

    it('uses "<n> days" for multi-day durations', () => {
      expect(durationBullet(4)).toBe('• Valid for 4 days from activation')
      expect(durationBullet(7)).toBe('• Valid for 7 days from activation')
    })
  })

  describe('formatPrice', () => {
    it('formats price with £ symbol and 2 decimal places', () => {
      expect(formatPrice(7.99)).toBe('£7.99')
      expect(formatPrice(14.9)).toBe('£14.90')
      expect(formatPrice(24.99)).toBe('£24.99')
    })
  })
})
