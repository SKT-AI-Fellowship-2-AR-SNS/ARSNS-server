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
const util = require('../../modules/util');
const resMessage = require('../../modules/responseMessage');
const statusCode = require('../../modules/statusCode');

// router.post('/signup',UserController.signup);
router.post('/signin',UserController.signin);
router.post('/addPerson', UserController.addPerson);
router.post('/addFace', upload.single('image'), UserController.addFace);
router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback', passport.authenticate('kakao',{
    successRedirect: '/users/signin_success',
    failureRedirect: '/users/signin_success'
}));

router.get('/signin_success', ensureAuthenticated, function(req, res){
    console.log("가즈아", JSON.parse(JSON.stringify(req.user[0])));
    return res.status(statusCode.OK).send(util.success(statusCode.OK, "로그인성공", JSON.parse(JSON.stringify(req.user[0]))));
    // res.send(JSON.parse(JSON.stringify(req.user[0])));

});

function ensureAuthenticated(req, res, next) {
    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    if (req.isAuthenticated()) { return next(); }
    // 로그인이 안되어 있으면, login 페이지로 진행
    res.redirect('/');
}

router.get('/', (req, res) => {
    const data = req.user;
    console.log('auth.js - data : ', JSON.parse(JSON.stringify(req.user[0])));
    return res.status(statusCode.OK).send(util.success(statusCode.OK, "로그인성공", JSON.parse(JSON.stringify(req.user[0]))));

    // res.send(JSON.parse(JSON.stringify(req.user[0])));
});
module.exports = router;