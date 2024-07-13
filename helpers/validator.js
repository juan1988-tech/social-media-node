const validator = require('validator');

const validate = (params) =>{
    
    let name = !validator.isEmpty(params.name) 
        && validator.isLength(params.name, { min: 3, max: undefined})
        && validator.isAlpha(params.name,"es-ES");
    
    let surname = !validator.isEmpty(params.surname) 
        && validator.isLength(params.surname, { min: 3, max: undefined})
        && validator.isAlpha(params.surname,"es-ES");   
    
    let nick = !validator.isEmpty(params.nick) 
    && validator.isLength(params.nick, { min: 3, max: undefined});
    
    let email = !validator.isEmpty(params.email) 
    && validator.isLength(params.email, { min: 3, max: undefined})
    && validator.isEmail(params.email);

    let password = !validator.isEmpty(params.password) 
    && validator.isLength(params.password, { min: 3, max: 12});

    let bio = !validator.isEmpty(params.bio) 
    && validator.isLength(params.bio, { min: 3, max: 255});

    if(!name || !surname || !nick || !email || !bio || !password)  throw new Error("No se ha superado la validación")
}

module.exports = { validate }