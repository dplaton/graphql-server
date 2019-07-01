import {RESTDataSource} from 'apollo-datasource-rest';

class MagentoRestApi extends RESTDataSource {
    constructor({url}) {
        super();
        this.baseURL = url;
    }

    async createCart() {
        return this.post(`guest-carts`);
    }

    async getCart(cartId) {
        return this.get(`guest-carts/${cartId}`);
    }
}

export default MagentoRestApi;
