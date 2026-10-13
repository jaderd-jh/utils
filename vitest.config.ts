import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8', // or 'istanbul'
      include: ['**/src/**'],
      exclude: ['**/dist/**', '**/node_modules/**'],
    },
    environment: 'jsdom',
    // e2e 用例运行在浏览器模式（Playwright + headless Chromium），由各包自带的 vitest 配置驱动
    exclude: [...configDefaults.exclude, '**/tests/e2e/**'],
    globals: true,
  },
})
