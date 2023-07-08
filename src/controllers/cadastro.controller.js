import crypto from 'crypto'
import { v4 as uuid } from 'uuid';
import { db } from '../app.js';
import { schemaCadastro } from '../schemas/schemasJoi.js';
import dayjs from 'dayjs'


export async function cadastro(req, res) {
    const { nome, email } = req.registrationData;
    const { senha } = req.body;
  
    try {
      const token = uuid();
      const insertedTime = Date.now();
      const dateNow = dayjs().format('DD/MM/YYYY HH:mm:s');
  
      const insertedUser = await db.collection("cadastro").insertOne({ nome, email, senha, insertedTime, dateNow });
  
      res.status(201).json({ message: 'Cadastro realizado com sucesso!', user: { _id: insertedUser.insertedId, nome, email, token, dateNow } });
    } catch (err) {
      next(err)
    }
  }