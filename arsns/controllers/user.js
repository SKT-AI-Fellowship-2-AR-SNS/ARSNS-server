const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const addPerson = require('../modules/sktAddPerson');
// const UserModel = require('../models/user');

module.exports = {
    postFace : async(req, res) =>{
        //사람추가, 얼굴추가 2개호출
        let personResult = await addPerson.addPerson();
        // let faceResult = 
        let result = personResult.subject_name;

        return res.status(statusCode.OK).send(util.success(statusCode.OK, "사람추가 성공", result));
    }
}