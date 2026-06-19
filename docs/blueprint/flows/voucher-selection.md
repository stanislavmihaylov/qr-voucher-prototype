# Feature Flow: Voucher Selection

**Figma Nodes:** 2:1386, 2:1437
**Feature Slug:** `voucher-selection`
**Navigator:** Main Stack (root / entry screen)
**Last Updated:** 2026-06-19

---

## Overview

The user lands on a scrollable list of three Wi-Fi packages (1-day, 4-day, 7-day) and selects one by tapping its embedded "Buy X-day voucher" button. Tapping the button stores the selected voucher in Zustand and navigates directly to `BillingFormScreen`. No auth is required — this is the entry point for the entire anonymous purchase flow.

---

## Design Notes: Two Figma Frames → One React Native Screen

Figma contains two frames for this feature:

| Frame | Node | What it shows |
|---|---|---|
| `2:1386` | VoucherListScreen — initial state | Mobile nav bar + step-bar header + intro text + 3 cards + footer |
| `2:1437` | VoucherListScreen — scrolled state | Step-bar header only (nav bar scrolled off) + 3 cards (no intro text) + footer |

**Decision:** Implement as a **single `VoucherListScreen`**. Frame `2:1437` is the same screen after the user has scrolled down past the intro copy — the mobile nav bar clips off and the intro paragraph scrolls away. Both frames show the identical 3 cards. There is no "selected card" highlight visible in either frame; the button press is the primary action that moves the flow forward.

**Scrolled-frame border radius:** Frame `2:1437` has `borderTopLeftRadius: 24, borderTopRightRadius: 24` on its outer wrapper — this is a web artefact showing the content area peaking under the sticky nav bar. **Omit on React Native** — `ScrollView` handles this naturally.

---

## Screens

### VoucherListScreen (`voucher-selection/VoucherListScreen`)

**Figma node:** `2:1386` (initial) / `2:1437` (scrolled)
**Entry point:** App launch (root screen of Main Stack)
**Exit points:** → `BillingFormScreen` (on any card button press)

---

### Layout

Confirmed from live Figma data (`get_design_context` on both nodes):

