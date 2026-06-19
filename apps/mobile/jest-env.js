/**
 * Custom Jest environment that bridges the jest@30 runtime with
 * @react-native/jest-preset@0.85 (which ships jest-environment-node@29 internally).
 *
 * Problem: jest-runtime@30 calls `environment.moduleMocker.clearMocksOnScope()`,
 * a method added in jest-mock@30. @react-native/jest-preset bundles jest-mock@29
 * which doesn't have that method, causing "clearMocksOnScope is not a function".
 *
 * Fix: subclass the React-Native env, replace its moduleMocker with a
 * jest-mock@30 ModuleMocker so all runtime calls succeed.
 */
'use strict'

const { ModuleMocker } = require(
  '/Applications/Projects/qr-voucher-prototype/node_modules/.pnpm/jest-mock@30.4.1/node_modules/jest-mock/build/index.js',
)

// Load the React-Native environment class (uses jest-environment-node@29 internally)
const RNEnvPath = require.resolve(
  '@react-native/jest-preset/jest/react-native-env.js',
  { paths: [__dirname] },
)
const RNEnv = require(RNEnvPath)

class BridgedEnv extends RNEnv {
  constructor(config, context) {
    super(config, context)
    // Replace the jest@29 moduleMocker with a jest@30 one so
    // jest-runtime@30 can call clearMocksOnScope() without error.
    this.moduleMocker = new ModuleMocker(this.global)
  }
}

module.exports = BridgedEnv
