const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const HistoryModel = require('../models/history');
const UserModel = require('../models/user');
const ffmpeg = require("fluent-ffmpeg");
const ffmpeg_static = require('ffmpeg-static');
const aws = require('aws-sdk');
aws.config.loadFromPath(__dirname + '/../config/s3.json');
const fs = require('fs');

module.exports = {
    addHistory : async(req, res) => {
        const{id, location, text, scope, list} = req.body;
        const contents = req.files;
        const contentsLocation = contents.map(content => content.location);
        console.log("list: ", list);
        if(contents === undefined){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_IMAGE));
            return;
        }

        if(!id || !location || !text || !scope || !list){
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
        
        let result = {};
        let result1;
        let imgLocation = "";
        //contents가 비디오이면, 비디오와 썸네일이미지 함께 저장
        if(type === 'mp4'){
            let videoname = contents[0].key.split('.')[0];
        
            //동영상에서 썸네일 이미지 추출해서 upload폴더에 저장
            function func1(param){
                return new Promise(function(resolved, rejected){
                    const image = ffmpeg(contentsLocation[0])
                    .setFfmpegPath(ffmpeg_static)
                    .screenshots({
                        timestamps: [0.0],
                        filename: videoname + ".png",
                        folder: `upload`
                    }).on('end', function() {
                        console.log('done');
                    });
                    resolved(videoname);
                })
            };
            
            //upload폴더에서 썸네일 이미지를 찾아서 S3에 업로드
            function func2(param){
                return new Promise(function(resolved,rejected){
                    setTimeout(()=>{
                        let video = param;
                        var file = fs.createReadStream(`upload/${video}.png`);
                        var params = {
                            Bucket: 'soopt',
                            Key: `${video}.png`,
                            ACL: 'public-read', /* 권한: 도메인에 객체경로 URL 을 입력하여 접근 가능하게 설정 */
                            Body: file,
                            ContentType:'image/jpeg'
                        };
                        let s3 = new aws.S3();
                        s3.upload(params, function(err, data){
                            if(err){
                                console.log('s3 err: ', err);
                            }
                            console.log('============');
                            imgLocation = data.Location;
                            console.log("data Lo : ", imgLocation);

                        });
                        resolved(imgLocation);
                    }, 2300);
                })
            };

            function func3(params){
                return new Promise(function(resolved, rejected){
                    setTimeout(()=>{
                        console.log('imgLocation: ',imgLocation);
                        result1 = HistoryModel.addVideoHistory(contentsLocation,imgLocation, id, road_address, text, type, scope);
                        fs.unlinkSync(`upload/${videoname}.png`);//upload폴더에서는 썸네일 이미지 삭제
                        resolved(result1);
                    },1000);
                })
            }

            func1(1)
            .then(func2)
            .then(func3);
        }

        if(type !== 'mp4'){
            result1 = await HistoryModel.addImgHistory(contentsLocation, id, road_address, text, type, scope);
        }

        if(result == -1){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ADD_HISTORY_FAIL));
        }

        if(scope == 0 && list != -1){//태그추가
            let lists = list.split(",");
            for(let i = 0; i<lists.length-1; i++){
                await HistoryModel.addTagList(result1, lists[i]);
            }
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
        
        let road_address = "경기 용인시 수지구 죽전동";
        let result;
        let scope;
        result = await HistoryModel.getHistory(myid, yourid, road_address, scope);

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
                console.log("이미 좋아요니까 취소");
                data = await HistoryModel.deleteLike(userIdx, historyIdx);
            }
            else{//좋아요 추가
                console.log("좋아요 새로 추가");
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
    },

    deleteHistory : async(req, res) =>{
        const historyIdx = req.params.historyIdx;
        const userIdx = req.params.userIdx;
        if(!userIdx || !historyIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await HistoryModel.deleteHistory(userIdx, historyIdx);
        if(result == -1){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.USER_HISTORY_UNMATCH));
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DELETE_HISTORY_SUCCESS, {deleteHistoryIdx:historyIdx}));
    },

    addComment : async(req, res) =>{
        const {userIdx, historyIdx, comment} = req.body;
        if(!userIdx || !historyIdx || !comment){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await HistoryModel.addComment(userIdx, historyIdx, comment);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ADD_COMMENT_SUCCESS,{addCommentIdx:result}));
    },

    deleteComment : async(req, res) =>{
        const userIdx = req.params.userIdx;
        const commentIdx = req.params.commentIdx;
        if(!userIdx || !commentIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        let result = await HistoryModel.deleteComment(userIdx, commentIdx);
        if(result == -1){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.USER_COMMENT_UNMATCH));
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DELETE_COMMENT_SUCCESS, {deleteCommentIdx:commentIdx}));
    },

    getComment : async(req, res) =>{
        const historyIdx = req.params.historyIdx;
        if(!historyIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        let result = await HistoryModel.getComment(historyIdx);
        // console.log(result);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GET_COMMENT_SUCCESS, result));

    },
    
    tagList : async(req, res) =>{
        const myid = req.params.myid;
        if(!myid){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        let result = await HistoryModel.tagList(myid);
        if(result.length === 0){
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.TAGLIST_ZERO));
        }
        else{
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.TAGLIST_SUCCESS, result));
        }
    },

    detailHistory : async(req, res) =>{
        const myid = req.params.myid;
        const historyIdx = req.params.historyIdx;
        if(!myid || !historyIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        let result = await HistoryModel.detailHistory(myid, historyIdx);
        
        if(result.length == 0){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.GET_HISTORY_FAIL));
        }
        else
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GET_HISTORY_DETAIL_SUCCESS, result));
    }
}