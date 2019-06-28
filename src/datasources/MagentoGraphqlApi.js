import {GraphQLDataSource} from 'apollo-datasource-graphql';
import productSearch from './productSearch.graphql';

class MagentoGraphqlApi extends GraphQLDataSource {
    constructor() {
        super();
        this.baseURL = process.env.MAGENTO_GRAPHQL_URL;
    }

    async searchProducts(inputText) {
        try {
            const response = await this.query(productSearch, {
                variables: {
                    inputText
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
