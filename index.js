
//coneexion a la base de datos 
const { connection } = require('./database/connection')
connection()
const { prueba } = require('./controllers/users');

//creacion del servidor y actvación del cors
const express = require('express')
const cors = require('cors')


const app = express();
const puerto = 3001;

app.use(cors())

//convertir los datos a objetos json
app.use(express.json())   
app.use(express.urlencoded({extended:true}))

//hacer una ruta de prueba

app.get('/ruta-de-prueba',function(req,res){

    return res.status(200).json({
        "id": 1,
        "nombre":"servidor de prueba",
        "status":"funcionando correcamente"
    })
})

//prueba de usuario
app.get('/usuario',function(req,res){

    return res.status(200).json({
        "id": 1,
        "nombre":"servidor de prueba",
        "status":"funcionando correcamente"
    })
})

//poner al servidor a escuchar servidores http
app.listen(puerto,()=>{
    console.log(`Servidor corriendo en el puerto ${puerto}`)
})

