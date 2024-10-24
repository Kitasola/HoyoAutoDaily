const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
    mode: 'production',
    entry: {
        popup: './src/popup.js',
        content: './src/content.js',
        // content_HG0: './src/HG0/content.js',
        // content_HG1: './src/HG1/content.js',
        // content_HG2: './src/HG2/content.js',
        background: './src/background.js',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        clean: true,
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './public',
                    to: './',
                },
            ],
        }),
    ]
}

module.exports = config;