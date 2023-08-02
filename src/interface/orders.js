import BaseRepo from './BaseRepo';
import OrdersModel from '../models/orders.js';
import moment from 'moment';
import mongoose from 'mongoose';

const Orders=new OrdersModel().getInstance();

class OrdersRepo extends BaseRepo {

        constructor(model) {
            super(model);
        }

    async search(query){
        return await super.search(query);
    }
    async getById(id, query = {}, exclude = []) {
        return await super.getById(id,query,exclude);
    }
    async getOneByCondition(condition, query = {}, exclude = []) {
        return await super.getOneByCondition(condition,query,exclude);
    }
    async getAll(query, exclude = []) {
        query.populate = [{path:'waiter',select:'full_name phone'},{path:'order_items.product_id',select:'name code'}];
       return await super.getAll(query, exclude)
    }
    async checkIfItExists(condition,populate) {
        return await super.checkIfItExists(condition,populate);
    }
    async insert(data, session) {
        return await super.insert(data, session);
    }
    async delete(id) {
        return await super.delete(id)
    }

    //write your logic in here
    getTransDate(){
        return moment().format('YYYY-MM-DD');
    }
    async filterByDate(query,date){
        const nextDate=moment(date).add(1,'days').format('YYYY-MM-DD');
        return await this.getAll({...query,createdAt:{$gte:date,$lt:nextDate}});
    }

    async getProductsReport(query){
        const { from, waiter, to = moment(moment.now()).format('YYYY-MM-DD') } = query;
        const fromDate= from ? moment(from,'ddd MMM DD YYYY HH:mm:ss').format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
        const toDate= moment(to,['ddd MMM DD YYYY HH:mm:ss','YYYY-MM-DD']).add(1,'day').format('YYYY-MM-DD');
        
        query = fromDate ? {...query, createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) } } : {...query, createdAt: { $lte: new Date(toDate) } };
        if(waiter) query.waiter = mongoose.Types.ObjectId(waiter);
        delete query.from;
        delete query.to;
        return await this.model.aggregate().match({ ...query }).unwind('order_items').group({
            _id: '$order_items.product_id',
            productId:{
                $first:'$order_items.product_id'
            },
            totalProducts:{
                $sum:'$order_items.qty'
            },
            totalAmount:{
                $sum:{$multiply:['$order_items.qty','$order_items.unit_price']}
            },

        }).lookup({
            from: "products",
         localField: "productId",
         foreignField: "_id",  
         as: "product"
        })
    }
    async getOrdersReport(query){
        const { from, to = moment(moment.now()).format('YYYY-MM-DD') } = query;
        const fromDate= from ? moment(from,'ddd MMM DD YYYY HH:mm:ss').format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
        const toDate= moment(to,['ddd MMM DD YYYY HH:mm:ss','YYYY-MM-DD']).add(1,'day').format('YYYY-MM-DD');
        
        query = fromDate ? {...query, createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) } } : {...query, createdAt: { $lte: new Date(toDate) } };
        
        delete query.from;
        delete query.to;
        query.populate=[{path:'registeredBy',select:'full_name phone'}, {path:'waiter',select:'full_name phone'}];
        return await this.getCompleteData(query)
    }
};

export default new OrdersRepo(Orders);