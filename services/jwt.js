const jwt = require('jwt-simple');
const moment = require('moment');

//Definir clave secreta para generar el token
const secret = "CLAVE_SECRETA_Proyecto_backend_red_social_987987";

//crea una función para generar el token
const createToken = (user) =>{
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    }

    //Devuelve un jwt codificado
    return jwt.encode(payload, secret);
}


module.exports = {
    createToken,
    secret
}