```
<SafeAreaView> (flex: 1, backgroundColor: '#03135e')
  <ScrollView> (flex: 1, bounces: iOS, overScrollMode: 'never' Android)
    │
    ├─ MobileNavBar                      node 2:1410
    │   height: 48
    │   backgroundColor: '#03135e'
    │   paddingHorizontal: 16
    │   flexDirection: 'row'
    │   alignItems: 'center'
    │   justifyContent: 'space-between'
    │   borderTopLeftRadius: 32, borderTopRightRadius: 32 ← web artefact, OMIT on RN
    │   ├─ Left cluster (flexDirection:'row', gap:12, alignItems:'center')
    │   │   ├─ icon-menu.svg            24×24
    │   │   ├─ logo-park-holidays.svg   75×24  (within rounded container h:24 w:75 borderRadius:8)
    │   │   ├─ Divider                  View w:1, h:30, backgroundColor:'#ffffff'
    │   │   └─ logo-park-leisure.svg    100×33 (within rounded container h:33 w:100 borderRadius:8)
    │   └─ Right cluster               h:36, w:88, empty (no actions in prototype)
    │
    ├─ StepBarHeader                     node I2:1388 (inside Header/Form/Desktop node 2:1388)
    │   backgroundColor: '#03135e'
    │   paddingHorizontal: 16  ← desktop node uses 48; OVERRIDE to 16 for mobile
    │   paddingVertical: 16    ← py-[var(--spacing/gap-sm,16px)] confirmed
    │   borderBottomWidth: 1, borderBottomColor: '#cdc9c9'
    │   ├─ Title: "Buy Wi-Fi access"
    │   │   fontSize:28, fontWeight:'600', color:'#ffffff', fontFamily:'Inter', lineHeight:32
    │   └─ StepBar (flexDirection:'row', gap:16, alignItems:'center')
    │       ├─ Step 1 — Active
    │       │   Circle: backgroundColor:'#ffffff', width:36, height:36, borderRadius:18, padding:8
    │       │   Number "1": fontSize:18, fontWeight:'600', color:'#020d42', textAlign:'center', lineHeight:24
    │       │   Label "Select package": fontSize:16, fontWeight:'600', color:'#ffffff', lineHeight:20
    │       ├─ Connector line           View w:37, borderTopWidth:1, borderStyle:'dashed', borderColor:'#ffffff'
    │       └─ Step 2 — Inactive
    │           Circle: borderWidth:2, borderColor:'#ffffff', width:36, height:36, borderRadius:18, padding:8
    │           Number "2": fontSize:18, fontWeight:'600', color:'#ffffff', textAlign:'center', lineHeight:24
    │           Label "Payment": fontSize:16, fontWeight:'400', color:'#ffffff', lineHeight:20
    │
    ├─ ContentArea                       node 2:1398 "Conteiner" [sic]
    │   backgroundColor: '#edf8fe'
    │   paddingHorizontal: 16            ← px-[var(--spacing/margin-m,16px)]
    │   paddingVertical: 28              ← py-[var(--spacing/gap-lg,28px)]
    │   width: '100%'
    │   maxWidth: 1024 (web ref, ignore on mobile — use width:'100%')
    │   │
    │   └─ slot left column             gap:32 between items (gap-[var(--spacing/gap-xl,32px)])
    │       ├─ IntroParagraph           (present in 2:1386 only — scrolls away)
    │       │   "Select a Wi-Fi package. Your access period begins when you complete your purchase."
    │       │   fontSize:18, fontWeight:'400', color:'#020d42', lineHeight:24, fontFamily:'Inter'
    │       ├─ WifiVoucherCard (1-day)
    │       ├─ WifiVoucherCard (4-day)
    │       └─ WifiVoucherCard (7-day)
    │
    └─ Footer                            node 2:1399 "Footer All Rights"
        backgroundColor: '#03135e'
        paddingHorizontal: 48
        paddingVertical: 24
        flexDirection: 'column'
        gap: 32                 ← between link-content block and social-icons row
        height: 182 (fixed)
        ├─ LinkContent block (flexDirection:'column', gap:12)
        │   ├─ "2026 Park Holidays Limited"  fontSize:14 weight:600 color:'#ffffff' lineHeight:18
        │   ├─ TouchableOpacity: "Terms & conditions" — onPress: no-op
        │   │   fontSize:14, fontWeight:'600', color:'#ffffff', lineHeight:18
        │   └─ TouchableOpacity: "Privacy" — onPress: no-op
        │       fontSize:14, fontWeight:'600', color:'#ffffff', lineHeight:18
        └─ SocialRow (flexDirection:'row', gap:6, alignItems:'center', justifyContent:'flex-end')
            ├─ <FacebookSvg width={24} height={24} />
            ├─ <YoutubeSvg width={24} height={24} />
            ├─ <FacebookSvg width={24} height={24} />   ← design shows two pairs intentionally
            └─ <YoutubeSvg width={24} height={24} />
```

**React Native root structure:**
```tsx
<SafeAreaView style={{ flex: 1, backgroundColor: '#03135e' }}>
  <StatusBar barStyle="light-content" />
  <ScrollView
    style={{ flex: 1 }}
    contentContainerStyle={{ flexGrow: 1 }}
    bounces={true}
    overScrollMode="never"
    refreshControl={
      <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
    }
  >
    <MobileNavBar />
    <StepBarHeader currentStep={1} title="Buy Wi-Fi access" />
    <ContentArea>
      <IntroParagraph />
      {vouchers.map(v => (
        <WifiVoucherCard key={v.id} voucher={v} onPress={() => handleSelect(v)} />
      ))}
    </ContentArea>
    <AppFooter />
  </ScrollView>
</SafeAreaView>
```

---

### MobileNavBar

**Node:** `2:1410`

```
backgroundColor: '#03135e'
height: 48
paddingHorizontal: 16
flexDirection: 'row'
alignItems: 'center'
justifyContent: 'space-between'
```

- **Left cluster** (`flexDirection: 'row'`, `gap: 12`, `alignItems: 'center'`):
  - Hamburger icon: `<MenuSvg width={24} height={24} />` — `icon-menu.svg`
  - Park Holidays wordmark container: `height: 24, width: 75, borderRadius: 8`
    → `<ParkHolidaysLogo width={75} height={24} />` — `logo-park-holidays.svg`
  - Divider: `View` with `width: 1, height: 30, backgroundColor: '#ffffff'`
  - Park Leisure logo container: `height: 33, width: 100, borderRadius: 8`
    → `<ParkLeisureLogo width={100} height={33} />` — `logo-park-leisure.svg`
