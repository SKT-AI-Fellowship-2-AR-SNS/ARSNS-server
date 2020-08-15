const pool = require('../modules/pool');

const main = {
    addHistory: async(contents, userIdx, location) => {
        const fields = `contents, userIdx, location`;
        const question = `?,?,?`;
        const values = [contents, userIdx, location];

        let query = `INSERT INTO history(${fields}) VALUES(${question})`;
        try{
            const result = await pool.queryParam(query, values);
            return result;
        }catch(err){
            console.log('addHistory err: ', err);
        }throw err;
    }
}

module.exports = main;