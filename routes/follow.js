const express = require('express');
const router =  express.Router()
const followerController = require('../controllers/follow');

//Definir rutas 
router.get('/prueba-follower',followerController.pruebaFollow)

module.exports = router;