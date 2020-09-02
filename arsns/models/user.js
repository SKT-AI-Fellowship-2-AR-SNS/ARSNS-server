const table = 'user';
const pool = require('../modules/pool');
const { access } = require('fs');
const profileData = require('../modules/data/profileData');
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
    getUserById : async (id) =>{
        const query = `SELECT * FROM user WHERE id = "${id}"`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }
        catch(err){
            console.log('getUserByEmail ERROR : ', err);
            throw err;
        }
    },
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
    signup: async (id, name, email, access_token) => {
        const fields = 'id, name, email, access_token';
        console.log('id: ', id, 'name: ', name, 'email: ',email, 'at: ',access_token);
        const questions = `'${id}', '${name}', '${email}', '${access_token}'`;
        const values = [id, name, email, access_token];
        const query = `INSERT INTO user(${fields}) VALUES(${questions})`;
        try{
            const result = await pool.queryParamArr(query, values);
            const insertId = result[0].id;
            return insertId;
        } catch{
            if(err.errno == 1062){
                console.log('signup ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('signup ERROR :', err);
            throw err;
        }
    },

    getFriend: async(myid) =>{
        const query = `SELECT friendId FROM friends WHERE myid = ${myid}`;
        try{
            const result = await pool.queryParam(query);
            if(result.length ===0){
                return false;
            }
            else{
                return result;       
            }
        }catch(err){
            console.log('getFriend err: ', err);
        }throw err;
    },

    editProfile: async(id, message, imgLocation) =>{
        let query = `UPDATE user SET message = "${message}", image = "${imgLocation}" WHERE id = ${id}`;
        try{
            await pool.queryParam(query);
            query = `SELECT name, image, message FROM user WHERE id=${id}`;
            const result = await pool.queryParam(query);
            result[0].name = result[0].name;
            result[0].image = result[0].image;
            result[0].message = result[0].message;
            return result.map(profileData);
        }catch(err){
            console.log('editProfile err: ', err);
        }throw err;
    }
}

module.exports = user;