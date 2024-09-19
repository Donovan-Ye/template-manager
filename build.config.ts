import { fileURLToPath } from 'node:url'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  failOnWarn: false,
  entries: [
    'src/index',
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
  alias: {
    '@': fileURLToPath(new URL('./', import.meta.url)),
  },
})
