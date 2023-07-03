import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/core',
    'src/crypto',
    'src/faker',
    { input: 'src/storage/', outDir: 'dist/storage/', format: 'cjs', ext: 'cjs' },
    { input: 'src/storage/', outDir: 'dist/storage/', format: 'esm' },
  ],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
})
