/**
 * This is the main OpenWhisk function. It instantiate our custom ApolloServer
 */
import ApolloServer from './src/ApolloServer';
import Query from './src/resolvers/Query';
import Mutation from './src/resolvers/Mutation';
import typeDefs from './src/schema.graphql';
import MagentoGraphqlApi from './src/datasources/MagentoGraphqlApi';
import MagentoRestApi from './src/datasources/MagentoRestApi';

console.log(`[graphql] Building the server...`);
const server = new ApolloServer({
    typeDefs,
    resolvers: {Query, Mutation},
    introspection: true,
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

const graphqlHandler = server.createHandler({});
export {graphqlHandler};
