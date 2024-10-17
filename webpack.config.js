const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
    mode: 'production',
    entry: {
        popup: './src/popup.js',
        content: './src/content.js',
        background: './src/background.js',
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