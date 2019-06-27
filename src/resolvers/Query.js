import MagentoGraphqlApi from '../datasources/MagentoGraphqlApi';

const magentoApi = new MagentoGraphqlApi();

export default {
    products: async () => {
        const products = await magentoApi.searchProducts();
        console.log(products);
    }
};
