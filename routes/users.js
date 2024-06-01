const express = require('express');
const router =  express.Router()
const userController = require('../controllers/users');

//Definir rutas 
router.get('/prueba-usuario',userController.pruebaUser)
router.post('/register',userController.register)

module.exports = router;