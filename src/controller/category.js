import Controller from './Controller';
import CategoryRepo from '../interface/category.js';
import CategoryService from '../services/category.js';

const category_service = new CategoryService(CategoryRepo);

class CategoryController extends Controller {

    constructor(service) {
        super(service);
    }

    //write your logic in here
    async addNew(req, res) {
        const response = await category_service.addNew(req.user, req.body);
        return res.status(response.statusCode).send(response);
    }
    async updateCategory(req, res) {
        const response = await category_service.updateCategory(req.user, req.body, req.params.id);
        return res.status(response.statusCode).send(response);
    }
    async deleteCategory(req, res) {
        const response = await CategoryRepo.update(req.params.id, { status: "Inactive" });
        return res.status(response.statusCode).send(response);
    }
    async getAllActive(req, res) {
        const response = await category_service.getAllActive(req.query);
        return res.status(response.statusCode).send(response);
    }
};

export default new CategoryController(category_service);