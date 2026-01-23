import { defineConfig } from 'tsdown'

const dayjsReferences = `/// <reference types="dayjs/plugin/localeData" />
/// <reference types="dayjs/plugin/duration" />
/// <reference types="dayjs/plugin/relativeTime" />
/// <reference types="dayjs/plugin/customParseFormat" />
/// <reference types="dayjs/plugin/objectSupport" />
`

export default defineConfig({
  dts: true,
  publint: true,
  platform: 'browser',
  clean: true,
  outputOptions: {
    banner: ({ fileName }) => {
      if (fileName.endsWith('.d.ts')) {
        return dayjsReferences
      }
      return ''
    },
  },
})
