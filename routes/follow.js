const express = require('express');
const router =  express.Router()
const followerController = require('../controllers/follow');
const auth = require('../middlewares/auth');

//Definir rutas 
router.get('/prueba-follower',followerController.pruebaFollow)
router.post('/save/:idfollowed',auth.auth,followerController.save)
router.delete('/unfollow/:idfollowed',auth.auth,followerController.unfollow)

module.exports = router;