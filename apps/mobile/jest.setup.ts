/**
 * Global Jest setup — runs after the test framework is installed.
 *
 * Problem: TanStack Query's `notifyManager` batches React state updates via
 * `setTimeout`. In Jest + React 19, these `setTimeout` callbacks fire outside
 * React's `act()` context, producing:
 *   - "An update … was not wrapped in act(…)"
 *   - "overlapping act() calls"
 *
 * These warnings cascade into real failures: subsequent tests can't find UI
 * elements because the component's async updates are never applied.
 *
 * Fix: replace the scheduler with a synchronous callback so all notifications
 * fire immediately within the same `act()` tick.
 *
 * Reference: https://tanstack.com/query/latest/docs/framework/react/guides/testing
 */
import { notifyManager } from '@tanstack/react-query'

beforeAll(() => {
  notifyManager.setScheduler((callback) => callback())
})
