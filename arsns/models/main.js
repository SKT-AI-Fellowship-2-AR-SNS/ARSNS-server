const pool = require('../modules/pool');

const historyData  = require('../modules/data/historyData');

const main = {
    addHistory: async(contents, id, location) => {
        const fields = `contents, id, location`;
        const question = `?,?,?`;
        const values = [contents, id, location];

        let query = `INSERT INTO history(${fields}) VALUES(${question})`;
        try{
            const result = await pool.queryParamArr(query, values);
            let historyIdx = result.historyIdx;
            let query2 = `INSERT INTO user_history(historyIdx, id) VALUES(${historyIdx}, id)`;
            await pool.queryParam(query2);
            return result;
        }catch(err){
            console.log('addHistory err: ', err);
        }throw err;
    },

    getHistory: async(id, bssid1, bssid2) => {
        let query = `SELECT * FROM history WHERE id = ${id}`;

        try{
            let result = await pool.queryParam(query);
            let day;

            await Promise.all(result.map(async(element) =>{
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
            }));

            return result.map(historyData);

        }catch(err){
            console.log('getHistory err: ', err);
        }throw err;
    },

    getFriendHistory: async(myId, friendId) => {
        let query = `SELECT * FROM history WHERE id = ${friendId}`;

        try{
            let result = await pool.queryParam(query);
            let day;

            await Promise.all(result.map(async(element) =>{
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
            }));

            return result.map(historyData);

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
    }

}

module.exports = main;