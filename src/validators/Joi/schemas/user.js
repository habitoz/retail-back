import Joi from 'joi';

const addUser = Joi.object().keys({
    full_name:Joi.string().required(),
    username:Joi.string().required(),
    phone:Joi.string(),
    email:Joi.string().email(),
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

const signIn = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

export default {
    addUser,
    signIn,
    updateUser
}