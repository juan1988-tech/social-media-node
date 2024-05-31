const pruebaFollow = (req,res) =>{
    return res.status(200).send({
        messasge: "mensaje enviado desde el archivo follow.js"
    })
}

module.exports = { pruebaFollow } 