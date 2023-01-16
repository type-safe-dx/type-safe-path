import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: { reporter: 'lcov' },
    exclude: ['object-pattern/**', 'node_modules/**'],
    globalSetup: 'test/setup.ts',
  },
})
