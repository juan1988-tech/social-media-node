//Importar usuarios y modulos
const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('../services/jwt');
const jsonwebtoken = require('jwt-simple');
const { secret } = require('../services/jwt');
const mongoosePaginate = require('mongoose-pagination');
const user = require('../models/user');
const fs = require('node:fs');
const path = require('node:path')
const { followThisUser } = require('../services/followUsersService');
const { validate } = require('../helpers/validator')

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

    //usar la función validate
    try{
        validate(params)
    }catch(err){
        return res.status(500).json({
            status: "error",
            messasge: "Faltan datos por enviar",
            err:{}
        })
    }
    

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

const profile = async (req,res) =>{
    //recibir los datos del parametro por la url
    const userid = req.params.iduser;

    //retornar al asuario que está haciendo la verificacion
    let userToDecode = req.headers.authorization.replace(/["']+/g,'');
    let userReviewer = jsonwebtoken.decode(userToDecode,secret);
    
    //retorna la información el usuario a partir del id
    User.findById(userid)
    .select({password: 0, role: 0})
    .then( async (user)=>{
        
        const followService = await followThisUser(userid,userReviewer.id)

        if(!user){
            return res.status(400).send({
                status:"failed",
                message: "El usuario no existe"
            })
        }

        return res.status(200).send({
            status:"success",
            message:"log in user",
            viewedUser: user,
            followService
        })
    })
}

const list = async (req,res) =>{
    let page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    page = parseInt(page);

    //hacer una consulta del número de páginas
    const itemsPerPage = 5;

    const totalUsers = await User.find()

    const totalPages = Math.ceil(totalUsers.length/itemsPerPage)

    await User.find().paginate(page,itemsPerPage)
    .select({ password: 0, role: 0, _id: 0, __v: 0, email: 0 })
    .then((users)=>{
        let orderedUsers = users.sort((a,b)=>{
            let x = a.name;
            let y = b.name;
            if( x < y ){ return -1};
            if( x > y ){ return 1 };
            return 0
        })

        if(orderedUsers.length===0){
            return res.status(200).send({
                status:"success",
                message:"no hay más usuarios",
                page
            })
        }   
        
        return res.status(200).send({
            status:"success",
            message:"lista de usuarios",
            page,
            userslist: orderedUsers
        })
    })    
}

const update = (req,res) =>{
    //requerir la información del usuario
    const userUpdater = req.body;
    //requerir el token de autorizacion y ver el usuario asociado
    const tokenUser = req.headers.authorization.replace(/["']+/g,'');
    const userToUpdate = jsonwebtoken.decode(tokenUser,secret);

    //buscar al usuario por su correo o por su nickname
    User.find({$or:[
        { email: userToUpdate.email.toLowerCase() },
        { nick: userToUpdate.nick.toLowerCase() }
    ]})
    .exec()
    .then(async (user)=>{
        if(!user){
            return res.status(400).json({
                status:"failed",
                message: "el usuario no existe"
            })
        }
        //si la identidad del usuario ingresado es igual a la identidad del usuario token actualiza
        try{
            const userId = userToUpdate.id;

            //cifrar la contraseña
            if(userUpdater.password){
            let pwd = await bcrypt.hash(userUpdater.password,10);
            userUpdater.password = pwd;
            }

            if(userUpdater){
                await User.findByIdAndUpdate(userId,userUpdater,{ new: true})
                .then((userUpdated)=>{
                    return res.status(200).json({
                        status: "success",
                        message: "succesfully user updated",
                        userUpdated,
                        userToUpdate
                    })
                })
            }
        }catch(err){
            return res.status(500).send({
                status:"failed",
                message:" no existe el usuario"
            })
        }
    })
}

const upload = async (req,res) =>{
    const userToken = req.headers.authorization.replace(/["']+/g,'');
    const identifiedUser = jsonwebtoken.decode(userToken,secret);

    if(!req.file){
        return res.status(400).json({
            status:"failed",
            message:"La petición no incluye la imagen"
        })
    }

    //sacar el nombre del archivo
    let filename = req.file.originalname;
    
    //sacar la extensión de imagen
    let imageSplit = filename.split('\.');
    let imageExtention = imageSplit[1]
    
    await User.findOneAndUpdate({_id: identifiedUser.id},{image: req.file.filename},{ new: true })
    .then((userUpdated)=>{
            if(imageExtention ==="png" || imageExtention === "jpg" || imageExtention === "jpeg"){    
                return res.status(200).json({
                    status:"success",
                    message:"archivo subido",
                    userUpdated,
                    })
            }else{
                fs.unlink(req.file.path,(error)=>{
                    return res.status(400).send({
                        status:"failed",
                        message:"Extención invalida",
                    })
                })
            }
    })
}

const avatar = (req,res) =>{
    //sacar el parametro de la url
    const file = req.params.file;

    //montar el path real de la imagen
    const filePath = `./uploads/avatars/${file}`;

    fs.stat(filePath,(error,exists)=>{
        if(!exists){
            return res.status(400).send({
                status: "failed",
                message:"no existe el archivo"
            })
        }else{
            return res.sendFile(path.resolve(filePath))
        }
    })
}

module.exports = { pruebaUser, register, login, profile, list, update, upload, avatar } 