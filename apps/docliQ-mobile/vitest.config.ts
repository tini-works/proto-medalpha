import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,

    // CSS disabled - tests use toHaveClass() not computed styles
    css: false,

    // Thread-based execution for better parallelism
    pool: 'threads',

    // Test isolation: each test file runs in fresh context
    // Pros: prevents state leakage, more reliable
    // Cons: slight overhead per file (~50-100ms)
    isolate: true,

    // Resource optimization
    maxConcurrency: 2,
    maxWorkers: 2,
    minWorkers: 1,

    sequence: {
      concurrent: false,
      shuffle: false,
    },

    // Retry once to handle occasional flakiness
    retry: 1,

    // Show all failures (don't stop early)
    bail: 0,
    passWithNoTests: false,

    // Timeouts
    testTimeout: 8000,
    hookTimeout: 8000,

    // No coverage by default
    coverage: {
      enabled: false,
    },

    reporters: ['default'],

    include: [
      'src/**/__tests__/**/*.test.{ts,tsx}',
      'src/test/**/*.test.{ts,tsx}',
    ],
  },
})
