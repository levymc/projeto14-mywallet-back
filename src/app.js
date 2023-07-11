import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/routes.js';


dotenv.config()
const app1 = express()
const TTL = 3600


app1.use(cors())
app1.use(express.json())
app1.use(express.urlencoded({ extended: true }));
app1.use(router);


app1.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Erro interno no servidor');
});


let mode = 'prod';
export const URI = mode === 'dev' ?  process.env.DATABASE_URL_DEV : process.env.DATABASE_URL;


const mongoClient = new MongoClient(URI);
export let db;


const run = async () => {
    try {
      await mongoClient.connect()
      console.log('Conexão!!!')
      app1.listen(process.env.PORT, () => {
          console.log(`Servidor Express rodando na url: http://localhost:${process.env.PORT}`);
      });
    } catch (err) {
      console.error('Erro ao conectar no banco:', err)
    }
    db =  mongoClient.db()
}

run();

process.once('SIGUSR2', function () {
    process.kill(process.pid, 'SIGUSR2');
});