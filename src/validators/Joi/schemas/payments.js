import Joi from 'joi';

const addPayments = Joi.object().keys({
    waiter:Joi.string().required(),
    table_no:Joi.string(),
    order_items:Joi.array().required().items(Joi.object().keys({
        product_id:Joi.string().required(),
        qty:Joi.number().min(0).required(),
        unit_price:Joi.number().min(0).required()
    }))
});

const updatePayments = Joi.object().keys({
       
});

const statusChange = Joi.object().keys({
       status:Joi.string().required().valid(['Void'])
});

export default {
    addPayments,
    updatePayments,
    statusChange
};