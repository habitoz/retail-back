import Joi from 'joi';

const addEmployees = Joi.object().keys({
    full_name:Joi.string().required(),
    phone:Joi.string(),
    gender:Joi.string(),
    description:Joi.string(),
});

const updateEmployees = Joi.object().keys({
    full_name:Joi.string(),
    phone:Joi.string(),
    gender:Joi.string(),
    description:Joi.string(),
    status:Joi.string().valid(['Active','Inactive'])
});

const statusChange = Joi.object().keys({
    status:Joi.string().required().valid(['Active','Inactive'])
});

export default {
    addEmployees,
    updateEmployees,
    statusChange
};
