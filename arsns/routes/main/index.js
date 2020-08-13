var express = require('express');
var router = express.Router();
const mainController = require('../../controllers/main');

router.post('/getLocation', mainController.getLocation);

module.exports = router;