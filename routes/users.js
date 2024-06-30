const express = require('express');
const router =  express.Router()
const userController = require('../controllers/users');
const auth = require('../middlewares/auth');
const multer = require('multer');

//configurar el multer
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./uploads/avatars/')
    },
    filename: (req,file,cb)=>{
        cb(null,`avatars+${Date.now()}-${file.originalname}`)
    }
})

//middleware de carga 
const uploads = multer({storage});

//Definir rutas 
router.get('/prueba-usuario',auth.auth,userController.pruebaUser)
router.post('/register',userController.register)
router.post('/login',userController.login)
router.get('/profile/:iduser',auth.auth,userController.profile);
router.get('/list/:page?',userController.list)
router.put('/update',auth.auth,userController.update)
router.post('/upload',[auth.auth,uploads.single("file0")],userController.upload)

module.exports = router;