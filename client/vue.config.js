module.exports = {
  configureWebpack: {
    devServer: {
      proxy: { // '/' too generic
        '^/api': { target: 'http://localhost:3000' },
        '^/auth': { target: 'http://localhost:3000' },
        '^/t': { target: 'http://localhost:3000' },
        '^/l': { target: 'http://localhost:3000' },
        '^/o': { target: 'http://localhost:3000' },
        '^/g': { target: 'http://localhost:3000' },
        '^/a': { target: 'http://localhost:3000' }
      }
    },
    ignoreWarnings: [ // ignoring HTML-related warnings
      warning => {
        const message = warning.message || '';
        const moduleResource = warning.module && warning.module.resource || '';
        const warningOrigin = warning.origin && warning.origin.resource || '';

        return (
          message.includes('vue-loader/dist/templateLoader.js') ||
          moduleResource.includes('vue&type=template') ||
          warningOrigin.includes('vue&type=template')
        ) && (
          message.includes('according to HTML specifications') ||
          message.includes('cannot be child of') ||
          message.includes('has no matching end tag') ||
          message.includes('Element is missing end tag')
        );
      }
    ]
  },
  // lintOnSave: false
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.js',
      title: 'MAIN10ANCE Viewer',
    },
  }
}
