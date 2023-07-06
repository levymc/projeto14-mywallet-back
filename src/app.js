import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import { schemaCadastro } from './schemas/schemasJoi.js';
import crypto from 'crypto'
import { v4 as uuid } from 'uuid';
import { cadastro } from './controllers/cadastro.controller.js';
import { login } from './controllers/login.controller.js';


dotenv.config()
const app = express()
const TTL = 3600

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

let mode = 'dev';



export const URI = mode === 'dev' ?  process.env.DATABASE_URL_DEV : process.env.DATABASE_URL;


const mongoClient = new MongoClient(URI, {useNewUrlParser: true, useUnifiedTopology: true});
export let db;


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


app.post('/cadastro', cadastro);
  

app.post('/login', login);



run();

