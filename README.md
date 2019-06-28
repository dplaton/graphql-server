# GraphQL Server research

This is a research project to use a graphql server with multiple data sources. The end goal is to have this as a serverless function in Apache Openwhisk

## How to run the server

1. Clone this repo
2. Run `yarn install`
3. Rename `.env.sample` to `.env` and configure you Mangento cloud instance
4. Run the server with `yarn start`
5. Go to `http://localhost:4000` and enjoy the playground

## What it does so far

-   exposes a [very simple schema](./src/schema.graphql)
-   implements a GraphQLDataSource to retrieve data from the Magento cloud instance
-   allows searching for a product by name and returns the results