- **Right cluster** (`width: 88, height: 36`): empty `<View>` — no actions in prototype

> **RN Divider note:** Use `View` with `width: 1, height: 30, backgroundColor: '#ffffff'` — do NOT use CSS `rotate` / a rotated line.

---

### StepBarHeader

**Node:** `I2:1388` (inside `Header/Form/Desktop`)

> The desktop header node uses `paddingHorizontal: 48` — override to **16** for mobile. Border bottom confirmed: `borderBottomWidth: 1, borderBottomColor: '#cdc9c9'`.

```tsx
interface StepBarHeaderProps {
  currentStep: 1 | 2
  title: string
}
```

| Element | Active (step = current) | Inactive |
|---|---|---|
| Circle fill | `backgroundColor: '#ffffff'` | transparent |
| Circle border | none | `borderWidth: 2, borderColor: '#ffffff'` |
| Circle size | `width: 36, height: 36, borderRadius: 18, padding: 8` | same |
| Number color | `#020d42` (dark on white) | `#ffffff` |
| Number font | `fontSize: 18, fontWeight: '600', lineHeight: 24` | same |
| Label weight | `fontWeight: '600'` | `fontWeight: '400'` |
| Label style | `fontSize: 16, lineHeight: 20, color: '#ffffff'` | same |

**Connector** between steps:
```tsx
<View style={{
  width: 37,
  borderTopWidth: 1,
  borderColor: '#ffffff',
  borderStyle: 'dashed',
}} />
```
> `borderStyle: 'dashed'` is supported in React Native for `borderTopWidth` on `<View>` on both platforms.

---

### WifiVoucherCard

**Nodes (from 2:1386):** `I2:1398;5626:154507;2:1395` (1-day), `I2:1398;5626:154507;2:1396` (4-day), `I2:1398;5626:154507;2:1397` (7-day)

Reusable component — receives a `WifiVoucher` object and `onPress` callback.

```
Card container:
  backgroundColor: '#ffffff'
  borderRadius: 12          ← Rounding/radius-card
  padding: 24               ← Spacing/gap-md
  width: '100%'             ← fills ContentArea (343px on 375 screen after 16px paddingH each side)
  flexDirection: 'column'
  gap: 16                   ← Spacing/4 (between content block and CTA button)

  Content block:
    flexDirection: 'column'
    gap: 12                 ← Spacing/gap-sm (confirmed)
    ├─ Icon: width:85, height:77 — SVG asset per voucher type
    ├─ Name: fontSize:24, fontWeight:'600', color:'#020d42', lineHeight:28, fontFamily:'Inter'
    └─ Detail block:
        ├─ Bullet 1: "• Up to 6 devices"
        │   fontSize:16, fontWeight:'400', color:'#020d42', lineHeight:20
        ├─ Bullet 2: "• Valid for X from activation"
        │   fontSize:16, fontWeight:'400', color:'#020d42', lineHeight:20
        └─ Price: "£X.XX"
            fontSize:28, fontWeight:'600', color:'#020d42', lineHeight:32
            fontFamily: Open Sans SemiBold (Figma) → use Inter SemiBold as project fallback
            ⚠️ Note: trailing whitespace in Figma source ("£7.99  ") — trim on render

  CTA Button:
    backgroundColor: '#03135e'
    borderRadius: 9999        ← pill (Rounding/btn-rounding)
    paddingVertical: 12
    paddingHorizontal: 24
    alignItems: 'center'
    justifyContent: 'center'
    width: '100%'
    ├─ Inner wrapper: height:24, alignItems:'center', justifyContent:'center'
    └─ Label: fontSize:16, fontWeight:'600', color:'#ffffff', lineHeight:20, textAlign:'center'
```

**Three card instances — confirmed from both Figma frames:**

| # | Name | Price | Duration bullet | Icon asset | Button label |
|---|---|---|---|---|---|
| 1 | 1-day Wi-Fi voucher | £7.99 | Valid for 24 hours from activation | `icon-wifi-1day.svg` | Buy 1-day voucher |
| 2 | 4-day Wi-Fi voucher | £14.99 | Valid for 4 days from activation | `icon-wifi-4day.svg` | Buy 4-day voucher |
| 3 | 7-day Wi-Fi voucher | £17.99 | Valid for 7 days from activation | `icon-wifi-7day.svg` | Buy 7-day voucher |

