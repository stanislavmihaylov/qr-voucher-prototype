/**
 * SVG Asset Fill Integrity
 *
 * Verifies that none of the project SVG assets contain
 * CSS custom-property fills (`fill="var(--fill-0, ...)"`) that
 * react-native-svg cannot parse at runtime.
 *
 * If any file fails this test, edit the SVG and replace
 * `fill="var(--fill-0, #XXXXXX)"` with `fill="#XXXXXX"`.
 *
 * Directories covered:
 *   - assets/common               — shared / cross-feature icons
 *   - assets/features/billing     — billing-specific icons
 *   - assets/features/voucher-selection — voucher domain icons
 */
import fs from 'fs'
import path from 'path'

const ASSETS_ROOT = path.join(__dirname, '../../assets')

const DIRS = [
  path.join(ASSETS_ROOT, 'common'),
  path.join(ASSETS_ROOT, 'features/billing'),
  path.join(ASSETS_ROOT, 'features/voucher-selection'),
]

for (const dir of DIRS) {
  const relDir = path.relative(path.join(__dirname, '../..'), dir)

  describe(`SVG asset fill integrity — ${relDir} — no CSS var() fills`, () => {
    const svgFiles = fs.existsSync(dir)
      ? fs.readdirSync(dir).filter((f) => f.endsWith('.svg'))
      : []

    if (svgFiles.length === 0) {
      it(`has at least one SVG file in ${relDir}`, () => {
        expect(svgFiles.length).toBeGreaterThan(0)
      })
      return
    }

    it.each(svgFiles)('%s has no fill="var(...)" attribute', (filename) => {
      const content = fs.readFileSync(path.join(dir, filename), 'utf8')
      // react-native-svg cannot parse CSS var() — must be resolved to a literal color
      expect(content).not.toMatch(/fill="var\(/)
    })

    it.each(svgFiles)('%s has no stroke="var(...)" attribute', (filename) => {
      const content = fs.readFileSync(path.join(dir, filename), 'utf8')
      expect(content).not.toMatch(/stroke="var\(/)
    })
  })
}
