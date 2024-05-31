const pruebaPublish = (req,res) =>{
    return res.status(200).send({
        messasge: "mensaje enviado desde el archivo publication.js"
    })
}

module.exports = { pruebaPublish } 