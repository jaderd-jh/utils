import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index', 'src/aes', 'src/base64', 'src/base64url', 'src/md5'],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
})
