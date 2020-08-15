var express = require('express');
var router = express.Router();
const mainController = require('../../controllers/main');
const multer = require('multer');
const upload = multer({
    dest: 'upload/'
});

router.post('/getLocation', mainController.getLocation);
router.post('/addHistory', upload.single('image'), mainController.addHistory);

module.exports = router;