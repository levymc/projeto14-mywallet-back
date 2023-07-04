import Joi from 'joi';

export const schemaEmail = Joi.object({
    email: Joi.string().email().required()
})