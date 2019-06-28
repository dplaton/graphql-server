import {GraphQLDataSource} from 'apollo-datasource-graphql';
import productSearch from './productSearch.graphql';

class MagentoGraphqlApi extends GraphQLDataSource {
    constructor({url}) {
        super();
        this.baseURL = url;
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
