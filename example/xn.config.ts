import { defineConfig } from '@xn-sakina/meta'
// import { dirname } from 'path'

export default defineConfig({
  compile: 'swc',
  cssMinify: 'parcelCss',
  jsMinify: 'esbuild',
  alias: {
    // 'react-router-dom': dirname(
    //   require.resolve('react-router-dom-630/package.json')
    // )
  },
})
