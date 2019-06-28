import {ApolloServer, gql} from 'apollo-server';
import typeDefs from './schema.graphql';
import Query from './resolvers/Query';

import MagentoGraphqlApi from './datasources/MagentoGraphqlApi';

require('dotenv');

const server = new ApolloServer({
    typeDefs,
    resolvers: {Query},
    dataSources: () => {
        return {
            magentoApi: new MagentoGraphqlApi({
                url: process.env.MAGENTO_GRAPHQL_URL
            })
        };
    }
});

server.listen().then(({url}) => {
    console.log(`🚀 Server ready at ${url}`);
});
