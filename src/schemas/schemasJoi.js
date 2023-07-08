import Joi from 'joi';

export const schemaCadastro = Joi.object({
    email: Joi.string().email().required(),
    senha: Joi.string().min(3).required()
})

export const schemaNome = Joi.object({
    nome: Joi.string().min(1).required()
})