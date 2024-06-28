//importar dependencias
const jwt= require('jwt-simple');
const moment = require('moment');

//imoprtar la clave secreta
const libjwt = require('../services/jwt');
const secret = libjwt.secret;
let payload;

const auth = (req,res,next) =>{
    //comprobar si llega la cabecera de autenticación
    if(!req.headers.authorization){
        return res.status(403).send({
            status: "error",
            message: "La petición no tiene la cabecera de autenticación"
        })
    }

    //Decodificar el token
    let token = req.headers.authorization.replace(/["']+/g,'')

    try{
        payload = jwt.encode(token,secret);

        //comprobar expiración del token
        if(payload.exp <=moment().unix()){
            return res.status(401).send({
                status: "error",
                messge: "Token expirado",
                error   
            })
        }
        //agregar el usuario a la request
        req.user = payload;
    }catch(error){
        return res.status(404).send({
            status: "error",
            messge: "Token inválido",
            error   
        })
    }
    next()
}

module.exports = { auth }