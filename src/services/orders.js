import Service from './Service';
    
class OrdersService extends Service {

    constructor(repo) {
        super(repo);
    }
           
    async addOrders(user,data){
        try {
            const sequenceNumber = (await this.repo.getSequenceNumber()).toString();
            data.registeredBy = user.id;
            data.transDate = this.repo.getTransDate();
            data.total= data.order_items.reduce((acc,item)=>acc+(item.qty*item.unit_price),0);
            data.trId= await this.repo.generateTrId('OD');
            data.sqNumber = sequenceNumber.length<5?'0'.repeat(4-sequenceNumber.length)+sequenceNumber:sequenceNumber;
            const {error,item} = await this.repo.insert(data);
            return error ? new this.errorResponse():new this.successResponse({message:"order created.",item});
        } catch (err) {
            return new this.errorResponse()
        }
    }
    async voidOrder(user,orderId){
        try {
            await this.repo.update(orderId,{status:"Void"});
            return new this.successResponse();
        } catch (err) {
           return new this.errorResponse(); 
        }
    }
    async filterByDate(user,query,date){
        try {
            return await this.repo.filterByDate(query,date)
        } catch (err) {
           return new this.errorResponse(); 
        }
    }
    async sumOfOrders(user,query,date){
        try {
            const count = await this.repo.sumOfOrders(query,date);
            return new this.successResponse({count});
        } catch (err) {
           return new this.errorResponse(); 
        }
    }
    async getProductsReport(query){
        try {
            const products = await this.repo.getProductsReport(query);
                return new this.successResponse({items:products||[]});
        } catch (err) {
           return new this.errorResponse(); 
        }
    }
    async getOrdersReport(query){
        try {
            return await this.repo.getOrdersReport(query);
        } catch (err) {
           return new this.errorResponse(); 
        }
    }
};

export default OrdersService;