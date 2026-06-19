/**
 * SVG Asset Fill Integrity — Slice 1
 *
 * Verifies that none of the voucher-selection SVG assets contain
 * CSS custom-property fills (`fill="var(--fill-0, ...)"`) that
 * react-native-svg cannot parse at runtime.
 *
 * If any file fails this test, edit the SVG and replace
 * `fill="var(--fill-0, #XXXXXX)"` with `fill="#XXXXXX"`.
 */
import fs from 'fs'
import path from 'path'

const ASSET_DIR = path.join(
  __dirname,
  '../../assets/features/voucher-selection',
)

describe('SVG asset fill integrity — no CSS var() fills', () => {
  const svgFiles = fs
    .readdirSync(ASSET_DIR)
    .filter((f) => f.endsWith('.svg'))

  it.each(svgFiles)('%s has no fill="var(...)" attribute', (filename) => {
    const content = fs.readFileSync(path.join(ASSET_DIR, filename), 'utf8')
    // react-native-svg cannot parse CSS var() — must be resolved to a literal color
    expect(content).not.toMatch(/fill="var\(/)
  })

  it.each(svgFiles)('%s has no stroke="var(...)" attribute', (filename) => {
    const content = fs.readFileSync(path.join(ASSET_DIR, filename), 'utf8')
    expect(content).not.toMatch(/stroke="var\(/)
  })
})
