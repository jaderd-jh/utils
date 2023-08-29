import { readFile, writeFile } from 'node:fs/promises'
import { defineBuildConfig } from 'unbuild'

const dayjsReferences = `/// <reference types="dayjs/esm/plugin/localeData" />
/// <reference types="dayjs/esm/plugin/duration" />
/// <reference types="dayjs/esm/plugin/relativeTime" />
/// <reference types="dayjs/esm/plugin/customParseFormat" />
/// <reference types="dayjs/esm/plugin/objectSupport" />
`

export default defineBuildConfig({
  entries: ['src/index'],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
  hooks: {
    'build:done': ctx => {
      ;['ts', 'mts', 'cts'].forEach(ext => {
        readFile(`${ctx.options.outDir}/index.d.${ext}`, 'utf-8').then(content => {
          writeFile(`${ctx.options.outDir}/index.d.${ext}`, dayjsReferences + content).then(() => {
            // eslint-disable-next-line no-console
            console.log(`dayjs references added in index.d.${ext}`)
          })
        })
      })
    },
  },
})
