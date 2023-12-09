import BaseRepo from './BaseRepo';
import OrdersModel from '../models/orders.js';
import PaymentsModel from '../models/payments';
import moment from 'moment';
import mongoose from 'mongoose';
import SequenceNumberRepo from './sequenceNumber';

const Orders = new OrdersModel().getInstance();
const Payments = new PaymentsModel().getInstance();

class OrdersRepo extends BaseRepo {

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
        query.populate = [{ path: 'waiter', select: 'full_name phone' }, { path: 'order_items.product_id', select: 'name code' }];
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
    getTransDate() {
        return moment().format('YYYY-MM-DD');
    }
    async filterByDate(query, date) {
        const nextDate = moment(date).add(1, 'days').format('YYYY-MM-DD');
        return await this.getAll({ ...query, createdAt: { $gte: date, $lt: nextDate } });
    }
    async sumOfOrders(query, date) {
        const nextDate = moment(date).add(1, 'days').format('YYYY-MM-DD');
        if (query.waiter) query.waiter = mongoose.Types.ObjectId(query.waiter);
        if (query.casher) {
            query.registeredBy = mongoose.Types.ObjectId(query.casher);
            delete query.casher;
        }
        const res = await this.model.aggregate().match({ ...query, createdAt: { $gte: new Date(date), $lt: new Date(nextDate) } })
            .group({
                _id: '',
                count: { $sum: '$total' }
            });
        return res[0].count || 0;
    }
    async generateTrId(prefix = 'L') {
        return prefix + '-' + (Math.random() * 1000000).toFixed(0);
    }
    async getSequenceNumber() {
        const transDate = moment().format('YYYY-MM-DD');
        const { isPresent, item } = await SequenceNumberRepo.checkIfItExists({ date: transDate, sequenceFor: 'Order' });
        if (isPresent) {
            await SequenceNumberRepo.update(item._id, { $inc: { sequence: 1 } });
            return item.sequence + 1;
        }
        const newSequence = {
            date: transDate,
            sequenceFor: 'Order',
            sequence: 1,
        }
        await SequenceNumberRepo.insert(newSequence)
        return 1;

    }
    async getProductsReport(query) {
        const { from, waiter, registeredBy, to = moment(moment.now()).format('YYYY-MM-DD') } = query;
        const fromDate = from ? moment(from, 'ddd MMM DD YYYY HH:mm:ss').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        const toDate = moment(to, ['ddd MMM DD YYYY HH:mm:ss', 'YYYY-MM-DD']).add(1, 'day').format('YYYY-MM-DD');

        query = fromDate ? { ...query, createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) } } : { ...query, createdAt: { $lte: new Date(toDate) } };
        if (waiter) query.waiter = new mongoose.Types.ObjectId(waiter);
        if (registeredBy) query.registeredBy = new mongoose.Types.ObjectId(registeredBy);
        if (!query.status) query.status = 'Active';
        delete query.from;
        delete query.to;
        return await this.model.aggregate().match({ ...query }).unwind('order_items').group({
            _id: '$order_items.product_id',
            productId: {
                $first: '$order_items.product_id'
            },
            totalProducts: {
                $sum: '$order_items.qty'
            },
            totalAmount: {
                $sum: { $multiply: ['$order_items.qty', '$order_items.unit_price'] }
            },

        }).lookup({
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product"
        })
    }
    async getProductsListReport(query) {
        const { from, waiter, registeredBy, to = moment(moment.now()).format('YYYY-MM-DD') } = query;
        const fromDate = from ? moment(from, 'ddd MMM DD YYYY HH:mm:ss').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        const toDate = moment(to, ['ddd MMM DD YYYY HH:mm:ss', 'YYYY-MM-DD']).add(1, 'day').format('YYYY-MM-DD');

        query = fromDate ? { ...query, createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) } } : { ...query, createdAt: { $lte: new Date(toDate) } };
        if (waiter) query.waiter = new mongoose.Types.ObjectId(waiter);
        if (registeredBy) query.registeredBy = new mongoose.Types.ObjectId(registeredBy);
        if (!query.status) query.status = 'Active';
        delete query.from;
        delete query.to;
        return await this.model.aggregate().match({ ...query }).unwind('order_items').sort({ createdAt: -1 }).lookup({
            from: "products",
            localField: "order_items.product_id",
            foreignField: "_id",
            as: "product"
        }).lookup({
            from: "users",
            localField: "registeredBy",
            foreignField: "_id",
            as: "casher"
        })
    }
    async getOrdersReport(query) {
        const { from, to = moment(moment.now()).format('YYYY-MM-DD') } = query;
        const fromDate = from ? moment(from, 'ddd MMM DD YYYY HH:mm:ss').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        const toDate = moment(to, ['ddd MMM DD YYYY HH:mm:ss', 'YYYY-MM-DD']).add(1, 'day').format('YYYY-MM-DD');

        query = fromDate ? { ...query, createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) } } : { ...query, createdAt: { $lte: new Date(toDate) } };
        if (!query.status) query.status = 'Active';
        if (query.status === "All") delete query.status;
        delete query.from;
        delete query.to;
        query.populate = [{ path: 'registeredBy', select: 'full_name phone' }, { path: 'waiter', select: 'full_name phone' }];
        return await this.getCompleteData(query)
    }
    async getCahersOrderReport(query) {
        const { from, to = moment(moment.now()).format('YYYY-MM-DD') } = query;
        const fromDate = from ? moment(from, 'ddd MMM DD YYYY HH:mm:ss').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        const toDate = moment(to, ['ddd MMM DD YYYY HH:mm:ss', 'YYYY-MM-DD']).add(1, 'day').format('YYYY-MM-DD');

        query = fromDate ? { ...query, createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) } } : { ...query, createdAt: { $lte: new Date(toDate) } };
        if (!query.status) query.status = 'Active';

        delete query.from;
        delete query.to;

        const order = await this.model.aggregate().match({ ...query }).unwind('order_items').group({
            _id: '$registeredBy',
            totalOrderdAmount: {
                $sum: { $multiply: ['$order_items.qty', '$order_items.unit_price'] }
            },

        }).lookup({
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "casher"
        });
        const payment = await Payments.aggregate().match({ ...query }).unwind('order_items').group({
            _id: '$registeredBy',
            totalPaymentAmount: {
                $sum: { $multiply: ['$order_items.qty', '$order_items.unit_price'] }
            },

        }).lookup({
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "casher"
        });
        if (!order) return payment;
        if (!payment) return order;
        for (let i = 0; i < payment.length; i++) {
            const orderIndex = order.findIndex((orItem) => String(orItem._id) == String(payment[i]._id))
            if (orderIndex < 0) order.push({ ...payment[i], totalOrderdAmount: 0 });
            else order[orderIndex].totalPaymentAmount = payment[i].totalPaymentAmount
        }
        return order;
    }
};

export default new OrdersRepo(Orders);