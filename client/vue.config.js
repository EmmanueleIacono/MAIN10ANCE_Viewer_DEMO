module.exports = {
    configureWebpack: {
        devServer: {
            proxy: {
                '/': {
                    target: 'http://localhost:3000',
                }
            }
        }
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
