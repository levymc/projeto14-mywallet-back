

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