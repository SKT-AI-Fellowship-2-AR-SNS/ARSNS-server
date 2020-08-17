const pool = require('../modules/pool');

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
        const query = `SELECT * FROM history WHERE userIdx = ${userIdx}`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('getHistory err: ', err);
        }throw err;
    }
}

module.exports = main;