> ⚠️ **Figma typos for 7-day** (confirmed in live data from both frames):
> - Card **title** in frame `2:1437` reads `"7- day Wi-Fi voucher"` (space before "day") — **normalise to `"7-day Wi-Fi voucher"`**
> - Card **button label** in frame `2:1386` reads `"Buy 7- day voucher"` (space before "day") — **normalise to `"Buy 7-day voucher"`**
> Both frames agree on the corrected text after normalisation.

Both bullet lines for all three cards:
1. "Up to 6 devices"
2. The duration bullet (varies per card)

**Bullet rendering in React Native** (no `<ul>/<li>`):
```tsx
<Text style={styles.bullet}>{'• Up to 6 devices'}</Text>
<Text style={styles.bullet}>{'• Valid for 24 hours from activation'}</Text>
```

**SVG icon usage:**
```tsx
import WiFi1DaySvg from '../../assets/features/voucher-selection/icon-wifi-1day.svg'
// ...
<WiFi1DaySvg width={85} height={77} />
```

---

### Footer (AppFooter)

**Node:** `2:1399`

```
backgroundColor: '#03135e'
paddingHorizontal: 48
paddingVertical: 24
flexDirection: 'column'
gap: 32                 ← between LinkContent and SocialRow
height: 182 (fixed)

LinkContent block:
  flexDirection: 'column'
  gap: 12
  width: '100%'
  ├─ Text: "2026 Park Holidays Limited"
  │   fontSize:14, fontWeight:'600', color:'#ffffff', lineHeight:18
  ├─ TouchableOpacity: "Terms & conditions" — onPress: no-op
  │   fontSize:14, fontWeight:'600', color:'#ffffff', lineHeight:18
  └─ TouchableOpacity: "Privacy" — onPress: no-op
      fontSize:14, fontWeight:'600', color:'#ffffff', lineHeight:18

SocialRow:
  flexDirection: 'row'
  gap: 6
  alignItems: 'center'
  justifyContent: 'flex-end'
  ├─ <FacebookSvg width={24} height={24} />
  ├─ <YoutubeSvg width={24} height={24} />
  ├─ <FacebookSvg width={24} height={24} />   ← design shows two pairs intentionally
  └─ <YoutubeSvg width={24} height={24} />
```

---

### States

| State | Behaviour |
|---|---|
| **Loading** | Show 3 `SkeletonCard` placeholders (white, borderRadius:12, height:~220). Use `RefreshControl` while refetching. |
| **Error** | `ErrorMessage` component below intro text + "Retry" `TouchableOpacity` that calls `refetch()` from TanStack Query. |
| **Empty** (API returns `[]`) | `EmptyState` component — "No Wi-Fi packages available. Please try again later." |
| **Default (loaded)** | All 3 cards visible and tappable. |

---

### Interactions

| Element | Gesture | Result |
|---|---|---|
| "Buy X-day voucher" button | `onPress` | `useVoucherStore.getState().setSelectedVoucher(voucher)` → `navigation.navigate('Billing', { voucherId: voucher.id })` |
| ScrollView | Pull-to-refresh (`RefreshControl`) | `refetch()` TanStack Query — re-fetches `GET /api/vouchers` |
| "Terms & conditions" | `onPress` | No-op (prototype) |
| "Privacy" | `onPress` | No-op (prototype) |
| Hamburger icon | `onPress` | No-op (prototype) |

---

### Accessibility

- Each `WifiVoucherCard` CTA: `accessibilityRole="button"`, `accessibilityLabel="Buy [name] for £[price]"`
- Card container (`View`): `accessibilityRole="none"` — not an interactive element
- Intro text `Text`: `accessibilityRole="text"`
- Step bar active step: `accessibilityLabel="Step 1 of 2: Select package"`, `accessibilityRole="text"`
- Footer links: `accessibilityRole="button"`, `accessibilityLabel="Terms and conditions"` / `"Privacy policy"`
- All touch targets minimum **44×44pt** — card button `paddingVertical: 12` + 24px inner height gives ≥44pt
- Social icon buttons: `accessibilityLabel="Facebook"` / `"YouTube"` (no-op), `accessibilityRole="button"`

