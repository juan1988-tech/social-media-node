const mongoose = require('mongoose');

const connection = async () =>{
    try{
        await mongoose.connect('mongodb://localhost:27017/social-media-node')
        console.log(`conectado correctamente a la base de datos: social-media-node`)
    }catch(error){
        console.log(error);
        throw new Error('no se ha podido conectar a la base de datos')
    }
}

module.exports = { connection }