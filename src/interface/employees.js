import BaseRepo from './BaseRepo';
import EmployeesModel from '../models/employees.js';
    
const Employees=new EmployeesModel().getInstance();

class EmployeesRepo extends BaseRepo {

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
};

export default new EmployeesRepo(Employees);