const pruebaUser = (req,res) =>{
    return res.status(200).send({
        messasge: "mensaje enviado desde el archivo user.js"
    })
}

const register = (req,res)=>{
    return res.status(200).json({
        messasge: "Acción de registro de usuarios",
    })
}

module.exports = { pruebaUser, register } 