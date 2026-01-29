import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,

    // Resource optimization - max 2 tests at a time
    maxConcurrency: 2,
    maxWorkers: 1,
    minWorkers: 1,

    // Retry failed tests max 2 times, then skip
    retry: 2,

    // Stop suite on first failure (after retries exhausted)
    bail: 1,
    passWithNoTests: false,

    // Timeouts
    testTimeout: 10000,
    hookTimeout: 10000,

    // Reporter to show retry attempts
    reporters: ['default'],
  },
})
