const path = require('path');
const nodeExternals = require('webpack-node-externals');
const config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.js'
    },
    mode: 'development',
    target: 'node',

    // node: {
    //     fs: 'empty',
    //     net: 'empty'
    // },
    externals: [nodeExternals()]
};

module.exports = config;
