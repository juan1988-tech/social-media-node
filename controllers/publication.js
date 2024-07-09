const Publication = require('../models/publication')
const jwt = require('jwt-simple')
const { secret } = require('../services/jwt');

const pruebaPublish = (req,res) =>{
    return res.status(200).send({
        messasge: "mensaje enviado desde el archivo publication.js"
    })
}

const save = (req,res) =>{
    //recoger datos del usuario
    let params = req.body;

    //sacar la identidad del usuario registrado 
    const userToken = req.headers.authorization.replace(/["']+/g,'');
    const identifiedUser = jwt.decode(userToken,secret);

    //Si no existe el envío entonces enviamos mansaje de error
    if(!params.text){
        return res.status(400).send({
            status:"failed",
            message: "no hay datos enviados por el usuario"
        })
    }
    
    //crea el objeto de la publicacion
    let newPublication = new Publication(params)
    newPublication.user = identifiedUser.id

    //Guardar el objeto en la base de datos
    newPublication.save()
    .then((newPublicItem)=>{
        if(!newPublicItem){
            return res.status(400).send({
                status:"failed",
                message: "no hay datos enviados por el usuario"
            })
        }

        return res.status(200).send({
            status: "success",
            message:"publicacion realizada",
            newPublication,    
            identifiedUser
        })
    })
}

module.exports = { pruebaPublish, save } 