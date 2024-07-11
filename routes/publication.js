const express = require('express');
const router =  express.Router()
const publishController = require('../controllers/publication');
const auth = require('../middlewares/auth');
const multer = require('multer');

//configurar el multer
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./uploads/publications/')
    },
    filename: (req,file,cb)=>{
        cb(null,`publications+${Date.now()}-${file.originalname}`)
    }
})

//middleware de carga 
const uploads = multer({storage});

//Definir rutas 
router.get('/prueba-publicacion',publishController.pruebaPublish)
router.post('/save-publication',auth.auth,publishController.save)
router.get('/mostrar-publicacion/:idpublication',publishController.onePublication)
router.delete('/borrar-publicacion/:idpublication',publishController.deletePublication)
router.get('/lista-publicaciones/:iduser/:page?',auth.auth, publishController.list)
router.post('/upload/:idpublication',[auth.auth,uploads.single("file0")], publishController.upload)
router.get('/avatar/:file',publishController.avatar)

module.exports = router;