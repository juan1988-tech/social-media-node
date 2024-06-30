const express = require('express');
const router =  express.Router()
const userController = require('../controllers/users');
const auth = require('../middlewares/auth')

//Definir rutas 
router.get('/prueba-usuario',auth.auth,userController.pruebaUser)
router.post('/register',userController.register)
router.post('/login',userController.login)
router.get('/profile/:iduser',auth.auth,userController.profile);
router.get('/list/:page?',userController.list)
router.put('/update',auth.auth,userController.update)

module.exports = router;