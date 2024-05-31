const express = require('express');
const router =  express.Router()
const publishController = require('../controllers/publication');

//Definir rutas 
router.get('/prueba-publicacion',publishController.pruebaPublish)

module.exports = router;