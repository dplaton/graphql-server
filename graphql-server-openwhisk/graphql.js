// graphql.js

const {gql} = require('apollo-server-core');
const ApolloServer = require('./ApolloServer');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    type Query {
        hello: String
    }
`;

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        hello: () => 'Hello world!'
    }
};
console.log(`[graphql] Building the server...`);
const server = new ApolloServer({typeDefs, resolvers});

module.exports.graphqlHandler = server.createHandler({
    cors: {
        origin: '*',
        credentials: true
    }
});
