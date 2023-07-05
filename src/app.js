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

let mode = 'dev';



const URI = mode === 'dev' ?  process.env.DATABASE_URL_DEV : process.env.DATABASE_URL;


const mongoClient = new MongoClient(URI, {useNewUrlParser: true, useUnifiedTopology: true});
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
        res.status(201).json({ message: 'Cadastro realizado com sucesso!' , user:{_id: insertedUser.insertedId, nome, email, token, insertedTime}});
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
});
  

app.post('/login', async (req, res) => {
    console.log(URI)
    let { email, senha } = req.body;
    const hash = crypto.createHash('sha256')
    const { error: validationError } = schemaCadastro.validate({ email, senha });
    if (validationError) return res.status(422).send("Erro 422 - Algum dado inválido foi inserido");
    try{
        const token = uuid()
        const insertedTime = Date.now()

        hash.update(senha)
        senha = hash.digest('hex')
        console.log(email, senha)
        const participant = await db.collection("cadastro").findOne({ email: email });
        console.log(1231231231231231231312)
        console.log(111111, participant)
        // await db.collection("sessoes").insertOne({_id: participant._id ,participant , token, insertedTime})
        if(!participant){
            res.status(404).send("E-mail não cadastrado.")
        } else if(participant.senha != senha){
            res.status(401).send("A senha não confere.")
        }
        console.log(participant )
        res.send(participant)
    }catch(err){
        res.status(500).send(err.message)
    }
});



run();