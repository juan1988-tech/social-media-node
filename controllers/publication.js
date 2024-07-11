const Publication = require('../models/publication')
const jwt = require('jwt-simple')
const { secret } = require('../services/jwt');
const User = require('../models/user')
const mongoosePagination = require('mongoose-pagination')

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

const onePublication = async (req,res) =>{
    //sacar la identidad de la publicacion de la url       
    const idPublication = req.params.idpublication;
    
    Publication.findOne({ _id: idPublication})
    .populate("user")
    .then((newPublication)=>{
        if(!newPublication){
            return res.status(400).send({
                status: "failed",
                message:"la publicacion no existe",
            })    
        }

        return res.status(200).send({
            status: "success",
            message:"publicacion",
            newPublication
        })
    })
}

const deletePublication = async (req,res)=>{
    //sacar la identidad de la publicacion de la url       
    const idPublication = req.params.idpublication;
    
    Publication.findOneAndDelete({ _id: idPublication})
    .then((deletedPublication)=>{
        if(!deletedPublication){
            return res.status(400).send({
                status: "failed",
                message:"la publicacion no existe",
            })    
        }

        return res.status(200).send({
            status: "success",
            message:"publicacion eliminada",
            deletedPublication
        })
    })
}

const list = async (req,res) =>{

//sacar la iderntidad de la URL
const iduser = req.params.iduser

//hacer la consulta del usuario
const identifiedUser = await User.findById(iduser).exec()

if(!identifiedUser){
    return res.status(400).send({
        status:"success",
        message: "El usuario no existe",
    })   
}

//crear la variable de página
let page = 1;

if(req.params.page) page = req.params.page

const itemsPerPage = 5

//hacemos un conteo del total de publicaciones hechas por el usuario


//hacer el conteo del total de elementos
let totalPublications; 
Publication.where({user: identifiedUser.id}).countDocuments()
.exec()
.then((total)=>{
    totalPublications = total
    totalPublications = Math.ceil(totalPublications/itemsPerPage)
    return totalPublications
})

//hacer la consulta de las publicaciones del usuario
Publication.find({ user: identifiedUser.id})
.paginate(page,itemsPerPage)
.then(async(listItems)=>{

    if(listItems.length === 0){
        return res.status(200).json({
            status:"success",
            message: "No hay más publicaciones asociadas",    
        })
    }

    const organizedFollows = listItems.sort((a,b)=>{
        let x = a.created_at;
        let y = b.created_at;
        if( x > y ){ return -1};
        if( x < y ){ return 1 };
        return 0
    })

    return res.status(200).send({
        status:"success",
        message: "Lista de publicaciones",
        identifiedUser,
        organizedFollows,
        page,
        totalPublications
    })
})
}

module.exports = { pruebaPublish, save, onePublication, deletePublication, list } 