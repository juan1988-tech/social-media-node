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

module.exports = { pruebaFollow, save } 