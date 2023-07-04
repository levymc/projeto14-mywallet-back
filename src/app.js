import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import { schemaCadastro } from './schemas/schemasJoi.js';
import crypto from 'crypto'


dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;
const hash = crypto.createHash('sha256')

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
    let { nome, email, senha, confirmarSenha } = req.body;
    // console.log(nome, email, senha, confirmarSenha);
  
    const { error: validationError } = schemaCadastro.validate({ email, senha }); // Renomeando para validationError
  
    if (validationError) { // Usando validationError
      return res.status(422).send("Erro 422 - Algum dado inválido foi inserido");
    }
    hash.update(senha)
    senha = hash.digest('hex')
    console.log(senha) // Senha criptografada em sha256
    res.status(200).json({ message: 'Cadastro realizado com sucesso!' });
  });
  




run();