import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/aes.ts', 'src/base64.ts', 'src/base64url.ts', 'src/md5.ts'],
  dts: {
    sourcemap: true,
  },
  minify: true,
  publint: true,
  platform: 'browser',
  clean: ['dist'],
})
