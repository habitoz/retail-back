import Service from './Service';
    
class EmployeesService extends Service {

    constructor(repo) {
        super(repo);
    }
    
    async addEmployee(user,data){
        try {
            if(data.phone) {
                const {isPresent} = await this.repo.checkIfItExists({phone:data.phone});
                if(isPresent) return new this.errorResponse('phone already taken.',403);
            }
            data.registeredBy=user.id;
            const {error}=await this.repo.insert(data);
            return error ? new this.errorResponse(): new this.successResponse({message:'product created.'})
        } catch (err) {
            return new this.errorResponse()
        }
    }

    async getCompleteEmployees(query){
        try {
            return await this.repo.getCompleteData(query);
        } catch (err) {
            return new this.errorResponse()
        }
    }
};

export default EmployeesService;