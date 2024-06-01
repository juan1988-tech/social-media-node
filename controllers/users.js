//Importar usuarios y modulos
const User = require('../models/user')

const pruebaUser = (req,res) =>{
    return res.status(200).send({
        messasge: "mensaje enviado desde el archivo user.js"
    })
}

const register = (req,res)=>{
    //recoger los parametros que nos llegan por la peticion
    let params = req.body;

    //Comprobar que los datos que me lleguen bien
    if(!params.name || !params.email || !params.nick ){
        console.log('petición invalida')
        return res.status(400).json({
            status: "error",
            messasge: "Faltan datos por enviar",
        })
    }
    let userSaved = new User(params);

    //Control de usuarios duplicados
    User.find({ $or:[
        {email: userSaved.email.toLowerCase()},
        {nick: userSaved.nick.toLowerCase()}
    ]}).exec().then(
        (error)=>{
            if(!userSaved){
                res.status(500).json({
                    message: "Error en la consulta de usuarios"
                })
            }
            if(userSaved && userSaved.length >=1){
                return res.status(200).send({
                    status: "success",
                    message: "El usuario ya existe"
                })
            }
              //Crear el objeto que guarda el usuario
            return res.status(200).json({
                messasge: "Acción de registro de usuarios",
                userSaved
            })  
        }
    )
}

module.exports = { pruebaUser, register } 