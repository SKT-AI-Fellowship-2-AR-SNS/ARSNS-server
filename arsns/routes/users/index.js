var express = require('express');
var router = express.Router();
const UserController = require('../../controllers/user');
// const upload = require('../../modules/multer');
const multer = require('multer');
const upload = multer({
    dest: 'upload/'
});
// const authUtil = require('../../modules/authUtil');

// router.post('/signup',UserController.signup);
// router.post('/signin',UserController.signin);
router.post('/postFace', upload.single('image'), UserController.postFace);

module.exports = router;