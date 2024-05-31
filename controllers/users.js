const pruebaUser = (req,res) =>{
    return res.status(200).send({
        messasge: "mensaje enviado desde el archivo user.js"
    })
}

module.exports = { pruebaUser } 