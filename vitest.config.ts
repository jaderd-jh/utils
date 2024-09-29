import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8', // or 'istanbul'
    },
    environment: 'jsdom',
    globals: true,
  },
})
