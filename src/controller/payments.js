import Controller from './Controller';
import PaymentsRepo from '../interface/payments.js';
import PaymentsService from '../services/payments.js';

const payments_service = new PaymentsService(PaymentsRepo);

class PaymentsController extends Controller {

    constructor(service) {
        super(service);
    }

    //write your logic in here
    async addPayments(req, res) {
        const response = await payments_service.addPayments(req.user, req.body);
        return res.status(response.statusCode).send(response)
    }
    async voidPayment(req, res) {
        const response = await payments_service.voidPayment(req.user, req.params.id);
        return res.status(response.statusCode).send(response)
    }
    async filterByDate(req, res) {
        const response = await payments_service.filterByDate(req.user, req.query, req.params.date);
        return res.status(response.statusCode).send(response)
    }
    async sumOfPayments(req, res) {
        const response = await payments_service.sumOfPayments(req.user, req.query, req.params.date);
        return res.status(response.statusCode).send(response)
    }
    async getPaymentsReport(req, res) {
        const response = await payments_service.getPaymentsReport(req.user, req.query);
        return res.status(response.statusCode).send(response)
    }
    async crossCheck(req, res) {
        if (req.user.role === 'casher') {
            req.query.casher = req.user.id;
        }
        const response = await payments_service.crossCheck(req.query, req.params.date);
        return res.status(response.statusCode).send(response)
    }
};

export default new PaymentsController(payments_service);