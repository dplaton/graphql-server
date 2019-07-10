require('dotenv');

const {ApolloClient, gql} = require('apollo-boost');
const {createHttpLink} = require('apollo-link-http');
const {InMemoryCache} = require('apollo-cache-inmemory');

const client = new ApolloClient({
    link: createHttpLink({
        uri:
            'https://adobeioruntime.net/api/v1/web/platon2/default/graphqlService-dev-graphql/graphql',
        fetch: require('node-fetch')
    }),
    cache: new InMemoryCache()
});

const HELLO_QUERY = gql`
    query {
        hello
    }
`;

client
    .query({query: HELLO_QUERY})
    .then(result => console.log(result))
    .catch(e => console.group(e));
