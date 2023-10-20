import Service from './Service';

class OrdersService extends Service {

    constructor(repo) {
        super(repo);
    }

    async addOrders(user, data) {
        try {
            const sequenceNumber = (await this.repo.getSequenceNumber()).toString();
            data.registeredBy = user.id;
            data.transDate = this.repo.getTransDate();
            data.total = data.order_items.reduce((acc, item) => acc + (item.qty * item.unit_price), 0);
            data.trId = await this.repo.generateTrId('OD');
            data.sqNumber = sequenceNumber.length < 5 ? '0'.repeat(4 - sequenceNumber.length) + sequenceNumber : sequenceNumber;
            const { error, item } = await this.repo.insert(data);
            return error ? new this.errorResponse() : new this.successResponse({ message: "order created.", item });
        } catch (err) {
            return new this.errorResponse()
        }
    }
    async voidOrder(user, orderId) {
        try {
            await this.repo.update(orderId, { status: "Void" });
            return new this.successResponse();
        } catch (err) {
            return new this.errorResponse();
        }
    }
    async filterByDate(user, query, date) {
        try {
            if (!query.casher) query.registeredBy = user.id;
            return await this.repo.filterByDate(query, date)
        } catch (err) {
            return new this.errorResponse();
        }
    }
    async sumOfOrders(user, query, date) {
        try {
            if (!query.status) query.status = 'Active';
            if (!query.casher) {
                query.casher = user.id;
            }
            const count = await this.repo.sumOfOrders(query, date);
            return new this.successResponse({ count });
        } catch (err) {
            return new this.errorResponse();
        }
    }
    async getProductsReport(user, query) {
        try {
            if ((!query.casher && user.role === 'casher') || query.casher === 'own') {
                query.registeredBy = user.id;
                delete query.casher;
            }
            const products = await this.repo.getProductsReport(query);
            return new this.successResponse({ items: products || [] });
        } catch (err) {
            return new this.errorResponse();
        }
    }
    async getProductsListReport(user, query) {
        try {
            if ((!query.casher && user.role === 'casher') || query.casher === 'own') {
                query.registeredBy = user.id;
                delete query.casher;
            }
            const products = await this.repo.getProductsListReport(query);
            return new this.successResponse({ items: products || [] });
        } catch (err) {
            return new this.errorResponse();
        }
    }
    async getOrdersReport(user, query) {
        try {
            if (user.role === 'casher' && !query.registeredBy) {
                query.registeredBy = user.id;
            }
            return await this.repo.getOrdersReport(query);
        } catch (err) {
            return new this.errorResponse();
        }
    }
    async getCahersOrderReport(query) {
        try {
            const response = await this.repo.getCahersOrderReport(query);
            return new this.successResponse({ items: response })
        } catch (err) {
            return new this.errorResponse();
        }
    }
};

export default OrdersService;