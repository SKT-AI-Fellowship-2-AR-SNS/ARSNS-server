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

        // let str = addResult.split(" ");
        // let road_address = "";
        // for(var i = 0; i<str.length-1; i++){
        //     road_address += str[i] + " ";
        // };
        // console.log(road_address);

        if(addResult.length === 0) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.GET_ADDRESS_FAIL));
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GET_ADDRESS_SUCCESS, addResult));
    },

    addHistory : async(req, res) => {
        const{id, location, text} = req.body;
        const img = req.files;
        const imgLocation = img.map(image => image.location);  
        console.log(img);
        if(img === undefined){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_IMAGE));
            return;
        }

        if(!id || !location || !text){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const type = req.files[0].mimetype.split('/')[1];
        if(type !== 'jpeg' && type !== 'jpg' && type !== 'png'&& type !== 'mp4'){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.INCORRECT_CONTENT_FORM));
            return;
        }

        //마지막 주소만 제거하고 저장
        let str = location.split(" ");
        let road_address = "";
        for(var i = 0; i<str.length-1; i++){
            road_address += str[i];
            if(i!=str.length-2)
            road_address += " ";
        };
        // console.log(road_address);

        const result = await MainModel.addHistory(imgLocation, id, road_address, text, type);

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
        // const{location} = req.body;
        // console.log('location: ', location);

        if(!myid|| !yourid || !bssid1 || !bssid2){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        //마지막 주소만 제거하고 저장
        // let str = location.split(" ");
        // let road_address = "";
        // for(var i = 0; i<str.length-1; i++){
        //     road_address += str[i] + " ";
        // };
        
        let road_address = "경기도 용인시 수지구 죽전로";
        let result;
        if(myid == yourid){
            result = await MainModel.getHistory(myid,road_address);
        }
        else{
            result = await MainModel.getFriendHistory(myid, yourid,road_address);
        }

        if(result.length == 0){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.GET_HISTORY_FAIL));
        }
        else
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
