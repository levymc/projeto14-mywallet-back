import crypto from 'crypto'
import { v4 as uuid } from 'uuid';
import { db } from '../app.js';
import { schemaCadastro } from '../schemas/schemasJoi.js';

export async function cadastro(req, res){
    let { nome, email, senha } = req.body;
    // console.log(nome, email, senha, confirmarSenha);
    const hash = crypto.createHash('sha256')
    const { error: validationError } = schemaCadastro.validate({ email, senha });
  
    if (validationError) return res.status(422).send("Erro 422 - Algum dado inválido foi inserido");
    try{
        const token = uuid()
        const insertedTime = Date.now()
        const participant = await db.collection("cadastro").find({email:{$eq: email}}).toArray()
        console.log(participant)
        if(participant.length != 0) return res.status(409).send("Erro 409 - email já cadastrado.")
        hash.update(senha)
        senha = hash.digest('hex')
        const insertedUser = await db.collection("cadastro").insertOne({nome, email, senha, insertedTime})
        res.status(201).json({ message: 'Cadastro realizado com sucesso!' , user:{_id: insertedUser.insertedId, nome, email, token, insertedTime}});
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
}