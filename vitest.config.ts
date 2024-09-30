import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8', // or 'istanbul'
      include: ['**/src/**'],
      exclude: ['**/dist/**', '**/node_modules/**'],
    },
    environment: 'jsdom',
    globals: true,
  },
})
