import Joi from 'joi';

const addOrders = Joi.object().keys({
    waiter:Joi.string().required(),
    table_no:Joi.string(),
    order_items:Joi.array().required().items(Joi.object().keys({
        product_id:Joi.string().required(),
        qty:Joi.number().min(0).required(),
        unit_price:Joi.number().min(0).required()
    }))
});

const updateOrders = Joi.object().keys({
       
});

const statusChange = Joi.object().keys({
       
});

export default {
    addOrders,
    updateOrders,
    statusChange
};