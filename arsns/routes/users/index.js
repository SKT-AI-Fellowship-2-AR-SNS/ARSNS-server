var express = require('express');
var router = express.Router();
const UserController = require('../../controllers/user');
// const authUtil = require('../../modules/authUtil');

// router.post('/signup',UserController.signup);
// router.post('/signin',UserController.signin);
router.post('/postFace', UserController.postFace);

module.exports = router;