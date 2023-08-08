import Joi from 'joi';

const addUser = Joi.object().keys({
    full_name:Joi.string().required(),
    email:Joi.string().required(),
    password:Joi.string().required(),
    role:Joi.string().required().valid(['manager', 'admin', 'casher']),
    status:Joi.string().valid(['Active', 'Suspended']),
    description:Joi.string()
});
const updateUser = Joi.object().keys({
    full_name:Joi.string(),
    email:Joi.string(),
    role:Joi.string().valid(['manager', 'admin', 'casher']),
    status:Joi.string().valid(['Active', 'Suspended']),
    description:Joi.string()
});

export default {
    addUser,
    updateUser
}