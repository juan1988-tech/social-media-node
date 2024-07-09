const express = require('express');
const router =  express.Router()
const publishController = require('../controllers/publication');
const auth = require('../middlewares/auth');

//Definir rutas 
router.get('/prueba-publicacion',publishController.pruebaPublish)
router.post('/save-publication',auth.auth,publishController.save)

module.exports = router;