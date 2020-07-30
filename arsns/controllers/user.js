const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const addPerson = require('../modules/sktAddPerson');
const addFace = require(`../modules/sktAddFace`);
const User = require('../models/user');

module.exports = {
    addPerson : async(req, res) =>{
        //사람추가, 얼굴추가 2개호출
        let result = await addPerson.addPerson();
        if(result.length === 0) {
            return res.status(statusCode.OK).send(util.success(statusCode.OK, "사람추가 실패"));
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, "사람추가 성공", result));
    },

    addFace : async(req, res) =>{
        const image = req.file.path;
        // console.log(image);
        if(image === undefined){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_IMAGE));
            return;
        }
        const type = req.file.mimetype.split('/')[1];
        if(type !== 'jpeg' && type !== 'jpg' && type !== 'png'){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.INCORRECT_IMG_FORM));
            return;
        }
        // const location = image.map(img => img.location);
        let result = await addFace.addFace(image);
        // console.log(result2.headers);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, "얼굴추가 성공"));
    },

    findOrCreate: async (socialId, nickname, email) => {
        try {
            const isThere = await User.userCheck(socialId);
            const user = {
                id: socialId,
                name: nickname,
                email: email,
                state: 0
            }
            if (isThere) {
                console.log('user가 없습니다');
                await User.signup(socialId, nickname, '','', email);
                user.state = 1;
            } else {
                console.log('user가 있습니다');
                user.state = 2;
            }
            return user;
        } catch {
            return false;
        }
    }
}