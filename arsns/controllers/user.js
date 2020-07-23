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
        let result2 = await addFace.addFace();

        return res.status(statusCode.OK).send(util.success(statusCode.OK, "사람추가 성공"));
    }
}