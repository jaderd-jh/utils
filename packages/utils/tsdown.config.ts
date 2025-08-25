import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/core.ts',
    'src/crypto.ts',
    'src/faker.ts',
    'src/msw.ts',
    'src/storage/index.ts',
    'src/storage/react.ts',
    'src/storage/vue.ts',
  ],
  dts: {
    sourcemap: true,
  },
  minify: true,
  publint: true,
  platform: 'browser',
  clean: ['dist'],
})
