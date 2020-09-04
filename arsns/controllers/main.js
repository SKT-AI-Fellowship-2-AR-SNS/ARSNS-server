const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const Location = require(`../modules/location`);
const Address = require(`../modules/kakaoLocation`);
const MainModel = require('../models/main');
module.exports = {
    getLocation : async(req, res) =>{
        const {bssid1, bssid2} = req.body;
        if(!bssid1 || !bssid2){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        let result = await Location.getLocation(bssid1, bssid2);
        if(result.length === 0) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.GET_ADDRESS_FAIL));
        }
        // console.log(result);

        let result2 = await Address.getAddress(result.lat, result.lon);
        const res1 = JSON.stringify(result2.documents);
        let removeBackSlash = res1.replace(/\\/g,'');
        
        const replaceFirstBracket = removeBackSlash.replace(/\"{/g,'{');

        const replaceSecondBracket = replaceFirstBracket.replace(/\}"/g,'}'); 
        // console.log('replaceSecondBracket: ', replaceSecondBracket);

        let result3 = JSON.parse(replaceSecondBracket);
        // console.log(result3[0].road_address.address_name);
        let addResult = result3[0].road_address.address_name;
        if(addResult.length === 0) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.GET_ADDRESS_FAIL));
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GET_ADDRESS_SUCCESS, addResult));
    },

    addHistory : async(req, res) => {
        // const id = req.headers.id;
        // const location = req.headers.location;
        // const text = req.headers.text;
        const image = req.file.path;
        const{id, location, text} = req.body;
        console.log('Id : ', id);
        console.log('location : ', location);
        console.log('text : ', text);
        // const img = req.files;
        // const imgLocation = img.map(image => image.location);  
        console.log(image);
        if(image === undefined){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_IMAGE));
            return;
        }

        if(!id || !location || !text){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        // //현재위치 불러오기
        // let result1 = await Location.getLocation(bssid1, bssid2);
        // if(result1.length === 0) {
        //     return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.GET_ADDRESS_FAIL));
        // }
        // let result2 = await Address.getAddress(result1.lat, result1.lon);
        // let res1 = JSON.stringify(result2.documents);
        // let removeBackSlash = res1.replace(/\\/g,'');
        // let replaceFirstBracket = removeBackSlash.replace(/\"{/g,'{');
        // let replaceSecondBracket = replaceFirstBracket.replace(/\}"/g,'}'); 
        // let result3 = JSON.parse(replaceSecondBracket);
        // let location = result3[0].road_address.address_name;

        const type = req.file.mimetype.split('/')[1];
        if(type !== 'jpeg' && type !== 'jpg' && type !== 'png'){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.INCORRECT_IMG_FORM));
            return;
        }

        const result = await MainModel.addHistory(image, id, location, text);
        // const result = await MainModel.addHistory(id, location, text);

        if(result == -1){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ADD_HISTORY_FAIL));
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ADD_HISTORY_SUCCESS));
    },

    getHistory : async(req, res) => {
        const myid = req.params.myid;
        const yourid = req.params.yourid;
        const bssid1 = req.params.bssid1;
        const bssid2 = req.params.bssid2;
        
        if(!myid|| !yourid || !bssid1 || !bssid2){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        let result;
        if(myid == yourid){
            result = await MainModel.getHistory(myid);
        }
        else{
            result = await MainModel.getFriendHistory(myid, yourid);
        }
        if(result.length == 0){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.GET_HISTORY_FAIL));
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GET_HISTORY_SUCCESS, result));
    },

    getFriendHistory : async(req, res) => {
        const myId = req.params.myId;
        const friendId = req.params.friendId;
        if(!myId || !friendId){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        let result = await MainModel.getFriendHistory(myId, friendId);
        if(result.length == 0){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.GET_HISTORY_FAIL));
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GET_HISTORY_SUCCESS, result));

    },

    getPersonName : async(req, res) => {
        const id = req.params.id;
        if(!id){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        let result = await MainModel.getPersonName(id);
        if(result.length == 0){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.GET_NAME_FAIL));
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GET_NAME_SUCCESS, result));
    }
}
