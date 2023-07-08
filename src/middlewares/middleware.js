import { schemaCadastro } from '../schemas/schemasJoi.js';
import crypto from 'crypto'
import { v4 as uuid } from 'uuid';
import { db } from '../app.js';


// Middleware para tratar erros
export function handleErr(){
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).send('Erro interno no servidor');
    });
} 


// middleware de validação dos dados de registro
export async function validateRegistrationData(req, res, next) {
    const { nome, email, senha } = req.body;
    const hash = crypto.createHash('sha256');
    const { error: validationError } = schemaCadastro.validate({ email, senha });
  
    if (validationError) {
      return res.status(422).send("Erro 422 - Algum dado inválido foi inserido");
    }
  
    try {
      const participant = await db.collection("cadastro").find({ email: { $eq: email } }).toArray();
  
      if (participant.length !== 0) {
        return res.status(409).send("Erro 409 - email já cadastrado.");
      }
  
      hash.update(senha);
      req.body.senha = hash.digest('hex');
      req.registrationData = { nome, email };
      next();
    } catch (err) {
      next(err); // Encaminha o erro para o middleware de tratamento de erros
    }
  }