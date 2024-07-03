const Follow = require('../models/follow');
const User = require('../models/user');
const jsonwebtoken = require('jwt-simple');
const { secret } = require('../services/jwt');
const user = require('../models/user');


const pruebaFollow = (req,res) =>{
    return res.status(200).send({
        messasge: "mensaje enviado desde el archivo follow.js"
    })
}

//fuinción para hacer un follow a otro usuario
const save = (req,res) =>{
    //conseguir los datos por el body, ¿quien soy como usuario?
    const tokenUser = req.headers.authorization.replace(/["']+/g,'');
    const userFollower = jsonwebtoken.decode(tokenUser,secret);

    // identidad del usuario a agregar
    const followedUser = req.params.idfollowed; 
     
    User.findById(followedUser)
    .exec()
    .then(async (userStored)=>{
        if(!userStored){
            return res.status(400).send({
                status:"failed",
                message:"el usuario no existe"
            })
        }else{
            //user: el usuario que sigue, followed es el usuario seguido
            let userToFollow = new Follow({
                user: userFollower.id,
                followed: followedUser
            })

            await  userToFollow.save()
            .then((userSaved)=>{
                return res.status(200).send({
                    status:"success",
                    message:"follow a usuario",
                    userStored,
                    userSaved
                })
            })
        }
    })
}

const unfollow = (req,res) =>{
    //identidad del usuario identificado
    const tokenUser = req.headers.authorization.replace(/["']+/g,'');
    const userFollower = jsonwebtoken.decode(tokenUser,secret);

    //identidad del usuario a eliminar
    const userUnfollowed = req.params.idfollowed;

    //Hacer el seguimiento del follow a eliminar
    Follow.findOneAndDelete({
        user: userFollower.id,
        followed: userUnfollowed
    })
    .exec()
    .then(async (followDeleted)=>{
        if(!followDeleted){ 
            return res.status(400).send({
                status:"failed",
                message:"no existe el follow"
            })
        }
        else{
            
            return res.status(200).send({
                status:"success",
                message:"dejas de seguir a usuario",
                followDeleted   
            })
        }
    })   
}

//lista de usuarios que están siguiendo cualquier usuario
const following = (req,res) =>{
    return res.status(200).send({
        status:"success",
        message:"lista de usuarios seguidos"
    })
}

//listado de usuarios que siguen al usuario identificado
const followed = (req,res) =>{
    return res.status(200).send({
        status:"success",
        message:"lista de usuarios que me siguen"
    })
}

module.exports = { pruebaFollow, save, unfollow, following, followed } 