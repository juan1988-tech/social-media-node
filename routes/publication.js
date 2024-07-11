const express = require('express');
const router =  express.Router()
const publishController = require('../controllers/publication');
const auth = require('../middlewares/auth');

//Definir rutas 
router.get('/prueba-publicacion',publishController.pruebaPublish)
router.post('/save-publication',auth.auth,publishController.save)
router.get('/mostrar-publicacion/:idpublication',publishController.onePublication)
router.delete('/borrar-publicacion/:idpublication',publishController.deletePublication)
router.get('/lista-publicaciones/:iduser/:page?',auth.auth, publishController.list)

module.exports = router;