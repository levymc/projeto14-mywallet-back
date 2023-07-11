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

export function sendTransacById(req, res){
    const data = req.data
    res.send(data)
}

export async function updateTransac(req, res){
    console.log("chegou aqui")
    console.log(req.data)
}

// export async function insertTransacValues(req, res, next){
//     const { valor, descricao, type } = req.body
//     const token = req.token
//     const id = req.headers.id;
//     try{
//         await db.collection('transactions').insertOne({valor, descricao, token, type, userId: id, data: dayjs().format('DD/MM')})
        
//         next()
//     }catch(err){
//         next(err)
//     }
// }