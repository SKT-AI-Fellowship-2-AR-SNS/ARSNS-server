var express = require('express');
var router = express.Router();
const mainController = require('../../controllers/main');
const upload = require('../../modules/multer');
// const multer = require('multer');
// const upload = multer({
//     dest: 'upload/'
// });

router.post('/getLocation', mainController.getLocation);
router.get('/getPersonName/:id', mainController.getPersonName);

module.exports = router;