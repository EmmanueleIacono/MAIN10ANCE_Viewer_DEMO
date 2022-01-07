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
}
