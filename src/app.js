import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import { schemaCadastro } from './schemas/schemasJoi.js';
import crypto from 'crypto'
import { v4 as uuid } from 'uuid';


dotenv.config()
const app = express()
const TTL = 3600

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
    db =  mongoClient.db()
};


app.post('/cadastro', async (req, res) => {
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
        await db.collection("sessoes").insertOne({_id: insertedUser.insertedId,nome , token, insertedTime})
        res.status(201).json({ message: 'Cadastro realizado com sucesso!' , user:{_id: insertedUser.insertedId, nome, email, token, insertedTime}});
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
});
  

app.post('/login', async (req, res) => {
    let { email, senha } = req.body;
    const hash = crypto.createHash('sha256')
    const { error: validationError } = schemaCadastro.validate({ email, senha });
    console.log(123)
    if (validationError) return res.status(422).send("Erro 422 - Algum dado inválido foi inserido");
    try{
        hash.update(senha)
        senha = hash.digest('hex')
        console.log(email, senha)
        const participant = await db.collection("cadastro").findOne({$and: [
            { email : {$eq: email} },
            { senha : {$eq: senha} }
            ]
        })
        if(participant.length === 0){
            
        }
        console.log(participant )
        res.send(participant)
    }catch(err){

    }
});



run();