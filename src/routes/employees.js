import express from 'express';
import Employees from '../controller/employees.js';
import EmployeesSchema from '../validators/Joi/schemas/employees.js';
import valMiddleware from '../validators/Joi/middleware.js';
    
const router = express.Router();
    
router.get('/', Employees.getAll);

router.get('/detail/:id', Employees.get);

router.get('/all', Employees.getCompleteEmployees);

router.put('/:id',valMiddleware(EmployeesSchema.updateEmployees), Employees.update);

router.put('/status/:id',valMiddleware(EmployeesSchema.statusChange), Employees.update);

router.post('/',valMiddleware(EmployeesSchema.addEmployees), Employees.addEmployee);

router.delete('/:id', Employees.delete);

export default router;