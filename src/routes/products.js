import express from 'express';
import Products from '../controller/products.js';
import ProductsSchema from '../validators/Joi/schemas/products.js';
import valMiddleware from '../validators/Joi/middleware.js';
    
const router = express.Router();
    
router.get('/', Products.getAll);

router.get('/all', Products.getCompleteProducts);

router.get('/detail/:id', Products.get);

router.put('/:id',valMiddleware(ProductsSchema.updateProducts), Products.update);

router.put('/status/:id',valMiddleware(ProductsSchema.statusChange), Products.update);

router.post('/',valMiddleware(ProductsSchema.addProducts), Products.addProduct);

router.delete('/:id', Products.delete);

export default router;