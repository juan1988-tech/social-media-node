const express = require('express');
const router =  express.Router()
const userController = require('../controllers/users');

//Definir rutas 
router.get('/prueba-usuario',userController.pruebaUser)

module.exports = router;