const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const { EnvironmentPlugin } = require('webpack')

module.exports = merge(common, {
    plugins: [
        new EnvironmentPlugin({
            DEBUG: false,
        }),
    ]
})