import { v4 as uuid } from 'uuid';
import { db, URI } from '../app.js';
import { schemaCadastro } from '../schemas/schemasJoi.js';
import dayjs from 'dayjs'

export function entrada(req, res){

    console.log(req.body, req.headers.authorization)
    res.send(req.body)
}