import Service from './Service';

class BonoService extends Service {

    constructor(repo) {
        super(repo);
    }

    async addBono(user, data) {
        try {
            for (let i = 0; i < data.items.length; i++) {
                const totalAmount = data.items[i].quantity * data.items[i].price;
                const { error } = await this.repo.addBono(user, { waiter: data.waiter, ...data.items[i], totalAmount });
            }
            return new this.successResponse();
        } catch (err) {
            return new this.errorResponse()
        }
    }
    async returnBono(user, data) {
        try {
            const date = this.repo.getCurrentDate();
            for (let i = 0; i < data.items.length; i++) {
                data.items[i].quantity = Number(data.items[i].quantity)
                const { isPresent, item } = await this.repo.checkIfItExists({ waiter: data.waiter, product: data.items[i].product, date });
                if (!isPresent) return new this.errorResponse('no previous order by the waiter.', 403);
                if (item.returned + data.items[i].quantity > item.quantity) return new this.errorResponse('quantity exceeds previous order.', 403);
            }
            for (let i = 0; i < data.items.length; i++) {
                await this.repo.returnBono({ waiter: data.waiter, product: data.items[i].product, date }, data.items[i].quantity, data.items[i].returnedAmount);
            }
            return new this.successResponse();
        } catch (err) {
            console.log(err);
            return new this.errorResponse()
        }
    }
    async getReport(user, query) {
        try {
            return await this.repo.getReport(query)
        } catch (err) {
            return new this.errorResponse()
        }
    }
};

export default BonoService;