import BaseRepo from './BaseRepo';
import PaymentsModel from '../models/payments.js';
import OrdersRepo from './orders';
import SequenceNumberRepo from './sequenceNumber';
import moment from 'moment';
import mongoose from 'mongoose';

const Payments = new PaymentsModel().getInstance();

class PaymentsRepo extends BaseRepo {

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

    //write your logic in here
    async generateTrId(prefix = 'PM') {
        return prefix + '-' + (Math.random() * 1000000).toFixed(0);
    }
    async sumOfPayments(query, date) {
        const nextDate = moment(date).add(1, 'days').format('YYYY-MM-DD');
        if (query.waiter) query.waiter = mongoose.Types.ObjectId(query.waiter);
        if (query.casher) {
            query.registeredBy = mongoose.Types.ObjectId(query.casher);
            delete query.casher;
        }
        const res = await this.model.aggregate().match({ ...query, createdAt: { $gte: new Date(date), $lte: new Date(nextDate) } })
            .group({
                _id: '',
                count: { $sum: '$total' }
            });
        return res[0].count || 0;
    }
    async getSequenceNumber() {
        const transDate = moment().format('YYYY-MM-DD');
        const { isPresent, item } = await SequenceNumberRepo.checkIfItExists({ date: transDate, sequenceFor: 'Payment' });
        if (isPresent) {
            await SequenceNumberRepo.update(item._id, { $inc: { sequence: 1 } });
            return item.sequence + 1;
        }
        const newSequence = {
            date: transDate,
            sequenceFor: 'Payment',
            sequence: 1,
        }
        await SequenceNumberRepo.insert(newSequence)
        return 1;

    }

    getTransDate() {
        return moment().format('YYYY-MM-DD');
    }
    async filterByDate(query, date) {
        const nextDate = moment(date).add(1, 'days').format('YYYY-MM-DD');
        return await this.getAll({ ...query, createdAt: { $gte: new Date(date), $lt: new Date(nextDate) } });
    }
    async crossCheck(query, date) {
        if (query.waiter) query.waiter = mongoose.Types.ObjectId(query.waiter);
        if (query.casher) {
            query.registeredBy = mongoose.Types.ObjectId(query.casher);
            delete query.casher;
        }
        if (!query.status) query.status = 'Active';

        const payment = await this.model.aggregate().match({ ...query, transDate: date }).group({ _id: '$waiter', total: { $sum: '$total' } });
        const orders = await OrdersRepo.model.aggregate().match({ ...query, transDate: date }).group({ _id: '$waiter', total: { $sum: '$total' } });
        return {
            payment,
            orders
        }
    }
    async getPaymentsReport(query) {
        const { from, to = moment(moment.now()).format('YYYY-MM-DD') } = query;
        const fromDate = from ? moment(from, 'ddd MMM DD YYYY HH:mm:ss').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        const toDate = moment(to, ['ddd MMM DD YYYY HH:mm:ss', 'YYYY-MM-DD']).add(1, 'day').format('YYYY-MM-DD');
        if (!query.status) query.status = 'Active';
        if (query.status === "All") delete query.status;

        query = fromDate ? { ...query, createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) } } : { ...query, createdAt: { $lte: new Date(toDate) } };

        delete query.from;
        delete query.to;
        query.populate = [{ path: 'registeredBy', select: 'full_name phone' }, { path: 'waiter', select: 'full_name phone' }];
        return await this.getCompleteData(query)
    }
};

export default new PaymentsRepo(Payments);