---

### Mobile-Specific Notes

- **Safe area:** `<SafeAreaView>` wrapping the entire screen; status bar style: **light** (white icons on dark navy)
- Use `<StatusBar barStyle="light-content" />` from `expo-status-bar`
- **Android navigation bar:** Set `navigationBarColor="#03135e"` via `expo-navigation-bar` or Expo config
- **Keyboard:** Not applicable — no text inputs on this screen
- **Scroll:** `<ScrollView bounces={true}>` on iOS; `overScrollMode="never"` on Android
- **Content area max width:** Design specifies `maxWidth: 1024` (desktop ref) — ignore on mobile; use `width: '100%'`
- **StepBarHeader padding:** Desktop node uses `paddingHorizontal: 48`; override to **16** for mobile
- **StepBarHeader border:** `borderBottomWidth: 1, borderBottomColor: '#cdc9c9'` — confirmed from live Figma data

---

## Component Inventory

| Component | Props | States | Reused In |
|---|---|---|---|
| `MobileNavBar` | — | static | VoucherListScreen, BillingFormScreen, QRCodeScreen |
| `StepBarHeader` | `currentStep: 1 \| 2`, `title: string` | static | VoucherListScreen (step 1), BillingFormScreen (step 2) |
| `WifiVoucherCard` | `voucher: WifiVoucher`, `onPress: () => void`, `loading?: boolean` | default, pressed (opacity feedback) | VoucherListScreen |
| `AppFooter` | — | static | VoucherListScreen |
| `SkeletonCard` | `height?: number` | — | VoucherListScreen (loading state) |

---

## Navigation Flow

```
[App Launch]
    │
    ▼
VoucherListScreen                    ← Root of Main Stack (no back button)
    │
    │  [onPress: "Buy X-day voucher"]
    │  useVoucherStore.setSelectedVoucher(voucher)
    │
    ▼
BillingFormScreen
```

No back button on VoucherListScreen — it is the stack root. Pressing the Android back button from `BillingFormScreen` returns to this screen.

---

## API Interactions

| Action | Method | Endpoint | Payload / Params | Notes |
|---|---|---|---|---|
| Fetch voucher list | GET | `/api/vouchers` | — | Returns `WifiVoucher[]` sorted by duration ascending |

**`WifiVoucher` shape (confirmed from Figma design data):**
```ts
// packages/types/src/index.ts  (or equivalent @repo/types)
interface WifiVoucher {
  id: string
  name: string           // "1-day Wi-Fi voucher"
  durationLabel: string  // "24 hours" | "4 days" | "7 days"
  deviceLimit: number    // 6 (all packages)
  priceGBP: number       // 7.99 | 14.99 | 17.99
  iconKey: string        // "1day" | "4day" | "7day"  → maps to local SVG asset
}
```

> The 3 packages should be seeded as static rows in `prisma/seed.ts`. No create/update/delete endpoints needed for this feature.

---

## Design Tokens Used

| Token | Value | Used For |
|---|---|---|
| `Color/background/brand/primary` | `#03135e` | Nav bar, step-bar header, card CTA button bg, footer bg |
| `Color/background/neutral/quaternary` | `#edf8fe` | Content area background |
| `Color/background/neutral/primary` | `#ffffff` | Card background, active step circle |
| `Color/foreground/neutral/primary` | `#020d42` | Card name, bullet text, price, intro text, active step number |
| `Color/foreground/neutral/primary-inverse` | `#ffffff` | Nav title, step labels, button labels, footer text, inactive step number |
| `Color/stroke/neutral/primary` | `#cdc9c9` | StepBarHeader bottom border |
| `Color/stroke/brand/inverse` | `#ffffff` | Inactive step circle border, connector line |
| `Rounding/radius-card` | `12` | Card border radius |
| `Rounding/btn-rounding` | `9999` | CTA button border radius (pill) |
| `Special/Corner Radius/Image` | `8` | Logo container border radius in nav bar |
| `Spacing/gap-md` | `24` | Card internal padding |
| `Spacing/4` | `16` | Gap between card content and CTA button; content paddingH |
| `Spacing/gap-sm` | `12` | Gap between icon, name, detail block inside card |
| `Spacing/gap-lg` | `28` | Content area paddingVertical |
| `Spacing/gap-sm` | `16` | StepBarHeader paddingVertical |
| `Spacing/12` | `48` | Content area top gap; footer paddingH |
| `Spacing/gap-xl` | `32` | Gap between cards in slot column; footer section gap |
| `Heading/H3` | `28/600/Inter, lh:32` | "Buy Wi-Fi access" title |
| `Heading/H4` | `24/600/Inter, lh:28` | Card voucher name |
| `Label/lg` | `18/600/Inter, lh:24` | Step number inside circle |
| `Label/md` | `16/600/Inter, lh:20` | CTA button label, step labels |
| `Paragraph/lg` | `18/400/Inter, lh:24` | Intro paragraph |
| `Paragraph/md` | `16/400/Inter, lh:20` | Bullet list items |
| `Label/sm` | `14/600/Inter, lh:18` | Footer copyright + links |

