const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const addPerson = require('../modules/sktAddPerson');
const addFace = require(`../modules/sktAddFace`);
const kakaoAPI = require(`../modules/kakaoFriend`);
const User = require('../models/user');

module.exports = {
    addPerson : async(req, res) =>{
        const appid = req.headers['app-id'];
        const groupid = req.headers['group-id'];
        const subjectname = req.headers['subject-name'];
        if(!appid || !groupid || !subjectname){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        let result = await addPerson.addPerson(appid, groupid, subjectname);
        if(result.length === 0) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ADD_PERSON_FAIL));
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ADD_PERSON_SUCCESS, result));
    },

    addFace : async(req, res) =>{
        const image = req.file.path;  
        const appid = req.headers['app-id'];
        const groupid = req.headers['group-id'];
        const subjectid = req.headers['subject-id'];
        const facename = req.headers['face-name'];
        // const img = req.files;
        // const imgLocation = img.map(image => image.location);
        console.log(image);

        if(image === undefined){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_IMAGE));
            return;
        }

        if(!appid || !groupid || !subjectid || !facename){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const type = req.file.mimetype.split('/')[1];
        if(type !== 'jpeg' && type !== 'jpg' && type !== 'png'){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.INCORRECT_IMG_FORM));
            return;
        }

        // const location = image.map(img => img.location);
        let result = await addFace.addFace(image, appid, groupid, subjectid, facename);
        // console.log(result2.headers);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ADD_FACE_SUCCESS));
    },

    findOrCreate: async (socialId, nickname, email, at) => {
        try {
            const isThere = await User.userCheck(socialId);
            const user = {
                id: socialId,
                name: nickname,
                email: email,
                access_token: at,
                state: 0
            }
            if (!isThere) {
                console.log('user가 없습니다');
                await User.signup(socialId, nickname, email, at);
                user.state = 1;
                // return res.status(statusCode.OK).send(util.success(statusCode.OK, "로그인 성공", user.id));
            } else {
                console.log('user가 있습니다');
                user.state = 2;
                // return res.status(statusCode.OK).send(util.success(statusCode.OK, "이미 회원입니다.", user.id));
            }
            const atcheck = await User.atCheck(socialId, at);
            return user;
        } catch {
            return false;
        }
    },

    signin : async(req, res) =>{
        // const {email, password} = req.body;
        // if (!email || !password) {
        // return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        // }

        // const alreadyEmail = await UserModel.checkUserEmail(email);
        // if(alreadyEmail === false){//이메일 있는지 확인
        //     return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
        // }

        // const user = await UserModel.getUserByEmail(email);

        // const hashed = await encryption.encryptWithSalt(password, user[0].salt);
        // if(hashed !== user[0].password){//비밀번호 확인
        //     return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.MISS_MATCH_PW));
        // }

        // const {token, _} = await jwt.sign(user[0]);
        // return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, {accessToken : token}));
        console.log('다시해~');
        const data = req.user;
        console.log('fail! users.js -data: ', data);
        res.send(data);

    },
    getProfile : async(req, res) =>{
        const data = req.user;
        console.log('여기냐users.js -data: ', data);
        res.send(data);
    },

    getKakaoFriend : async(req, res) =>{
        const at = req.headers.access_token;
        console.log('access_token: ', at);
        let result = await kakaoAPI.getKakaoFriend(at);

        // var finalResult = result.documents.map(BookData);
        
        if(result.length===0){
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.BOOK_SEARCH_FAIL));
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.BOOK_SEARCH_SUCCESS, result));
    },

    getFriend : async(req, res) =>{
        const myid = req.params.myid;
        
        if(!myid){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        let result = await User.getFriend(myid);
        if(!result){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.GET_FRIEND_FAIL));
            return;
        }
        else{
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GET_FRIEND_SUCCESS, result));
        }
    },

    editProfile : async(req, res) =>{
        const {id, message} = req.body;
        const img = req.files;
        const imgLocation = img.map(image => image.location);  
        if(img === undefined){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_IMAGE));
            return;
        }

        if(!id || !message){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        const type = req.files[0].mimetype.split('/')[1];
        if(type !== 'jpeg' && type !== 'jpg' && type !== 'png'){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.INCORRECT_IMG_FORM));
            return;
        }
        const result = await User.editProfile(id, message, imgLocation);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EDIT_PROFILE_SUCCESS, result));
    }
}