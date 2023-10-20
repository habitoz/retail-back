import Joi from 'joi';

const addCategory = Joi.object().keys({
    name: Joi.string().required(),
    code: Joi.string().required(),
    description: Joi.string(),
});

const updateCategory = Joi.object().keys({
    name: Joi.string(),
    code: Joi.string(),
    status: Joi.string().valid(['Active', 'Inactive']),
    description: Joi.string(),
});

const statusChange = Joi.object().keys({
    status: Joi.string().required().valid(['Active', 'Inactive'])
});

export default {
    addCategory,
    updateCategory,
    statusChange
};