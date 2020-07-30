var express = require('express');
var router = express.Router();
const UserController = require('../../controllers/user');
// const upload = require('../../modules/multer');
const multer = require('multer');
const upload = multer({
    dest: 'upload/'
});
// const authUtil = require('../../modules/authUtil');
const passport = require('passport');


// router.post('/signup',UserController.signup);
router.post('/signin',UserController.signin);
router.post('/addPerson', UserController.addPerson);
router.post('/addFace', upload.single('image'), UserController.addFace);
router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback', passport.authenticate('kakao',{
    successRedirect: '/users',
    failureRedirect: 'users/signin'
}));
router.get('/', UserController.getProfile);
module.exports = router;