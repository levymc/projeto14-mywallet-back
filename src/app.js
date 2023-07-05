import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import { schemaCadastro } from './schemas/schemasJoi.js';
import crypto from 'crypto'
import { v4 as uuid } from 'uuid';


dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;


const run = async () => {
    try {
      await mongoClient.connect()
      console.log('Conexão!!!')
      app.listen(process.env.PORT, () => {
          console.log(`Servidor Express rodando na url: http://localhost:${process.env.PORT}`);
      });
    } catch (err) {
      console.error('Erro ao conectar no banco:', err)
    }
    db =  mongoClient.db('projeto14')
};


app.post('/cadastro', async (req, res) => {
    let { nome, email, senha } = req.body;
    // console.log(nome, email, senha, confirmarSenha);
    const hash = crypto.createHash('sha256')
    const { error: validationError } = schemaCadastro.validate({ email, senha });
  
    if (validationError) return res.status(422).send("Erro 422 - Algum dado inválido foi inserido");
    try{
        const token = uuid()
        const participant = await db.collection("cadastro").find({email:{$eq: email}}).toArray()
        console.log(participant)
        if(participant.length != 0) return res.status(409).send("Erro 409 - email já cadastrado.")
        hash.update(senha)
        senha = hash.digest('hex')
        const insertedUser = await db.collection("cadastro").insertOne({nome, email, senha})
        await db.collection("sessoes").insertOne({_id: insertedUser.insertedId,nome , token})
        res.status(201).json({ message: 'Cadastro realizado com sucesso!' , user:{_id: insertedUser.insertedId, nome, email, token}});
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
});
  




run();