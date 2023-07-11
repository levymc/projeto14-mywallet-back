import { ObjectId } from 'mongodb';
import { db } from '../app.js';

export function transaction(req, res){
    console.log(req.body, req.headers.authorization)
    res.send(req.body)
}

export function controllerGetTrans(req, res){
    const infoTransac = {
        data: req.data,
        totalTransac: req.total
    }
    res.send(infoTransac)
}

export async function deleteTransac(req, res){
    const id = req.body.id;
    try{
        console.log(id)
        const deleted = await db.collection("transactions").deleteOne({_id: new ObjectId(id)});
        res.send({deletedCount: deleted.deletedCount})
    }catch(err){
        res.status(500).send("A comunicação com o banco de dados falhou...")
    }
}
