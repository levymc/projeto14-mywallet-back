import { db } from "../app.js"

export async function deleteSessao(req, res){
    
    const token = req.body.token
    try{
        console.log(token)
        const deleted = await db.collection("sessoes").deleteOne({token})
        res.send({deletedCount: deleted.deletedCount})
    }catch(err){
        res.status(500).send("A comunicação com o banco de dados falhou...")
    }
}