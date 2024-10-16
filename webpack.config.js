const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
    mode: 'production',
    entry: {
        popup: './src/popup.js',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './public',
                    to: './',
                },
            ],
        })
    ]
}

module.exports = config;