const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const addPerson = require('../modules/sktAddPerson');
const addFace = require(`../modules/sktAddFace`);
// const UserModel = require('../models/user');

module.exports = {
    postFace : async(req, res) =>{
        //사람추가, 얼굴추가 2개호출
        let result1 = await addPerson.addPerson();
        // console.log(result1);
        if(result1.length === 0) {
            return res.status(statusCode.OK).send(util.success(statusCode.OK, "사람추가 실패"));
        }
        const image = req.file.path;
        console.log(image);
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
        let result2 = await addFace.addFace(image);
        console.log(result2.headers);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, "사람추가 성공"));
    }
}