---

## Assets

All assets exported and validated on **2026-06-19** via Figma MCP.

> **All assets in this feature are SVG** — confirmed by `file -b` command post-download showing "SVG Scalable Vector Graphics image" for each file.

### Exported and saved

| Asset | Type | Size | Saved Path | Used In | RN Usage |
|-------|------|------|-----------|---------|----------|
| Wi-Fi 1-day icon | SVG | 2,915 bytes | `apps/mobile/assets/features/voucher-selection/icon-wifi-1day.svg` | WifiVoucherCard (1-day) | `import WiFi1DaySvg from '...'; <WiFi1DaySvg width={85} height={77} />` |
| Wi-Fi 4-day icon | SVG | 2,975 bytes | `apps/mobile/assets/features/voucher-selection/icon-wifi-4day.svg` | WifiVoucherCard (4-day) | `import WiFi4DaySvg from '...'; <WiFi4DaySvg width={85} height={77} />` |
| Wi-Fi 7-day icon | SVG | 2,816 bytes | `apps/mobile/assets/features/voucher-selection/icon-wifi-7day.svg` | WifiVoucherCard (7-day) | `import WiFi7DaySvg from '...'; <WiFi7DaySvg width={85} height={77} />` |
| Hamburger menu icon | SVG | 962 bytes | `apps/mobile/assets/features/voucher-selection/icon-menu.svg` | MobileNavBar | `import MenuSvg from '...'; <MenuSvg width={24} height={24} />` |
| Facebook icon | SVG | 662 bytes | `apps/mobile/assets/features/voucher-selection/icon-facebook.svg` | AppFooter (×2) | `import FacebookSvg from '...'; <FacebookSvg width={24} height={24} />` |
| YouTube icon | SVG | 766 bytes | `apps/mobile/assets/features/voucher-selection/icon-youtube.svg` | AppFooter (×2) | `import YoutubeSvg from '...'; <YoutubeSvg width={24} height={24} />` |

### Missing assets (must be exported from Figma before implementation)

The two brand logos are complex multi-path vector compositions. Figma MCP decomposes them into many sub-vector images — no single CDN URL is available for the complete logo composition. Export manually:

| Asset | Figma Node ID | Target Path | Export settings |
|---|---|---|---|
| Park Holidays wordmark | `I2:1410;1841:84723` | `apps/mobile/assets/features/voucher-selection/logo-park-holidays.svg` | Export as SVG |
| Park Leisure logo | `I2:1410;6169:130133` | `apps/mobile/assets/features/voucher-selection/logo-park-leisure.svg` | Export as SVG |

**Export instruction:** In Figma, right-click each logo node → Export → SVG. Place the files at the paths above. Verify they render correctly in an SVG viewer before use.

**SVG note:** All assets in this feature require `react-native-svg` and `react-native-svg-transformer`. The implementation agent must:

```bash
pnpm add react-native-svg
pnpm add -D react-native-svg-transformer
```

