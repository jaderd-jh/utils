import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/react.ts', 'src/vue.ts'],
  dts: true,
  publint: true,
  platform: 'browser',
  clean: true,
  external: ['@vueuse/core', 'vue', 'jotai'],
})
