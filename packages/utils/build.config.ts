import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/core',
    'src/crypto',
    'src/faker',
    'src/msw',
    'src/storage/index',
    'src/storage/react',
    'src/storage/vue',
  ],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
})
