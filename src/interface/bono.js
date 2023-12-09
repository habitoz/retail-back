import BaseRepo from './BaseRepo';
import BonoModel from '../models/bono.js';
import moment from 'moment';
import mongoose from 'mongoose';
const Bono = new BonoModel().getInstance();

class BonoRepo extends BaseRepo {

    constructor(model) {
        super(model);
    }

    async search(query) {
        return await super.search(query);
    }
    async getById(id, query = {}, exclude = []) {
        return await super.getById(id, query, exclude);
    }
    async getOneByCondition(condition, query = {}, exclude = []) {
        return await super.getOneByCondition(condition, query, exclude);
    }
    async getAll(query, exclude = []) {
        query.populate = [{ path: 'waiter', select: 'full_name phone' }, { path: 'product', select: 'name code' }]
        return await super.getAll(query, exclude)
    }
    async checkIfItExists(condition, populate) {
        return await super.checkIfItExists(condition, populate);
    }
    async insert(data, session) {
        return await super.insert(data, session);
    }
    async delete(id) {
        return await super.delete(id)
    }
    getCurrentDate() {
        return moment(moment.now()).format('YYYY-MM-DD');
    }
    async addBono(user, data) {
        const date = moment(moment.now()).format('YYYY-MM-DD');
        const { isPresent, item } = await this.checkIfItExists({ date, waiter: data.waiter, product: data.product });
        if (isPresent) return await this.update(item._id, { $inc: { totalAmount: data.totalAmount, quantity: data.quantity } });
        return await this.insert({ date, registeredBy: user.id, ...data })
    }
    async returnBono(condition, amount, returnedAmount) {
        return await this.updateByCondition(condition, { $inc: { returned: amount, returnedAmount: returnedAmount } });
    }
    async getReport(query) {
        const { from, to = moment(moment.now()).format('YYYY-MM-DD') } = query;
        delete query.from;
        delete query.to;
        const fromDate = from ? moment(from, 'ddd MMM DD YYYY HH:mm:ss').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        const toDate = moment(to, ['ddd MMM DD YYYY HH:mm:ss', 'YYYY-MM-DD']).add(1, 'day').format('YYYY-MM-DD');

        query = fromDate ? { ...query, createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) } } : { ...query, createdAt: { $lte: new Date(toDate) } };
        if (query.waiter) query.waiter = mongoose.Types.ObjectId(query.waiter);
        query.populate = [{ path: 'waiter', select: 'full_name phone' }, { path: 'product', select: 'name code' }];

        return await this.getCompleteData(query)
    }
};

export default new BonoRepo(Bono);