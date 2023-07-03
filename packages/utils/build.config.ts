import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index', 'src/core', 'src/crypto', 'src/faker', 'src/storage'],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
})
