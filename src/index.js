import {ApolloServer, gql} from 'apollo-server';
import typeDefs from './schema.graphql';

const books = [
    {
        title: 'The Stand',
        author: 'Stephen King'
    },
    {
        title: 'Foundation',
        author: 'Isaac Asimov'
    }
];

const resolvers = {
    Query: {
        books: () => books
    }
};

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
    console.log(`🚀 Server ready at ${url}`);
});
