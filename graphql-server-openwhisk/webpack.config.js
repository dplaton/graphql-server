const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack');

const graphqlRule = {
    test: /\.(graphql|gql)$/,
    exclude: /node_modules/,
    loader: 'graphql-tag/loader'
};

module.exports = {
    entry: slsw.lib.entries,
    output: {
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js'
    },
    module: {
        rules: [graphqlRule]
    },
    target: 'node',
    mode: 'development',
    optimization: {
        // We no not want to minimize our code.
        minimize: false
    },
    externals: [nodeExternals()],
    plugins: [new Dotenv()]
};
