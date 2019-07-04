require('dotenv');
const {
    introspectSchema,
    makeRemoteExecutableSchema,
    ApolloServer
} = require('apollo-server');

const fetch = require('node-fetch');
const {HttpLink} = require('apollo-link-http');

const buildServer = async () => {
    const link = new HttpLink({uri: process.env.MAGENTO_GRAPHQL_URL, fetch});
    const schema = await introspectSchema(link);
    const executableSchema = makeRemoteExecutableSchema({
        schema,
        link
    });
    const server = new ApolloServer({
        schema: executableSchema
    });

    server
        .listen()
        .then(({url}) => {
            console.log(`🚀 Server ready at ${url}`);
        })
        .catch(e => {
            throw new Error(e);
        });
};

buildServer();
