import crypto from 'crypto';
import { v4 as uuid } from 'uuid';
import { db, URI } from '../app1.js';
import { schemaCadastro } from '../schemas/schemasJoi.js';
import dayjs from 'dayjs'


export async function login(req, res) {;
    const email = res.locals.email
    let senha = res.locals.senha
    const insertedTime = Date.now();
    const dateNow = dayjs().format('DD/MM/YYYY HH:mm:s');
    const token = uuid();

    try {
        const { error: validationError } = schemaCadastro.validate({ email, senha });
        const participant = await db.collection("cadastro").findOne({ email: email });
        console.log(validationError)
        if (!participant) {
            return res.status(404).send("E-mail não cadastrado.");
        } 
        if (participant.senha !== senha) {
            return res.status(401).send("A senha não confere.");
        }
        if (validationError) {
            return res.status(422).send("Erro 422 - Algum dado inválido foi inserido");
        }
        await db.collection("sessoes").insertOne({userId: participant._id ,nome: participant.nome , token, insertedTime, date:dateNow})
        console.log('Aqui meu')
        res.send("Login!");
    } catch (err) {
        res.status(500).send(err.message);
    }
}
