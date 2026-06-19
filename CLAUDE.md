# CLAUDE.md

**Client:** Wi-Fi Park Holidays
**Project:** QR Voucher Prototype
**Stack:** React Native (Expo, managed) + NestJS + Prisma + TypeScript

## Monorepo Structure

```
<root>/
  apps/
    backend/          — NestJS API
      src/
        auth/         — CurrentUser decorator stub (no JWT — prototype is anonymous)
        prisma/       — PrismaService + PrismaModule
      prisma/         — schema.prisma (WifiVoucher, Purchase, BillingAddress)
    mobile/           — React Native Expo app (managed workflow)
      src/
        components/
          ui/         — ScreenContainer, EmptyState, LoadingOverlay, ErrorMessage
        navigation/   — RootNavigator and feature navigators
        screens/      — Feature screen files
        store/        — Zustand stores (voucher.store.ts + feature stores)
        lib/          — api.ts (fetch wrapper)
        theme/        — lightTheme, spacing, typography
  packages/
    types/            — Shared TypeScript interfaces (@repo/types)
  docs/
    blueprint/        — Design specs, data model, feature flows
```

## Auth Conventions

**No authentication in this prototype.** Purchases are anonymous. The backend has no JWT guard. The mobile app has no login screen.

## API Conventions

- All NestJS controllers use the `/api/` prefix
- Validation via `class-validator` DTOs with global `ValidationPipe`
- API base URL: `process.env.EXPO_PUBLIC_API_URL` (default: `http://localhost:3001`)
- Returns standard NestJS JSON responses

## State Management

- **Server state**: TanStack Query (`useQuery`, `useMutation`)
- **Client state**: Zustand — `apps/mobile/src/store/voucher.store.ts` tracks selected voucher; feature stores added alongside each feature

## Styling Conventions

- React Native Paper components for interactive elements
- `StyleSheet.create()` for custom styles
- Design tokens from `apps/mobile/src/theme/` — import `spacing`, `typography`, `lightTheme`
- Primitive layout components in `apps/mobile/src/components/ui/`
- Brand primary: #03135e | Background: #ffffff | Text: #020d42 | Error: #b0000a

## Branch Naming

Follow `.claude/skills/git-branch-naming/SKILL.md`.

## Commit Format

Follow `.claude/skills/git-commit/SKILL.md`.
