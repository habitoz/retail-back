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
            for (let i = 0; i < data.items.length; i++) {
                const date = this.repo.getCurrentDate()
                await this.repo.returnBono({ waiter: data.waiter, product: data.items[i].product, date }, data.items[i].quantity, data.returnedAmount);
            }
            return new this.successResponse();
        } catch (err) {
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