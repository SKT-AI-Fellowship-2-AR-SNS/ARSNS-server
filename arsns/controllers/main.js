const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const Location = require(`../modules/location`);

module.exports = {
    getLocation : async(req, res) =>{
        const {bssid1, bssid2} = req.body;
        if(!bssid1 || !bssid2){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        let result = await Location.getLocation(bssid1, bssid2);
        if(result.length === 0) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ADD_PERSON_FAIL));
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ADD_PERSON_SUCCESS, result));
    },
}