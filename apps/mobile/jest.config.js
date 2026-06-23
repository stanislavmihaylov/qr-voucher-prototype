module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Note: jest@29.7.0 is pinned in devDependencies to match jest-expo@56's peer expectations.
  // jest@30 was previously resolving here but jest-expo ships @jest-internals@29 which
  // is incompatible (missing clearMocksOnScope in jest-mock@29).
  // Extend jest-expo's pattern to also allow react-native-svg to be transformed.
  // NOTE: must include '.pnpm' to allow pnpm virtual-store paths to be transformed.
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|standard-navigation|react-native-svg))',
    '/node_modules/react-native-reanimated/plugin/',
    '/node_modules/@react-native/babel-preset/',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@repo/types$': '<rootDir>/../../packages/types/src/index.ts',
    '\\.svg$': '<rootDir>/__mocks__/svgMock.tsx',
  },
}
