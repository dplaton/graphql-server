import MagentoGraphqlApi from '../datasources/MagentoGraphqlApi';

const magentoApi = new MagentoGraphqlApi();

export default {
    products: async () => {
        const {items} = await magentoApi.searchProducts('aug');

        const products = items.map(item => {
            return {
                name: item.name,
                sku: item.sku
            };
        });

        return products;
    }
};
