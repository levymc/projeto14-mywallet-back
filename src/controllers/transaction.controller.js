import { v4 as uuid } from 'uuid';
import { db, URI } from '../app.js';
import { schemaCadastro } from '../schemas/schemasJoi.js';
import dayjs from 'dayjs'

export function transaction(req, res){
    console.log(req.body, req.headers.authorization)
    res.send(req.body)
}

export function controllerGetTrans(req, res){
    res.send(req.data)
}