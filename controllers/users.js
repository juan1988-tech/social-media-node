//Importar usuarios y modulos
const User = require('../models/user')
const bcrypt = require('bcrypt');

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
        return res.status(400).json({
            status: "error",
            messasge: "Faltan datos por enviar",
        })
    }
    
    //Control de usuarios duplicados
    User.find({ $or:[
        { email: params.email.toLowerCase() },
        { nick: params.nick.toLowerCase() }
    ]}).exec().then(
        async (users)=>{
            if(!users){
                res.status(500).json({
                    status: "Error",
                    message: "Error en la consulta de usuarios"
                })
            }
            if(users && users.length >=1){
                return res.status(200).send({
                    status: "success",
                    message: "El usuario ya existe"
                })
            }

            //cifrar la contraseña
            let pwd = await bcrypt.hash(params.password,10);
            params.password = pwd;

            let userSaved = new User(params);

            //crear el objeto del usuario

            userSaved.save()
            .then((userStored)=>{
                    if(!userStored){
                        return res.status(500).send({
                            status: "error",
                            message:"error al guardar el usuario"
                        })}
                        
                        return res.status(200).json({
                            messasge: "Usuario registrado correctamente",
                            user: userStored
                            })            
                        })
        })
}

module.exports = { pruebaUser, register } 