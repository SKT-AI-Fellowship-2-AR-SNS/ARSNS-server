var express = require('express');
var router = express.Router();
const mainController = require('../../controllers/main');
// const upload = require('../../modules/multer');
const multer = require('multer');
const upload = multer({
    dest: 'upload/'
});

router.post('/v1/locations', mainController.getLocation);
router.get('/v1/names/:user-id', mainController.getPersonName);
router.post('/v1/face-recognition', upload.single('image'), mainController.faceRecognition);

module.exports = router;