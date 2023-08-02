import Service from './Service';
    
class OrdersService extends Service {

    constructor(repo) {
        super(repo);
    }
           
    async addOrders(user,data){
        try {
            data.registeredBy = user.id;
            data.transDate = this.repo.getTransDate();
            data.total= data.order_items.reduce((acc,item)=>acc+(item.qty*item.unit_price),0);
            const {error,item} = await this.repo.insert(data);
            return error ? new this.errorResponse():new this.successResponse({message:"order created.",item});
        } catch (err) {
            return new this.errorResponse()
        }
    }
    async filterByDate(query,date){
        try {
            return await this.repo.filterByDate(query,date)
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