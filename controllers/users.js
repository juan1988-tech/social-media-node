//Importar usuarios y modulos
const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('../services/jwt');
const jsonwebtoken = require('jwt-simple');
const { secret } = require('../services/jwt');

const pruebaUser = async (req,res) =>{        
    
        //decodificar el usuario
        let userToDecode = req.headers.authorization.replace(/["']+/g,'');
        let decodedUser = jsonwebtoken.decode(userToDecode,secret);
        
        return res.status(200).json({
            messasge: "mensaje enviado desde el archivo user.js",
            user: decodedUser
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

const login = (req,res) =>{
    //recoger los datos del usuario
    let params = req.body;


    //buscar en la base de datos si el usuario existe
    if(!params.email || !params.password){
        return res.status(404).send({
            status: "error",
            message: "Faltan datos por enviar"
        })
    }

    User.findOne({email: params.email})
    //.select({"password": 0})
    .then((user)=>{
            if(!user){
                return res.status(404).send({
                    status: "error",
                    message: "No existe el usaurio"
                })
            }   

            let pwd = bcrypt.compareSync(params.password, user.password)
         
            if(!pwd){
                return res.status(400).send({
                    status: "error",
                    message: "No te has identificado correctamente"
                })
            }

            const token = jwt.createToken(user);

            return res.status(200).json({
                status: "success",
                message: "acción de login",
                user:{
                    id: user._id,
                    name: user.name,
                    nick: user.nick,
                },
                token
            })
        }
    ) 
}

const profile = (req,res) =>{
    //recibir los datos del parametro por la url
    const userid = req.params.iduser;

    //retorna la información el usuario a partir del id
    User.findById(userid)
    .select({password: 0, role: 0})
    .then((user)=>{
        if(!user){
            return res.status(400).send({
                status:"failed",
                message: "El usuario no existe"
            })
        }

        return res.status(200).send({
            status:"success",
            message:"log in user",
            logeduser: user
        })
    })
}

module.exports = { pruebaUser, register, login, profile } 