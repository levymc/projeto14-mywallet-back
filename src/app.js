import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

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





run();