Then update `metro.config.js` and `tsconfig.json` per the [`react-native-svg-transformer` README](https://github.com/kristerkari/react-native-svg-transformer) before importing any `.svg` file.

**SVG import pattern:**
```tsx
import MenuSvg from '../../assets/features/voucher-selection/icon-menu.svg'
// usage:
<MenuSvg width={24} height={24} />
```

---

## Business Rules

- **No authentication required** — purchases are fully anonymous (prototype constraint)
- Exactly **3 voucher packages** shown, sorted by duration ascending: 1-day, 4-day, 7-day
- All packages allow **up to 6 devices**
- Access period begins at **purchase completion** (not at first scan), per design copy
- Only one voucher can be selected per purchase journey; selection is stored in Zustand (`useVoucherStore.setSelectedVoucher`) and carried forward to billing
- Multiple separate purchases are supported; each generates a separate QR code
- **Button label must normalise Figma typos** — use `"Buy 7-day voucher"` (no space before "day") for the 7-day package
- **Card title must normalise Figma typos** — use `"7-day Wi-Fi voucher"` (no space) for the 7-day card name
- Packages are seeded/static in the DB — no admin CRUD required for this prototype

---

## Acceptance Criteria

- [ ] All 3 Wi-Fi packages load from `GET /api/vouchers` on screen mount
- [ ] Each card shows: SVG icon (85×77), name (H4), device bullet, duration bullet, price (28/600), "Buy X-day voucher" pill CTA
- [ ] 7-day card title reads "7-day Wi-Fi voucher" (no space) and button reads "Buy 7-day voucher" (no space) — both Figma typos corrected
- [ ] Tapping "Buy X-day voucher" stores the voucher in `useVoucherStore` and navigates to `BillingFormScreen`
- [ ] Loading state: 3 skeleton cards shown while TanStack Query fetches
- [ ] Error state: inline `ErrorMessage` + "Retry" button if `GET /api/vouchers` fails
- [ ] Empty state: "No Wi-Fi packages available" message if API returns `[]`
- [ ] Pull-to-refresh re-fetches voucher list
- [ ] Status bar is light (white icons) on the dark navy background
- [ ] Step bar shows step 1 active (filled circle "1") and step 2 inactive (outlined circle "2")
- [ ] StepBarHeader has bottom border (1px, `#cdc9c9`)
- [ ] Footer renders copyright, two link no-ops, and four social icons (fb, yt, fb, yt)
- [ ] Screen is accessible: all interactive elements have `accessibilityLabel` and `accessibilityRole`
- [ ] All SVG assets render correctly (`react-native-svg` + transformer installed and configured)
- [ ] Both logo assets (`logo-park-holidays.svg`, `logo-park-leisure.svg`) are manually exported and render in the nav bar

---

## Open Questions — All Resolved

| Question | Resolution |
|---|---|
| Are the 3 packages hardcoded or API-fetched? | API-fetched from `GET /api/vouchers`; backend should seed in `prisma/seed.ts` |
| What are the actual package names, prices, durations? | Confirmed from Figma: 1-day £7.99 / 4-day £14.99 / 7-day £17.99, all 6 devices |
| Does deselecting return to list or stay? | N/A — no separate selection state; CTA button directly proceeds to billing |
| Is there a selected-card highlight state? | Not present in the design — both frames show all 3 cards with identical CTAs |
| What does frame 2:1437 represent? | Scrolled state of the same screen — implement as single `VoucherListScreen` |
| Are the Wi-Fi icons PNG or SVG? | **SVG** — confirmed post-download via `file -b` command (all 6 icons report "SVG Scalable Vector Graphics image") |
| Is the 7-day button label a typo? | Yes — frame 2:1386 reads "Buy 7- day voucher"; normalise to "Buy 7-day voucher" |
| Is the 7-day card title a typo? | Yes — frame 2:1437 reads "7- day Wi-Fi voucher"; normalise to "7-day Wi-Fi voucher" |
| What font is used for the price? | Open Sans SemiBold in Figma design; use **Inter SemiBold** as the project-standard fallback |
| What is the gap between cards? | 32px (`Spacing/gap-xl`) — confirmed from `gap-[var(--spacing/gap-xl,32px)]` in design context |
| What is the content area top gap? | 48px (`Spacing/12`) between StepBarHeader and ContentArea — confirmed from design context |
| Does the StepBarHeader have a bottom border? | Yes — `borderBottomWidth: 1, borderBottomColor: '#cdc9c9'` confirmed from live Figma data |
| What is the scrolled-frame border radius? | `borderTopLeftRadius: 24, borderTopRightRadius: 24` on outer wrapper — web artefact, omit on RN |
