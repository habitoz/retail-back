import BaseRepo from './BaseRepo';
import PaymentsModel from '../models/payments.js';
import OrdersRepo from './orders';
import moment from 'moment';

const Payments=new PaymentsModel().getInstance();

class PaymentsRepo extends BaseRepo {

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
        return await this.getAll({...query,createdAt:{$gte:new Date(date),$lt:new Date(nextDate)}});
    }
    async crossCheck(query,date){
        const payment = await this.model.aggregate().match({transDate:date}).group({_id:'$waiter',total:{$sum:'$total'}});
        const orders = await OrdersRepo.model.aggregate().match({transDate:date}).group({_id:'$waiter',total:{$sum:'$total'}});
        return {
            payment,
            orders
        }
    }
    async getPaymentsReport(query){
        const { from, to = moment(moment.now()).format('YYYY-MM-DD') } = query;
        const fromDate= from ? moment(from,'ddd MMM DD YYYY HH:mm:ss').format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
        const toDate= moment(to,['ddd MMM DD YYYY HH:mm:ss','YYYY-MM-DD']).add(1,'day').format('YYYY-MM-DD');
        
        query = fromDate ? {...query, createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) } } : {...query, createdAt: { $lte: new Date(toDate) } };
        
        delete query.from;
        delete query.to;
        query.populate=[{path:'registeredBy',select:'full_name phone'},{path:'waiter',select:'full_name phone'}];
        return await this.getCompleteData(query)
    }
};

export default new PaymentsRepo(Payments);