import { schemaCadastro } from '../schemas/schemasJoi.js';
import crypto from 'crypto'
import { db } from '../app.js';
import bcrypt from 'bcrypt';


// middleware de validação dos dados de registro
export async function validateRegistrationData(req, res, next) {
    const { nome, email, senha } = req.body;
    const { error: validationError } = schemaCadastro.validate({ email, senha })
  
    if (validationError) {
      return res.status(422).send("Erro 422 - Algum dado inválido foi inserido")
    }
  
    try {
        const participant = await db.collection("cadastro").find({ email: { $eq: email } }).toArray()
      
        if (participant.length !== 0) {
          return res.status(409).send("Erro 409 - email já cadastrado.")
        }
      
        const hashedPassword = bcrypt.hashSync(senha, 10)
        req.body.senha = hashedPassword
        req.registrationData = { nome, email }
        next()
    } catch (err) {
        next(err)
    }
}

// middleware de validação dos dados de login
export async function validateLoginData(req, res, next) {
    let { email, senha } = req.body;
    res.locals.email = email;
    console.log(email,senha)
    
    try {
        const participant = await db.collection("cadastro").findOne({ email: email });
        if (!participant) return res.status(404).send("E-mail não cadastrado.");
        res.locals.participant = participant

        const result = bcrypt.compareSync(senha, participant.senha)
        if (result === false) return res.status(401).send("A senha não confere.");

        const { error: validationError } = schemaCadastro.validate({ email, senha });
        if (validationError) return res.status(422).send("Erro 422 - Algum dado inválido foi inserido");
        
        res.locals.senha = senha;
        next();
        
    } catch (err) {
      next(err);
    }
  }
  