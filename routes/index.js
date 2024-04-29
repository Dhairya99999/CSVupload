const express = require('express');
const router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const homeController = require('../controllers/HomeController')


router.get('/', homeController.homePage)
router.get('/csv/:id',homeController.viewFile)
router.get('/csv/delete/:id', homeController.deleteFile)

router.post('/upload',upload.single('csv_file'),homeController.uploadFile)


module.exports = router;