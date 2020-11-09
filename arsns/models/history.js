const pool = require('../modules/pool');

const historyData  = require('../modules/data/historyData');
const profileData  = require('../modules/data/profileData');
const commentData  = require('../modules/data/commentData');

const history = {
    addVideoHistory: async(video,image, id, location, text, type, scope) => {
        const fields = `video, image, id, location, text, type, scope`;
        const question = `?,?,?,?,?,?,?`;
        const values = [video, image, id, location, text, type, scope];

        let query = `INSERT INTO history(${fields}) VALUES(${question})`;
        try{
            const result = await pool.queryParamArr(query, values);
            let historyIdx = result.insertId;
            let query2 = `INSERT INTO user_history(historyIdx, Id) VALUES(${historyIdx}, ${id})`;
            await pool.queryParam(query2);
            return result.insertId;
        }catch(err){
            console.log('addHistory err: ', err);
        }throw err;
    },

    addImgHistory: async(image, id, location, text, type, scope) => {
        const fields = `image, id, location, text, type, scope`;
        const question = `?,?,?,?,?,?`;
        const values = [image, id, location, text, type, scope];

        let query = `INSERT INTO history(${fields}) VALUES(${question})`;
        try{
            const result = await pool.queryParamArr(query, values);
            let historyIdx = result.insertId;
            let query2 = `INSERT INTO user_history(historyIdx, Id) VALUES(${historyIdx}, ${id})`;
            await pool.queryParam(query2);
            return result.insertId;
        }catch(err){
            console.log('addHistory err: ', err);
        }throw err;
    },

    getHistory: async(myid, yourid, location, scope) => {
        let query;
        let profileQuery;
        let followingCountQuery;
        let followerCountQuery;
        if(myid != yourid){//상대방 추억이므로, 전체공개인 히스토리만 select
            query = `SELECT * FROM history WHERE id = ${yourid} and location = "${location}" and scope = 0 ORDER BY timestamp desc`;
            profileQuery = `SELECT name, profileImage, message FROM user WHERE id = ${yourid}`;
            followingCountQuery = `SELECT COUNT(*) as cnt FROM friends WHERE myId = ${yourid}`;
            followerCountQuery = `SELECT COUNT(*) as cnt FROM friends WHERE friendId = ${yourid}`;
        }
        else{//내 추억이므로 공개범위 상관없이 전부 select
            query = `SELECT * FROM history WHERE id = ${myid} and location = "${location}" ORDER BY timestamp desc`;
            profileQuery = `SELECT name, profileImage, message FROM user WHERE id = ${myid}`;
            followingCountQuery = `SELECT COUNT(*) as cnt FROM friends WHERE myId = ${myid}`;
            followerCountQuery = `SELECT COUNT(*) as cnt FROM friends WHERE friendId = ${myid}`;
        }

        
        try{
            let profileResult = await pool.queryParam(profileQuery);
            let followingCountResult = await pool.queryParam(followingCountQuery);
            let followerCountResult = await pool.queryParam(followerCountQuery);

            profileResult[0].name = profileResult[0].name;
            profileResult[0].profileImage = profileResult[0].profileImage;
            profileResult[0].message = profileResult[0].message;
            profileResult[0].followingCount = followingCountResult[0].cnt;
            profileResult[0].followerCount = followerCountResult[0].cnt;
            let historyResult = await pool.queryParam(query);
            let day;

            await Promise.all(historyResult.map(async(element) =>{
                let historyIdx = element.historyIdx;

                //요일 추출
                query = `select substr(dayname(timestamp),1,3) as day from history WHERE historyIdx = ${historyIdx}`;
                day = await pool.queryParam(query);
                element.day = day[0].day;

                //timestamp 형식 슬래쉬로 변경, 시간 제거
                query = `select date_format(timestamp, '%Y/%m/%d') as datetime from history where historyIdx = ${historyIdx}`;
                datetime = await pool.queryParam(query);
                // console.log(datetime);
                element.datetime = datetime[0].datetime;

                //컨텐츠 타입 추출
                query = `SELECT type FROM history WHERE historyIdx = ${historyIdx}`;
                contents_type = await pool.queryParam(query);
                if(contents_type[0].type === "mp4"){
                    element.contents_type = "video";
                }
                else{
                    element.contents_type = "image";
                }

                //좋아요 눌렀는지 여부
                query = `SELECT * FROM user_history_like WHERE userIdx=${myid} and historyIdx=${historyIdx}`;
                let likeResult = await pool.queryParam(query);
                if(likeResult.length == 0){
                    element.alreadyLiked = false;
                }
                else{
                    element.alreadyLiked = true;
                }
            }));

            let result = {};
            result.profile = profileResult.map(profileData);
            result.history = historyResult.map(historyData);

            return result;

        }catch(err){
            console.log('getHistory err: ', err);
        }throw err;
    },

    isLike: async(userIdx, historyIdx) => {
        let query = `SELECT COUNT(*) as cnt FROM user_history_like WHERE userIdx = ${userIdx} and historyIdx = ${historyIdx}`;
        try{
            const result = await pool.queryParam(query);
            if(result[0].cnt === 0){
                return true;
            }
            else{
                return false;
            }
        }catch(err){
            console.log('isLike err: ', err);
        }throw err;
    },

    deleteLike : async(userIdx, historyIdx) =>{
        let query1 = `DELETE FROM user_history_like WHERE userIdx = ${userIdx} and historyIdx = ${historyIdx}`;
        let query2 = `UPDATE history SET likes = likes-1 WHERE historyIdx = ${historyIdx}`;
        let query3 = `SELECT likes FROM history WHERE historyIdx = ${historyIdx}`;
        try{
            const result1 = await pool.queryParam(query1);
            const result2 = await pool.queryParam(query2);
            const result3 = await pool.queryParam(query3);
            return result3;
        }catch(err){
            console.log('deleteLike err: ', err);
        }throw err;
    },

    addLike : async(userIdx, historyIdx) =>{
        const fields = `userIdx, historyIdx`;
        const question = `?,?`;
        const values = [userIdx, historyIdx];

        let query1 = `INSERT INTO user_history_like(${fields}) VALUES(${question})`;
        let query2 = `UPDATE history SET likes = likes+1 WHERE historyIdx = ${historyIdx}`;
        let query3 = `SELECT likes FROM history WHERE historyIdx = ${historyIdx}`;
        try{
            const result1 = await pool.queryParamArr(query1, values);
            const result2 = await pool.queryParam(query2);
            const result3 = await pool.queryParam(query3);
            return result3;
        }catch(err){
            console.log('addLike err: ', err);
        }throw err;
    },

    deleteHistory : async(userIdx, historyIdx) =>{
        const preQuery = `SELECT * FROM user_history WHERE Id = ${userIdx} AND historyIdx = ${historyIdx}`;
        let query = `DELETE FROM history WHERE historyIdx = ${historyIdx}`;
        try{
            const preResult = await pool.queryParam(preQuery);
            if(preResult.length == 0){
                return -1;
            }
            else{
                let result = await pool.queryParam(query);
                return result;
            }
            
        }catch(err){
            console.log('deleteHistory err: ', err);
        }throw err;
    },

    historyCheck: async (historyIdx) => {
        const query = `SELECT * FROM history WHERE historyIdx = ${historyIdx}`;
        try{
            const result = await pool.queryParam(query);
            if(result.length > 0) return true;
            else return false;
        } catch(err){
            console.log('historyCheck err : ', err);
            throw err;
        }
    },

    addComment : async(userIdx, historyIdx, comment) =>{
        const fields = `userIdx, historyIdx, comment`;
        const question = `?,?,?`;
        const values = [userIdx, historyIdx, comment];

        let query = `INSERT INTO comment(${fields}) VALUES (${question})`;
        try{
            let result = await pool.queryParamArr(query, values);
            return result.insertId;
        }catch(err){
            console.log('addComment err: ', err);
        }throw err;
    },

    deleteComment : async(userIdx, commentIdx) =>{
        let preQuery = `SELECT * FROM comment WHERE userIdx=${userIdx} and commentIdx=${commentIdx}`;
        let query = `DELETE FROM comment WHERE userIdx=${userIdx} and commentIdx=${commentIdx}`;
        try{
            const preResult = await pool.queryParam(preQuery);
            if(preResult.length === 0){
                return -1;
            }
            else{
                let result = await pool.queryParam(query);
                return result;
            }
        }catch(err){
            console.log('deleteComment err: ', err);
        }throw err;
    },

    getComment : async(historyIdx) =>{
        let commentQuery = `SELECT * FROM comment WHERE historyIdx = ${historyIdx} ORDER BY timestamp DESC`;
        // let countQuery = `SELECT COUNT(*) as cnt FROM comment WHERE historyIdx = ${historyIdx}`;
        try{
            let result = {};
            let commentResult = await pool.queryParam(commentQuery);
            // let countResult = await pool.queryParam(countQuery);
            if(commentResult.length === 0){
                return result;
            }

            await Promise.all(commentResult.map(async(element)=>{
                let userIdx = element.userIdx;
                // console.log('userIdx: ',userIdx);

                //이름, 프로필 사진 추출
                query = `SELECT name, profileImage FROM user WHERE id=${userIdx}`;
                let result2 = await pool.queryParam(query);
                element.name = result2[0].name;
                element.profileImage = result2[0].profileImage;
                result = commentResult.map(commentData);
            }));
            // result.count = countResult;
            result.comment = commentResult.map(commentData);
            // console.log(result);
            return result;
        }catch(err){
            console.log('getComment err: ', err);
        }throw err;
    },

    addTagList : async(historyIdx, userIdx) =>{
        const fields = `historyIdx, userIdx`;
        const question = `?,?`;
        const values = [historyIdx, userIdx];

        let query = `INSERT INTO tag(${fields}) VALUES (${question})`;
        try{
            let result = await pool.queryParamArr(query, values);
            return result;
        }catch(err){
            console.log('addTagList err: ', err);
        }throw err;
    },

    detailHistory : async(id, historyIdx) =>{
        let query = `SELECT * FROM history WHERE historyIdx = ${historyIdx}`;
        let tagQuery = `SELECT userIdx FROM tag WHERE historyIdx = ${historyIdx}`;
        let tagCountQuery = `SELECT COUNT(*) as cnt FROM tag WHERE historyIdx = ${historyIdx}`;
        try{
            let historyResult = await pool.queryParam(query);
            let tagResult = await pool.queryParam(tagQuery);
            let tagCountResult = await pool.queryParam(tagCountQuery);
            let result = {};
            result.tagCount = tagCountResult[0].cnt;

            await Promise.all(tagResult.map(async(element) =>{
                let userIdx = element.userIdx;
                
                query = `SELECT profileImage FROM user WHERE id = ${userIdx}`;
                image = await pool.queryParam(query);
                element.profileImage = image[0].profileImage;
            }));
            result.tag = tagResult;

            let day;
            await Promise.all(historyResult.map(async(element) =>{
                let historyIdx = element.historyIdx;

                //요일 추출
                query = `select substr(dayname(timestamp),1,3) as day from history WHERE historyIdx = ${historyIdx}`;
                day = await pool.queryParam(query);
                element.day = day[0].day;

                //timestamp 형식 슬래쉬로 변경, 시간 제거
                query = `select date_format(timestamp, '%Y/%m/%d') as datetime from history where historyIdx = ${historyIdx}`;
                datetime = await pool.queryParam(query);
                // console.log(datetime);
                element.datetime = datetime[0].datetime;

                //컨텐츠 타입 추출
                query = `SELECT type FROM history WHERE historyIdx = ${historyIdx}`;
                contents_type = await pool.queryParam(query);
                if(contents_type[0].type === "mp4"){
                    element.contents_type = "video";
                }
                else{
                    element.contents_type = "image";
                }

                //좋아요 눌렀는지 여부
                query = `SELECT * FROM user_history_like WHERE userIdx=${id} and historyIdx=${historyIdx}`;
                let likeResult = await pool.queryParam(query);
                if(likeResult.length == 0){
                    element.alreadyLiked = false;
                }
                else{
                    element.alreadyLiked = true;
                }
            }));


            result.history = historyResult.map(historyData);

            return result;
        }catch(err){
            console.log('detailHistory err: ', err);
        }throw err;
    },

    tagList: async(myid) =>{
        let countQuery = `SELECT COUNT(*) as cnt FROM friends WHERE myid = ${myid}`;
        let query = `SELECT friendId FROM friends WHERE myid = ${myid}`;

        try{
            const countResult = await pool.queryParam(countQuery);
            const profileResult = await pool.queryParam(query);
            let result = {};
            await Promise.all(profileResult.map(async(element) =>{
                let id = element.friendId;
                query = `SELECT id, name, profileImage FROM user WHERE id = ${id}`;
                let result2 = await pool.queryParam(query);
                element.id = result2[0].id;
                element.name = result2[0].name;
                element.profileImage = result2[0].profileImage;
            }));
            result.count = countResult[0].cnt;
            result.list = profileResult.map(profileData);
            return result;
        }catch(err){
            console.log('tagList err: ', err);
        }throw err;        
    }
}

module.exports = history;