import express from 'express';
import Payments from '../controller/payments.js';
import PaymentsSchema from '../validators/Joi/schemas/payments.js';
import valMiddleware from '../validators/Joi/middleware.js';
    
const router = express.Router();
    
router.get('/', Payments.getAll);

router.get('/detail/:id', Payments.get);

router.get('/payment-summary-report', Payments.getPaymentsReport);

router.get('/filterByDate/:date', Payments.filterByDate);

router.get('/cross-check/:date', Payments.crossCheck);

router.get('/sum/:date', Payments.sumOfPayments);

router.put('/update/:id',valMiddleware(PaymentsSchema.updatePayments), Payments.update);

router.put('/void/:id',valMiddleware(PaymentsSchema.statusChange), Payments.voidPayment);

router.post('/',valMiddleware(PaymentsSchema.addPayments), Payments.addPayments);

router.delete('/:id', Payments.delete);

export default router;