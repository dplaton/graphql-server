const Mutation = {
    createCart: async (parent, args, {dataSources}, info) => {
        console.log(`Creating cart...`);
        const cartQuote = await dataSources.magentoRestApi.createCart();
        const cart = await dataSources.magentoRestApi.getCart(cartQuote);

        return {
            id: cart.id,
            quote: cartQuote,
            items: cart.items,
            currency: cart.currency.global_currency_code
        };
    }
};
export default Mutation;
