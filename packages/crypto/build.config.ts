import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index', 'src/key'],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
})
