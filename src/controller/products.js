import Controller from './Controller';
import ProductsRepo from '../interface/products.js';
import ProductsService from '../services/products.js';

const products_service = new ProductsService(ProductsRepo);

class ProductsController extends Controller {

    constructor(service) {
        super(service);
    }

    async addProduct(req, res) {
        const response = await products_service.addProduct(req.user, req.body);
        return res.status(response.statusCode).send(response);
    }
    async getCompleteProducts(req, res) {
        const response = await products_service.getCompleteProducts(req.query);
        return res.status(response.statusCode).send(response);
    }
    async migrate(req, res) {
        const response = await products_service.migrate();
        return res.status(response.statusCode).send(response)
    }
};

export default new ProductsController(products_service);