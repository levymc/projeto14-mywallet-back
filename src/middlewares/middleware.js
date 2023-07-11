import { schemaCadastro, schemaNome, schemaTransacValues } from '../schemas/schemasJoi.js';
import crypto from 'crypto'
import { db } from '../app.js';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';

// middleware de validação dos dados de registro
export async function validateRegistrationData(req, res, next) {
    const { nome, email, senha } = req.body;
    const { error: validationError } = schemaCadastro.validate({ email, senha })
    const { error: validationErrorNome } = schemaNome.validate({ nome })
  
    if (validationError || validationErrorNome) {
      return res.status(422).send("Algum dado inválido foi inserido")
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
    res.locals.email = email
    
    try {
        const participant = await db.collection("cadastro").findOne({ email: email })
        if (!participant) return res.status(404).send("E-mail não cadastrado.")
        res.locals.participant = participant

        const result = bcrypt.compareSync(senha, participant.senha)
        if (result === false) return res.status(401).send("A senha não confere.")

        const { error: validationError } = schemaCadastro.validate({ email, senha })
        if (validationError) return res.status(422).send("Algum dado inválido foi inserido")
        
        res.locals.senha = senha
        next()
        
    } catch (err) {
      next(err);
    }
}


//middleware de validação dos valores inputados tanto em entrada como em saida
export function validateTransacValues(req, res, next){
    const { valor, descricao, type } = req.body
    const { error: validationError} = schemaTransacValues.validate({ valor, descricao })
    if (validationError) return res.status(422).send("Algum dado inválido foi inserido");
    next()
}


export async function validateToken(req, res, next){
    const authorizationHeader = req.headers.authorization;
    let token
    if (authorizationHeader) {
        token = authorizationHeader.split(" ")[1]
        req.token = token
    }else return res.sendStatus(401)
    try{
        const participant = db.collection('sessoes').findOne({token})
        if (!participant) return res.status(401).send("Não autorizado!");
        next()

    }catch(err){
        next(err)
    }
}


export async function insertTransacValues(req, res, next){
    const { valor, descricao, type } = req.body
    const token = req.token
    const id = req.headers.id;
    try{
        await db.collection('transactions').insertOne({valor, descricao, token, type, userId: id, data: dayjs().format('DD/MM')})
        
        next()
    }catch(err){
        next(err)
    }
}
  

export async function getTransactions(req, res, next){
    const id = req.headers.id;
    const token = req.token
    try{
        const data = await db.collection("transactions").find({ userId: id }).toArray()      
        req.data = data
        next()
    }catch(err){
        next(err)
    }
}

export async function getTotalTransaction(req, res, next){

    try{
        const somaValores = await db.collection("transactions").aggregate([
            {
              $match: { "userId": req.headers.id }
            },
            {
              $group: {
                _id: null,
                total: {
                  $sum: {
                    $cond: [
                      { $eq: ["$type", "entrada"] },
                      { $toDouble: "$valor" },
                      { $multiply: [{ $toDouble: "$valor" }, -1] }
                    ]
                  }
                }
              }
            }
          ]).toArray()
        //   console.log(somaValores)      
          req.total = somaValores
          next()
    }catch(err){
        next(err)
    }
    
}