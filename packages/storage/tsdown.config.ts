import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/react.ts', 'src/vue.ts'],
  dts: {
    sourcemap: true,
  },
  minify: true,
  publint: true,
  platform: 'browser',
  clean: ['dist'],
  external: ['@vueuse/core', '@vueuse/shared', 'jotai'],
})
