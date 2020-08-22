var express = require('express');
var router = express.Router();
const mainController = require('../../controllers/main');
const upload = require('../../modules/multer');
// const multer = require('multer');
// const upload = multer({
//     dest: 'upload/'
// });

router.post('/getLocation', mainController.getLocation);
router.post('/addHistory', upload.array('image', 1), mainController.addHistory);
router.get('/getHistory/:userIdx/:bssid1/:bssid2', mainController.getHistory);
router.get('/getDetected', mainController.getDetected);
router.get('/getPersonName/:userIdx', mainController.getPersonName);

module.exports = router;