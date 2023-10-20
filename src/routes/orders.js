import express from 'express';
import Orders from '../controller/orders.js';
import OrdersSchema from '../validators/Joi/schemas/orders.js';
import valMiddleware from '../validators/Joi/middleware.js';

const router = express.Router();

router.get('/', Orders.getAll);

router.get('/detail/:id', Orders.get);

router.get('/product-summary-report', Orders.getProductsReport);

router.get('/product-list-report', Orders.getProductsListReport);

router.get('/order-summary-report', Orders.getOrdersReport);

router.get('/order-casher-report', Orders.getCahersOrderReport);

router.get('/filterByDate/:date', Orders.filterByDate);

router.get('/sum/:date', Orders.sumOfOrders);

router.put('/:id', valMiddleware(OrdersSchema.updateOrders), Orders.update);

router.post('/', valMiddleware(OrdersSchema.addOrders), Orders.addOrders);

router.delete('/void/:id', Orders.voidOrder);

export default router;