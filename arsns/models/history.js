const pool = require('../modules/pool');

const historyData  = require('../modules/data/historyData');
const profileData  = require('../modules/data/profileData');

const history = {
    addHistory: async(contents, id, location, text, type) => {
        const fields = `contents, id, location, text, type`;
        const question = `?,?,?,?,?`;
        const values = [contents, id, location, text, type];

        let query = `INSERT INTO history(${fields}) VALUES(${question})`;
        try{
            const result = await pool.queryParamArr(query, values);
            let historyIdx = result.insertId;
            let query2 = `INSERT INTO user_history(historyIdx, Id) VALUES(${historyIdx}, ${id})`;
            await pool.queryParam(query2);
            return result;
        }catch(err){
            console.log('addHistory err: ', err);
        }throw err;
    },
    // addHistory: async(id, location, text) => {
    //     const fields = `id, location, text`;
    //     const question = `?,?,?`;
    //     const values = [id, location, text];

    //     let query = `INSERT INTO history(${fields}) VALUES(${question})`;
    //     try{
    //         const result = await pool.queryParamArr(query, values);
    //         let historyIdx = result.insertId;
    //         let query2 = `INSERT INTO user_history(historyIdx, Id) VALUES(${historyIdx}, ${id})`;
    //         await pool.queryParam(query2);
    //         return result;
    //     }catch(err){
    //         console.log('addHistory err: ', err);
    //     }throw err;
    // },
    getHistory: async(id, location) => {
        let query = `SELECT * FROM history WHERE id = ${id} and location = "${location}"`;
        let profileQuery = `SELECT name, image FROM user WHERE id = ${id}`;
        try{
            let profileResult = await pool.queryParam(profileQuery);
            profileResult[0].name = profileResult[0].name;
            profileResult[0].image = profileResult[0].image;

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

                query = `SELECT type FROM history WHERE historyIdx = ${historyIdx}`;
                contents_type = await pool.queryParam(query);
                if(contents_type[0].type === "mp4"){
                    element.contents_type = "video";
                }
                else{
                    element.contents_type = "image";
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

    getFriendHistory: async(myId, friendId) => {
        let query = `SELECT * FROM history WHERE id = ${friendId}`;
        let profileQuery = `SELECT name, image FROM user WHERE id = ${friendId}`;

        try{
            let profileResult = await pool.queryParam(profileQuery);
            profileResult[0].name = profileResult[0].name;
            profileResult[0].image = profileResult[0].image;


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

                query = `SELECT type FROM history WHERE id = ${id} and location = "${location}"`;
                contents_type = await pool.queryParam(query);
                if(contents_type === "mp4"){
                    element.contents_type = "video";
                }
                else{
                    element.contents_type = "image";
                }
            }));
            let result = {};
            result.profile = profileResult.map(profileData);
            result.history = historyResult.map(historyData);

            return result;
        }catch(err){
            console.log('getFriendHistory err: ', err);
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
}

module.exports = history;