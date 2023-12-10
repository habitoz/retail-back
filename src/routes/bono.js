import express from 'express';
import Bono from '../controller/bono.js';
import BonoSchema from '../validators/Joi/schemas/bono.js';
import valMiddleware from '../validators/Joi/middleware.js';

const router = express.Router();

router.get('/', Bono.getAll);

router.get('/report', Bono.getReport);

router.get('/detail/:id', Bono.get);

router.put('/:id', valMiddleware(BonoSchema.updateBono), Bono.update);

router.post('/', valMiddleware(BonoSchema.addBono), Bono.addBono);

router.post('/return', valMiddleware(BonoSchema.returnBono), Bono.returnBono);

router.delete('/:id', Bono.delete);

export default router;