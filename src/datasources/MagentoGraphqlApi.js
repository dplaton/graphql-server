import {GraphQLDataSource} from 'apollo-datasource-graphql';
import {gql} from 'apollo-server';
import productSearch from './productSearch.graphql';

console.log(process.env.MAGENTO_GRAPHQL_URL);
class MagentoGraphqlApi extends GraphQLDataSource {
    baseURL = process.env.MAGENTO_GRAPHQL_URL;

    async searchProducts() {
        try {
            const response = await this.query(productSearch, {
                variables: {
                    inputText: 'omb'
                }
            });
            return response.data.products;
        } catch (e) {
            console.log(`ERROR`);
            console.log(e);
        }
    }
}

export default MagentoGraphqlApi;
