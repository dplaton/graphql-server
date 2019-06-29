import {ApolloServer, gql} from 'apollo-server';
import typeDefs from './schema.graphql';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';

import MagentoGraphqlApi from './datasources/MagentoGraphqlApi';
import MagentoRestApi from './datasources/MagentoRestApi';

require('dotenv');

const server = new ApolloServer({
    typeDefs,
    resolvers: {Query, Mutation},
    dataSources: () => {
        return {
            magentoGraphqlApi: new MagentoGraphqlApi({
                url: process.env.MAGENTO_GRAPHQL_URL
            }),
            magentoRestApi: new MagentoRestApi({
                url: process.env.MAGENTO_REST_URL
            })
        };
    }
});

server.listen().then(({url}) => {
    console.log(`🚀 Server ready at ${url}`);
});
