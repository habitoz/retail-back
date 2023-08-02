import Controller from './Controller';
import EmployeesRepo from '../interface/employees.js';
import EmployeesService from '../services/employees.js';
    
const employees_service = new EmployeesService(EmployeesRepo);

class EmployeesController extends Controller {

    constructor(service) {
        super(service);
    }

    async addEmployee(req,res){
        const response = await employees_service.addEmployee(req.user,req.body);
        return res.status(response.statusCode).send(response)
    }
    async getCompleteEmployees(req,res){
        const response = await employees_service.getCompleteEmployees(req.query);
        return res.status(response.statusCode).send(response);
    }
};

export default new EmployeesController(employees_service);