# ApolloServer implementation for OpenWhisk

This is an ApolloServer implementation that runs in OpenWhisk.

## How do I install it?

Make sure you have `serverless` install globally, so run an `npm i -g serverless`

1. Clone this repository
2. Run `yarn install` to install everything
3. Rename `.env.sample` to `.env` and configure your endpoints
4. Run `serverless install` to install it in OpenWhisk

The name of the action is hardcoded as `graphqlService-dev-graphql` (update your `serverless.yml` file if you don't fancy this).

## How do I access it?

Option 1: Open your favorite GraphQL client, point it to the `<your ow instance>/graphqlService-dev-graphql` endpoint and start querying.

Option 2: Open the action URL in your favourite browser and you should get the GraphQL playground page
