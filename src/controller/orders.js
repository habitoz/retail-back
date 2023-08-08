import Controller from './Controller';
import OrdersRepo from '../interface/orders.js';
import OrdersService from '../services/orders.js';
    
const orders_service = new OrdersService(OrdersRepo);

class OrdersController extends Controller {

    constructor(service) {
        super(service);
    }
    
    //write your logic in here
    async addOrders(req,res){
        const response = await orders_service.addOrders(req.user,req.body);
        return res.status(response.statusCode).send(response)
    }
    async voidOrder(req,res){
        const response = await orders_service.voidOrder(req.user,req.params.id);
        return res.status(response.statusCode).send(response)
    }
    async filterByDate(req,res){
        const response = await orders_service.filterByDate(req.user,req.query,req.params.date);
        return res.status(response.statusCode).send(response)
    }
    async sumOfOrders(req,res){
        const response = await orders_service.sumOfOrders(req.user,req.query,req.params.date);
        return res.status(response.statusCode).send(response)
    }
    async getProductsReport(req,res){
        const response = await orders_service.getProductsReport(req.query);
        return res.status(response.statusCode).send(response)
    }
    async getOrdersReport(req,res){
        const response = await orders_service.getOrdersReport(req.query);
        return res.status(response.statusCode).send(response)
    }
};

export default new OrdersController(orders_service);