const path = require('path');
const UglifyPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    entry: {
        "main": [
            'babel-polyfill',
            './src/index.js'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/', // need to config public Path in order to hot reload html
        filename: 'index.js'
    },
    module: {
        rules: [
            // JS
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new UglifyPlugin({
            sourceMap: true,
            uglifyOptions: {
                compress: true,
                mangle: false
            }
        })
    ]
};