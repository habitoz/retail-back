import Controller from './Controller';
import BonoRepo from '../interface/bono.js';
import BonoService from '../services/bono.js';

const bono_service = new BonoService(BonoRepo);

class BonoController extends Controller {

    constructor(service) {
        super(service);
    }

    async getAll(req, res) {
        if (!req.query.date) {
            req.query.date = bono_service.repo.getCurrentDate();
        }
        const response = await bono_service.repo.getAll({ ...req.query });
        return res.status(response.statusCode).send(response);
    }
    async addBono(req, res) {
        const response = await bono_service.addBono(req.user, req.body);
        return res.status(response.statusCode).send(response);
    }
    async returnBono(req, res) {
        const response = await bono_service.returnBono(req.user, req.body);
        return res.status(response.statusCode).send(response);
    }
    async getReport(req, res) {
        const response = await bono_service.getReport(req.user, req.query);
        return res.status(response.statusCode).send(response);
    }
};

export default new BonoController(bono_service);