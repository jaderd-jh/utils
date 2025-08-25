import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: {
    sourcemap: true,
  },
  minify: true,
  publint: true,
  platform: 'browser',
  clean: ['dist'],
})
