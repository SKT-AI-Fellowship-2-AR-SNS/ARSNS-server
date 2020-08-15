const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const Location = require(`../modules/location`);
const Address = require(`../modules/kakaoLocation`);

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
        console.log(result3[0].road_address.address_name);
        let addResult = result3[0].road_address.address_name;
        if(addResult.length === 0) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.GET_ADDRESS_FAIL));
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GET_ADDRESS_SUCCESS, addResult));
    },

    addHistory : async(req, res) => {
        // const curatorIdx = (await req.decoded).valueOf(0).idx;
        const {userIdx} = req.body;
        const img = req.files;
        const imgLocation = img.map(image => image.location);  

        if(img === undefined){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_IMAGE));
            return;
        }

        // if(!curatorIdx || !name || !introduce || !keywordIdx){
        //     res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        //     return;
        // }

        const type = req.files[0].mimetype.split('/')[1];
        if(type !== 'jpeg' && type !== 'jpg' && type !== 'png'){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.INCORRECT_IMG_FORM));
            return;
        }

        const result = await MyModel.editProfile(imgLocation, userIdx, location);

        if(result == -1){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ALREADY_NAME));
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EDIT_PROFILE_SUCCESS, result));
    }
}