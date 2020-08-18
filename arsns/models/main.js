const pool = require('../modules/pool');

const historyData  = require('../modules/data/historyData');

const main = {
    addHistory: async(contents, userIdx, location) => {
        const fields = `contents, userIdx, location`;
        const question = `?,?,?`;
        const values = [contents, userIdx, location];

        let query = `INSERT INTO history(${fields}) VALUES(${question})`;
        try{
            const result = await pool.queryParamArr(query, values);
            return result;
        }catch(err){
            console.log('addHistory err: ', err);
        }throw err;
    },

    getHistory: async(userIdx, bssid1, bssid2) => {
        let query = `SELECT * FROM history WHERE userIdx = ${userIdx}`;

        try{
            let result = await pool.queryParam(query);
            let day;

            await Promise.all(result.map(async(element) =>{
                //요일 추출
                query = `select substr(dayname(timestamp),1,3) as day from history WHERE userIdx = ${userIdx}`;
                day = await pool.queryParam(query);
                element.day = day[0].day;

                //timestamp 형식 슬래쉬로 변경, 시간 제거
                query = `select date_format(timestamp, '%Y/%m/%d') as datetime from history where userIdx = ${userIdx}`;
                datetime = await pool.queryParam(query);
                // console.log(datetime);
                element.datetime = datetime[0].datetime;
            }));

            return result.map(historyData);

        }catch(err){
            console.log('getHistory err: ', err);
        }throw err;
    }
}

module.exports = main;