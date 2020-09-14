const pool = require('../modules/pool');

const historyData  = require('../modules/data/historyData');
const profileData  = require('../modules/data/profileData');

const main = {
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

    getPersonName : async(id) => {
        let query = `SELECT name FROM user WHERE id = ${id}`;
        try{
            let result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('getPersonName err: ', err);
        }throw err;
    },

    isMyFriend : async(myId, friendId) => {
        let query = `SELECT COUNT(*) as cnt FROM friends WHERE myId = ${myId} and friendId = ${friendId}`;
        try{
            let result = await pool.queryParam(query);
            if(result[0].cnt === 0){
                return false;//내 지인이 아닌경우
            }
            else{
                return true;//내 지인인 경우
            }
        }catch(err){
            console.log('isMyFriend err: ', err);
        }throw err;
    },  

    updateFriend : async(myId, friendId) =>{
        let query1 = `SELECT COUNT(*) as userCnt FROM user WHERE id = ${friendId}`;
        let query2 = `SELECT COUNT(*) as friendCnt FROM friends WHERE myId=${myId} and friendId=${friendId}`;
        try{
            let result1 = await pool.queryParam(query1);
            let result2 = await pool.queryParam(query2);
            if(result1[0].userCnt > 0 && result2[0].friendCnt === 0){
                const fields = `myId, friendId`;
                const question = `?,?`;
                const values = [myId, friendId];
        
                query = `INSERT INTO friends(${fields}) VALUES(${question})`;
                result = await pool.queryParamArr(query, values);
                return true;
            }
            else{
                return false;
            }
        }catch(err){
            console.log('updateFriend err: ', err);
        }throw err;
    }
}

module.exports = main;