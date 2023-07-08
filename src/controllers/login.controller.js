import { v4 as uuid } from 'uuid';
import { db, URI } from '../app.js';
import { schemaCadastro } from '../schemas/schemasJoi.js';
import dayjs from 'dayjs'


export async function login(req, res) {;
    const insertedTime = Date.now();
    const dateNow = dayjs().format('DD/MM/YYYY HH:mm:s');
    const token = uuid();
    const participant = res.locals.participant

    try {
        await db.collection("sessoes").insertOne({userId: participant._id ,nome: participant.nome , token, insertedTime, date:dateNow})
        console.log('Sessão Inserida com Sucesso!')
        res.send({userId: participant._id ,nome: participant.nome , token, insertedTime});
    } catch (err) {
        res.status(500).send(err.message);
    }
}
