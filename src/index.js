import {ApolloServer, gql} from 'apollo-server';
import typeDefs from './schema.graphql';
import Query from './resolvers/Query';
require('dotenv');

const server = new ApolloServer({typeDefs, resolvers: {Query}});

server.listen().then(({url}) => {
    console.log(`🚀 Server ready at ${url}`);
});
