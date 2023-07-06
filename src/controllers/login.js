import crypto from 'crypto'
import { v4 as uuid } from 'uuid';
import { db, URI } from '../app.js';
import { schemaCadastro } from '../schemas/schemasJoi.js';

export async function login(req, res){
    console.log(URI)
    let { email, senha } = req.body;
    const hash = crypto.createHash('sha256')
    const { error: validationError } = schemaCadastro.validate({ email, senha });
    if (validationError) return res.status(422).send("Erro 422 - Algum dado inválido foi inserido");
    try{
        const token = uuid()
        const insertedTime = Date.now()

        hash.update(senha)
        senha = hash.digest('hex')
        console.log(email, senha)
        const participant = await db.collection("cadastro").findOne({ email: email });
        console.log(1231231231231231231312)
        console.log(111111, participant)
        // await db.collection("sessoes").insertOne({_id: participant._id ,participant , token, insertedTime})
        if(!participant){
            res.status(404).send("E-mail não cadastrado.")
        } else if(participant.senha != senha){
            res.status(401).send("A senha não confere.")
        }
        console.log(participant )
        res.send(participant)
    }catch(err){
        res.status(500).send(err.message)
    }
}