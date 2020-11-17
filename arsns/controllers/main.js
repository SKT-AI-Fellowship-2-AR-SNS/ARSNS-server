const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const Location = require(`../modules/location`);
const Address = require(`../modules/kakaoLocation`);
const MainModel = require('../models/main');
const sirvUpload = require(`../modules/sirvUpload`);
const sirvToken = require(`../modules/sirvToken`);
const countFace = require(`../modules/countFace`);
const sirv = require('../config/sirv');
const recognize = require('../modules/recognize');
const fetch = require('node-fetch');
const fs = require('fs').promises;

module.exports = {
    getLocation : async(req, res) =>{
        const {bssid1, bssid2} = req.body;
        // console.log('bssid1: ',bssid1);
        // console.log('bssid2: ',bssid2);
        if(!bssid1 || !bssid2){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        let result = await Location.getLocation(bssid1, bssid2);
        if(result.length === 0) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.GET_ADDRESS_FAIL));
        }

        // let result2 = await Address.getAddress(result.lat, result.lon);
        let result2 = await Address.getAddress(37.5666109, 126.9849742);
        const res1 = JSON.stringify(result2.documents);
        let removeBackSlash = res1.replace(/\\/g,'');
        
        const replaceFirstBracket = removeBackSlash.replace(/\"{/g,'{');

        const replaceSecondBracket = replaceFirstBracket.replace(/\}"/g,'}'); 
        // console.log('replaceSecondBracket: ', replaceSecondBracket);

        let result3 = JSON.parse(replaceSecondBracket);
        // console.log(result3);
        // console.log(result3[0].road_address.address_name);
        let addResult = result3[0].address.address_name;

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

    getPersonName : async(req, res) => {
        const id = req.params.id;
        if(!id){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        let result = await MainModel.getPersonName(id);
        if(result.length == 0){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.GET_NAME_FAIL));
            return;
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GET_NAME_SUCCESS, result));
    },

    faceRecognition : async(req, res) =>{
        const image = req.file.path;
        if(image === undefined){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_IMAGE));
            return;
        }

        const type = req.file.mimetype.split('/')[1];
        if(type !== 'jpeg' && type !== 'jpg' && type !== 'png'){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.INCORRECT_IMG_FORM));
            return;
        }

        const clientId = sirv.info.sirv.clientId;
        const clientSecret = sirv.info.sirv.clientSecret;

        let uploadResult;
        let countResult;
        let userResult;
        let func2Result = {};
        async function func1(){
            //1. 토큰값 받기
            let token = await sirvToken.sirvToken(clientId, clientSecret);

            //2.클라에게 받은 사진 sirv에 업로드
            uploadResult = await sirvUpload.sirvUpload(image, token);

            //3.sirv에 업로드한 사진으로 얼굴이 몇개인지 개수세기
            countResult = await countFace.countFace(`${image}`);

            //4.사진에서 얼굴만 잘라서 skt api로 얼굴인식
            func2Result = await func2(countResult);

            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.FACE_RECOGNITION_SUCCESS, func2Result));
        };

        //for문 아래 writeFile먼저 실행되고 그다음 recognize 실행되야돼
        async function func2(countResult){
            let img = "upload%5C" + image.substring(7);

            for(let i = 0; i<countResult; i++){
                let url = "https://agendent.sirv.com/" + `${img}` + "?crop.type=face&crop.face=" +i;
                
                const response = await fetch(`${url}`);
                const buffer = await response.buffer();
                const filename = url.substring(35,67);
                // console.log('4-1 filename: ', filename);
                // let faceImage = "upload/"+`${filename}`+ i;
                let faceImage = "upload/"+`${filename}`+ i + ".jpg";
                // console.log('4-2 faceImage: ', faceImage);

                const file = await fs.writeFile(faceImage, buffer);
                // const tmp = () => new Promise((resolve, rej) => {
                //     setTimeout(()=>{
                //         console.log('2초만');
                //         resolve();
                //     },2000);    
                // });
                // await tmp();
                userResult = await recognize.recognize(faceImage);
            }

            return userResult;
        };


        func1();

    }
}