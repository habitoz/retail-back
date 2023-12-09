import Joi from 'joi';

const addProducts = Joi.object().keys({
    name: Joi.string().required(),
    code: Joi.string().required(),
    order: Joi.number(),
    category: Joi.string().required(),
    status: Joi.string(),
    price: Joi.number().min(0).required(),
    bonoPrice: Joi.number().min(0),
    isBono: Joi.boolean(),
    description: Joi.string(),
});

const updateProducts = Joi.object().keys({
    name: Joi.string(),
    code: Joi.string(),
    category: Joi.string(),
    status: Joi.string(),
    order: Joi.number(),
    price: Joi.number().min(0),
    isBono: Joi.boolean(),
    bonoPrice: Joi.number().min(0),
    description: Joi.string(),
});

const statusChange = Joi.object().keys({
    status: Joi.string().required().valid(['Active', 'Inactive'])
});

export default {
    addProducts,
    updateProducts,
    statusChange
};
