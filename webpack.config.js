/**
 * @fileoverview Webpack configuration file.
 * @author preetvadaliya@gmail.com (Preet P. Vadaliya)
 */

const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    target: 'web',
    mode: 'development',
    entry: {
        index: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: '[name].js',
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new CopyPlugin({
            patterns: [{
                from: path.resolve(__dirname, 'public'),
                to: path.resolve(__dirname, 'docs'),
            }],
        }),
        // Copy over media resources from the Blockly package
        new CopyPlugin({
            patterns: [{
                from: path.resolve(__dirname, './node_modules/blockly/media'),
                to: path.resolve(__dirname, 'docs/media'),
            }],
        }),
    ],
    devServer: {
        port: 3000,
    }
};