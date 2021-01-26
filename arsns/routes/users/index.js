var express = require('express');
var router = express.Router();
const UserController = require('../../controllers/user');
const multerUpload = require('../../modules/multer');
const addPerson = require('../../modules/sktAddPerson');
const faceList = require('../../modules/sktFaceList');
const subjectList = require('../../modules/sktSubjectList');

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
// router.post('/signin',UserController.signin);
router.post('/v1/persons', UserController.addPerson);
router.post('/v1/faces', upload.array('image', 1), UserController.addFace);
// router.post('/addFace', upload.array('image', 1), UserController.addFace);
router.get('/kakao', passport.authenticate('kakao', {scope: ['account_email', 'friends']}));
router.get('/kakao/callback', passport.authenticate('kakao',{
    successRedirect: '/users/signin_success',
    failureRedirect: '/users/signin_failure'
}));

router.get('/signin_success', ensureAuthenticated, async function(req, res){
    // console.log("가즈아", JSON.parse(JSON.stringify(req.user[0])));
    // return res.status(statusCode.OK).send(util.success(statusCode.OK, "로그인성공", JSON.parse(JSON.stringify(req.user[0].id))));
    // UserController.kakaoLogin(JSON.parse(JSON.stringify(req.user[0].id)));
    // res.send(JSON.parse(JSON.stringify(req.user[0])));

    //받은 uid 사람추가 되어있는지 확인
    //안되어있으면 사람추가api
    //되어있으면 얼굴추가 되어있는지 확인
    //얼굴추가 안되어있으면 끝에 /0리턴. 되어있으면 /1리턴
    let appid = "FHJEF7O455";
    let groupid = "SMB2NA4ND0";
    let uid = JSON.parse(JSON.stringify(req.user[0].id));
    // let uid = "12345";
    // console.log('appid: ', appid);
    // console.log('groupid: ', groupid);
    // console.log('uid: ', uid);
    let personResult = await addPerson.addPerson(appid, groupid, uid);
    let isFaceRegistered;
    console.log('personResult: ', personResult);

    if(personResult !== undefined){//방금 가입됨 = 처음 가입하는 사용자 -> 얼굴추가 해야됨.
        //끝에 0 리턴
        // console.log('undefined아니니까 여기로!');
        isFaceRegistered = 0;
    }

    else{//이미 사람추가 되어있는 사용자 -> 얼굴추가 확인
         //얼굴추가 안되어있으면 끝에 0리턴
        // console.log('undefined니까 여기로!');

        //사람조회해서 subject_id 받아오기
        let subjectResult = await subjectList.subjectList(appid, groupid);
        let subjectid;
        for(let i = 0; i<subjectResult.length; i++){
            if(subjectResult[i].subject_name == uid){
                subjectid = subjectResult[i].subject_id;
                break;
            }
        }
        console.log('subject_id: ',subjectid);
        let faceListResult = await faceList.faceList(appid, groupid, subjectid);
        console.log('faceListResult: ', faceListResult);
        if(faceListResult === undefined){//얼굴추가 안되어있는 사용자 -> 끝에 0리턴
            isFaceRegistered = 0;
        }
        else{//이미 얼굴추가까지 되어있는 사용자 -> 끝에 1리턴
            isFaceRegistered = 1;
        }
    }

    res.redirect('/' + JSON.parse(JSON.stringify(req.user[0].id)) + '/' + isFaceRegistered);
});
// router.get('/'+JSON.parse(JSON.stringify(req.user[0].id)));

router.get('/signin_failure', ensureAuthenticated, function(req, res){
    // console.log("가즈아", JSON.parse(JSON.stringify(req.user[0])));
    return res.status(statusCode.OK).send(util.success(statusCode.OK, "로그인실패", JSON.parse(JSON.stringify(req.user[0]))));
    // res.send(JSON.parse(JSON.stringify(req.user[0])));

});

function ensureAuthenticated(req, res, next) {
    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    if (req.isAuthenticated()) { return next(); }
    // 로그인이 안되어 있으면, login 페이지로 진행
    res.redirect('/');
}

router.get('/', (req, res) => {
    const data = req.user[0];
    console.log('auth.js - data : ', JSON.parse(JSON.stringify(req.user)));
    return res.status(statusCode.OK).send(util.success(statusCode.OK, "로그인성공", JSON.parse(JSON.stringify(req.user[0]))));

    // res.send(JSON.parse(JSON.stringify(req.user[0]))); 
});

router.get('/v1/kakao/friends', UserController.getKakaoFriend);
router.get('/v1/following/:my-id', UserController.myFollowing);
router.get('/v1/follower/:my-id', UserController.myFollower);
router.get('/v1/following/:my-id/:your-id', UserController.otherFollowing);
router.get('/v1/follower/:my-id/:your-id', UserController.otherFollower);
router.get('/v1/recommends/:my-id', UserController.getRecommend);
router.post('/v1/profile/img', multerUpload.array('img', 1), UserController.editImg);
router.post('/v1/profile/text', UserController.editText);
router.put('/v1/:my-id/:your-id', UserController.follow);

module.exports = router;