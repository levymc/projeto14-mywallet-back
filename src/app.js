import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import { schemaEmail } from './schemas/schemasJoi.js';


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
    let { nome, email, senha, confirmarSenha } = req.body;
    console.log(nome, email, senha, confirmarSenha);
  
    const { error: validationError } = schemaEmail.validate({ email }); // Renomeando para validationError
  
    console.log(validationError);
  
    if (validationError) { // Usando validationError
      return res.status(422).send("Erro 422 - Algum dado inválido foi inserido");
    }
  
    res.status(200).json({ message: 'Cadastro realizado com sucesso!' });
  });
  




run();