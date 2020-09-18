const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const HistoryModel = require('../models/history');
const ffmpeg = require("fluent-ffmpeg");
const ffmpeg_static = require('ffmpeg-static');
module.exports = {
    addHistory : async(req, res) => {
        const{id, location, text, thumbnail} = req.body;
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
        
        let fileDuration = "";
        let filePath = "";
        console.log("video location: ", imgLocation[0]);
        // ffmpeg.ffprobe(imgLocation[0], function(err, metadata){
        //     console.log('여긴');
        //     console.log(metadata);
        //     // fileDuration = metadata.format.duration;
        // });

        // ffmpeg(imgLocation)
        // .on("filenames", function(filenames){
        //     console.log("will generate " + filenames.join(","));
        //     console.log("filenames: ", filenames);
        //     filePath = "uploads/thumbnails/" + filenames[0];
        // })
        // .on("end", function(){
        //     console.log('Screenshots taken');
        //     return res.json({
        //         success: true,
        //         url: filePath,
        //         fileDuration: fileDuration
        //     });
        // })
        // .on("error", function(err){
        //     console.log(err);
        //     return res.json({success: false, err});
        // })
        // .screenshots({
        //     count: 1,
        //     folder: "uploads/thumbnails",
        //     size: "320x240",
        //     filename: "thumbnail-%b.png",
        // });

        ffmpeg(imgLocation[0])
            .setFfmpegPath(ffmpeg_static)
            .screenshots({
                timestamps: [0.0],
                filename: 'xx.png',
                folder: '../upload',
            }).on('end', function() {
                console.log('done');
        });
        
        console.log(thumbnail);

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

        const result = await HistoryModel.addHistory(imgLocation, id, road_address, text, type);

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
            result = await HistoryModel.getHistory(myid,road_address);
        }
        else{
            result = await HistoryModel.getFriendHistory(myid, yourid,road_address);
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

        let result = await HistoryModel.getFriendHistory(myId, friendId);
        if(result.length == 0){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.GET_HISTORY_FAIL));
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GET_HISTORY_SUCCESS, result));
    },

    likeHistory : async(req, res) =>{
        const historyIdx = req.params.historyIdx;
        const userIdx = req.params.userIdx;
        if(!userIdx || !historyIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        function Func1(){
            const isLike = HistoryModel.isLike(userIdx, historyIdx);
            return isLike;
        };

        let data;
        var result = {};
        async function Func2(isLike){
            if(!isLike){//이미 좋아요이니까 취소
                data = await HistoryModel.deleteLike(userIdx, historyIdx);
            }
            else{//좋아요 추가
                data = await HistoryModel.addLike(userIdx, historyIdx);
            }
            
            result.isLike = isLike;
            result.likes = data[0].likes;
            
            return result;
        };

        await Func1(async(elem) =>{
            console.log(elem);
        }).then((res) => Func2(res));

        return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.HISTORY_LIKE_SUCCESS, result));
    }
}