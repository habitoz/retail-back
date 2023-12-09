import Joi from 'joi';

const addBono = Joi.object().keys({
    waiter: Joi.string().required(),
    returnedAmount: Joi.number(),
    items: Joi.array().items(Joi.object().keys({
        product: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.number().min(0).required(),
    }))
});

const updateBono = Joi.object().keys({

});

const statusChange = Joi.object().keys({

});

export default {
    addBono,
    updateBono,
    statusChange
};