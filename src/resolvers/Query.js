import MagentoGraphqlApi from '../datasources/MagentoGraphqlApi';

export default {
    products: async (parent, args, {dataSources}, info) => {
        const searchTerm = args.searchTerm;
        console.log(`Searching for ${searchTerm}`);
        const {items} = await dataSources.magentoApi.searchProducts(searchTerm);

        const products = items.map(item => {
            return {
                name: item.name,
                sku: item.sku
            };
        });

        return products;
    }
};
