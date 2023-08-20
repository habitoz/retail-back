import Service from './Service';
    
class PaymentsService extends Service {

    constructor(repo) {
        super(repo);
    }
           
    async addPayments(user,data){
        try {
            const sequenceNumber = (await this.repo.getSequenceNumber()).toString();
            data.registeredBy = user.id;
            data.transDate = this.repo.getTransDate();
            data.total= data.order_items.reduce((acc,item)=>acc+(item.qty*item.unit_price),0);
            data.trId= await this.repo.generateTrId('PY');
            data.sqNumber = sequenceNumber.length<5?'0'.repeat(4-sequenceNumber.length)+sequenceNumber:sequenceNumber;

            const {error, item} = await this.repo.insert(data);
            return error ? new this.errorResponse():new this.successResponse({message:"order created.",item});
        } catch (err) {
            return new this.errorResponse()
        }
    }
    async sumOfPayments(user,query,date){
        try {
            const count = await this.repo.sumOfPayments(query,date);
            return new this.successResponse({count});
        } catch (err) {
           return new this.errorResponse(); 
        }
    }
    async voidPayment(user,paymentId){
        try {
            await this.repo.update(paymentId,{status:"Void"});
            return new this.successResponse();
        } catch (err) {
           return new this.errorResponse(); 
        }
    }
    async filterByDate(query,date){
        try {
            return await this.repo.filterByDate(query,date)
        } catch (err) {
           return new this.errorResponse(); 
        }
    }
    async getPaymentsReport(query){
        try {
            return await this.repo.getPaymentsReport(query)
        } catch (err) {
           return new this.errorResponse(); 
        }
    }
    async crossCheck(query,date){
        try {
            const items = await this.repo.crossCheck(query,date);
            return new this.successResponse({items})
        } catch (err) {
           return new this.errorResponse(); 
        }
    }

};

export default PaymentsService;