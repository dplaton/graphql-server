const path = require('path');
const nodeExternals = require('webpack-node-externals');

// this allows us to load graphql files using the `import` statement
const graphqlRule = {
    test: /\.(graphql|gql)$/,
    exclude: /node_modules/,
    loader: 'graphql-tag/loader'
};

const config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.js'
    },
    module: {
        rules: [graphqlRule]
    },
    mode: 'development',
    // we're not going to run it in a browser
    target: 'node',
    // include externals so that webpack can process `fs`, `net`, etc.
    externals: [nodeExternals()]
};

module.exports = config;
