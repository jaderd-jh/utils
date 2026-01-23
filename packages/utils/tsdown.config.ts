import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/*.ts', 'src/storage/*.ts'],
  dts: true,
  publint: true,
  platform: 'browser',
  clean: true,
})
