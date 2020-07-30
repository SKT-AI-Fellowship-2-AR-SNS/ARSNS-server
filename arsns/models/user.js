const table = 'user';

const user = {
    // getUserByName:  async (username) => {
    //     const query = `SELECT * FROM ${table} WHERE name = '${username}'`;
    //     try {
    //         const pool = await poolPromise;
    //         const connection = await pool.getConnection();
    //         try {
    //             result = await connection.query(query) || null;
    //         } catch (queryError) {
    //             connection.rollback(() => {});
    //             console.log('[user.js]  ', queryError);
    //         }
    //         pool.releaseConnection(connection);
    //     } catch (connectionError) {
    //         console.log('[user.js]  ',connectionError);
    //     }
    //     return result[0];
    // },
    // getUserById:  async (id) => {
    //     const query = `SELECT * FROM ${table} WHERE id = '${id}'`;
    //     try {
    //         const pool = await poolPromise;
    //         const connection = await pool.getConnection();
    //         try {
    //             result = await connection.query(query) || null;
    //         } catch (queryError) {
    //             connection.rollback(() => {});
    //             console.log('[user.js]  ', queryError);
    //         }
    //         pool.releaseConnection(connection);
    //     } catch (connectionError) {
    //         console.log('[user.js]  ',connectionError);
    //     }
    //     const data = result[0];
    //     const dto = {
    //         id: data.id,
    //         name: data.name,
    //         email: data.email,
    //         phone: data.phone
    //     } 
    //     return dto;
    // },
    userCheck: async (id) => {
        const query = `SELECT * FROM ${table} WHERE id = '${id}'`;
        try{
            const result = await pool.queryParam(query);
            if(result.length > 0) return true;
            else return false;
        } catch(err){
            console.log('checkUserName err : ', err);
            throw err;
        }
    },
    signup: async (id, name, password, salt, email, phone) => {
        const fields = 'id, name, password, salt, email, phone';
        const questions = `'${id}', '${name}', '${password}', '${salt}', '${email}', '${phone}'`;
        const values = [email, password, name, salt];
        const query = `INSERT INTO curator(${fields}) VALUES(${questions})`;
        try{
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch{
            if(err.errno == 1062){
                console.log('signup ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('signup ERROR :', err);
            throw err;
        }
    }
}

module.exports = user;