import Joi from 'joi';

const addBono = Joi.object().keys({
    waiter: Joi.string().required(),
    items: Joi.array().items(Joi.object().keys({
        product: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.number().min(0).required(),
    }))
});
const returnBono = Joi.object().keys({
    waiter: Joi.string().required(),
    items: Joi.array().items(Joi.object().keys({
        product: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.number().min(0).required(),
        returnedAmount: Joi.number().min(0),
    }))
});

const updateBono = Joi.object().keys({

});

const statusChange = Joi.object().keys({

});

export default {
    addBono,
    returnBono,
    updateBono,
    statusChange
};