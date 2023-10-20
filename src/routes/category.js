import express from 'express';
import Category from '../controller/category.js';
import CategorySchema from '../validators/Joi/schemas/category.js';
import valMiddleware from '../validators/Joi/middleware.js';

const router = express.Router();

router.get('/', Category.getAll);

router.get('/active', Category.getAllActive);

router.get('/detail/:id', Category.get);

router.put('/:id', valMiddleware(CategorySchema.updateCategory), Category.updateCategory);

router.post('/', valMiddleware(CategorySchema.addCategory), Category.addNew);

router.delete('/:id', Category.deleteCategory);

export default router;