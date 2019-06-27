const path = require('path');
const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack');

// this allows us to load graphql files using the `import` statement
const graphqlRule = {
    test: /\.(graphql|gql)$/,
    exclude: /node_modules/,
    loader: 'graphql-tag/loader'
};

const jsRule = {
    test: /\.js/,
    exclude: /node_modules/,
    use: {
        loader: 'babel-loader',
        options: {
            plugins: ['@babel/plugin-proposal-class-properties']
        }
    }
};

const config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.js'
    },
    module: {
        rules: [graphqlRule, jsRule]
    },
    mode: 'development',
    // we're not going to run it in a browser
    target: 'node',
    // include externals so that webpack can process `fs`, `net`, etc.
    externals: [nodeExternals()],
    plugins: [new Dotenv()]
};

module.exports = config;
