require('dotenv').config();

const {ApolloClient, gql} = require('apollo-boost');
const {createHttpLink} = require('apollo-link-http');
const {InMemoryCache} = require('apollo-cache-inmemory');

console.log(`Graphql endpoint ${process.env.GRAPHQL_ENDPOINT}`);

const client = new ApolloClient({
    link: createHttpLink({
        uri: process.env.GRAPHQL_ENDPOINT,
        fetch: require('node-fetch')
    }),
    cache: new InMemoryCache()
});

const HELLO_QUERY = gql`
    query {
        products(searchTerm: "acce") {
            name
            sku
        }
    }
`;

client
    .query({query: HELLO_QUERY})
    .then(result => console.log(result))
    .catch(e => console.group(e));
