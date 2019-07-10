import MagentoGraphqlApi from '../datasources/MagentoGraphqlApi';

export default {
    products: async (parent, args, {dataSources}, info) => {
        const searchTerm = args.searchTerm;
        console.log(`Searching for ${searchTerm}`);
        const result = await dataSources.magentoGraphqlApi.searchProducts(
            searchTerm
        );

        const products = result.items.map(item => {
            return {
                name: item.name,
                sku: item.sku
            };
        });

        return products;
    },

    cart: async (parent, args, {dataSources}, info) => {
        const cartId = args.cartId;
        if (!cartId) {
            throw new Error('You have to supply a cart id');
        }
        try {
            const cart = await dataSources.magentoRestApi
                .getCart(cartId)
                .catch(e => console.log(e));
            return {
                id: cart.id,
                currency: cart.currency.global_currency_code,
                items: cart.items
            };
        } catch (e) {
            console.error(e);
        }
    }
};
