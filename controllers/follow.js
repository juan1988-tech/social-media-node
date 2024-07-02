const Follow = require('../models/follow');
const User = require('../models/user');
const jsonwebtoken = require('jwt-simple');
const { secret } = require('../services/jwt');


const pruebaFollow = (req,res) =>{
    return res.status(200).send({
        messasge: "mensaje enviado desde el archivo follow.js"
    })
}

//fuinción para hacer un follow a otro usuario
const save = (req,res) =>{
    //conseguir los datos por el body, ¿a que usuario voy a seguir?
    const tokenUser = req.headers.authorization.replace(/["']+/g,'');
    const userToUpdate = jsonwebtoken.decode(tokenUser,secret);    


    return res.status(200).send({
        status:"success",
        message:"usuario seguido",
        userToUpdate
    })
}

module.exports = { pruebaFollow, save } 