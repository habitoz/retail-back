import Service from './Service';
    
class ProductsService extends Service {

    constructor(repo) {
        super(repo);
    }
           
    async addProduct(user,data){
        try {
            const {isPresent} = await this.repo.checkIfItExists({code:data.code});
            if(isPresent) return new this.errorResponse('code already taken.',403);
            data.registeredBy=user.id;
            const {error}=await this.repo.insert(data);
            return error ? new this.errorResponse(): new this.successResponse({message:'product created.'})
        } catch (err) {
            return new this.errorResponse()
        }
    }
    async getCompleteProducts(query){
        try {
            return await this.repo.getCompleteData(query);
        } catch (err) { 
            return new this.errorResponse()
        }
    }
};

export default ProductsService;