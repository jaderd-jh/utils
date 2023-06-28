import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index', 'src/vue', 'src/react'],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
})
