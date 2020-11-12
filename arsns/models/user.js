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
        const query = `SELECT * FROM user WHERE id = ${id}`;
        try{
            const result = await pool.queryParam(query);
            // console.log('length: ', result.length);
            if(result.length > 0) return true;
            else return false;
        } catch(err){
            console.log('checkUserName err : ', err);
            throw err;
        }
    },

    atCheck: async(id, at) =>{
        let query = `SELECT access_token FROM user WHERE id=${id}`;
        try{
            let result = await pool.queryParam(query);
            if(result != at){
                query = `UPDATE user SET access_token = "${at}" WHERE id="${id}"`;
                result = await pool.queryParam(query);
                return true;
            }
            else{
                return false;
            }
        }catch(err){
            console.log('atCheck err: ', err);
        }throw err;
    },

    signup: async (id, name, email, access_token) => {
        const fields = 'id, name, email, access_token';
        // console.log('id: ', id, 'name: ', name, 'email: ',email, 'at: ',access_token);
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

    myFollowing: async(myid, limit, offset) =>{
        let countQuery = `SELECT COUNT(*) as cnt FROM friends WHERE myid = ${myid}`;
        let query = `SELECT friendId FROM friends WHERE myid = ${myid} limit ${limit} OFFSET ${offset}`;
        try{
            const countResult = await pool.queryParam(countQuery);
            const profileResult = await pool.queryParam(query);
            let result = {};

            await Promise.all(profileResult.map(async(element) =>{
                let id = element.friendId;
                query = `SELECT id, name, profileImage, message FROM user WHERE id = ${id}`;
                let result2 = await pool.queryParam(query);
                element.id = result2[0].id;
                element.name = result2[0].name;
                element.profileImage = result2[0].profileImage;
                element.message = result2[0].message;

                //내가 팔로우하고 있는지 여부
                query = `SELECT COUNT(*) as cnt FROM friends WHERE myId=${myid} and friendId=${id}`;
                let result3 = await pool.queryParam(query);
                if(result3[0].cnt !== 0){
                    element.isFollowing = true;
                }
                else{
                    element.isFollowing = false;
                }
            }));
            result.count = countResult[0].cnt;
            result.list = profileResult.map(profileData);
            return result;
        }catch(err){
            console.log('myFollowing err: ', err);
        }throw err;
    },

    myFollower: async(myid, limit, offset) =>{
        let countQuery = `SELECT COUNT(*) as cnt FROM friends WHERE friendid = ${myid}`;
        let query = `SELECT myId FROM friends WHERE friendId = ${myid} limit ${limit} OFFSET ${offset}`;
        try{
            const countResult = await pool.queryParam(countQuery);
            const profileResult = await pool.queryParam(query);
            let result = {};

            await Promise.all(profileResult.map(async(element) =>{
                let id = element.myId;
                query = `SELECT id, name, profileImage, message FROM user WHERE id = ${id}`;
                let result2 = await pool.queryParam(query);
                element.id = result2[0].id;
                element.name = result2[0].name;
                element.profileImage = result2[0].profileImage;
                element.message = result2[0].message;

                //내가 팔로우하고 있는지 여부
                query = `SELECT COUNT(*) as cnt FROM friends WHERE myId=${myid} and friendId=${id}`;
                let result3 = await pool.queryParam(query);
                if(result3[0].cnt !== 0){
                    element.isFollowing = true;
                }
                else{
                    element.isFollowing = false;
                }
            }));
            result.count = countResult[0].cnt;
            result.list = profileResult.map(profileData);
            return result;
        }catch(err){
            console.log('myFollower err: ', err);
        }throw err;
    },

    otherFollowing: async(myid, yourid, limit, offset) =>{
        let countQuery = `SELECT COUNT(*) as cnt FROM friends WHERE myid = ${yourid}`;
        let query = `SELECT friendId FROM friends WHERE myid = ${yourid} limit ${limit} OFFSET ${offset}`;
        try{
            const countResult = await pool.queryParam(countQuery);
            const profileResult = await pool.queryParam(query);
            let result = {};

            await Promise.all(profileResult.map(async(element) =>{
                let id = element.friendId;
                query = `SELECT id, name, profileImage, message FROM user WHERE id = ${id}`;
                let result2 = await pool.queryParam(query);
                element.id = result2[0].id;
                element.name = result2[0].name;
                element.profileImage = result2[0].profileImage;
                element.message = result2[0].message;

                //내가 팔로우하고 있는지 여부
                query = `SELECT COUNT(*) as cnt FROM friends WHERE myId=${myid} and friendId=${id}`;
                let result3 = await pool.queryParam(query);
                if(result3[0].cnt !== 0){
                    element.isFollowing = true;
                }
                else{
                    element.isFollowing = false;
                }
            }));
            result.count = countResult[0].cnt;
            result.list = profileResult.map(profileData);
            return result;
        }catch(err){
            console.log('otherFollowing err: ', err);
        }throw err;
    },

    otherFollower: async(myid, yourid, limit, offset) =>{
        let countQuery = `SELECT COUNT(*) as cnt FROM friends WHERE friendid = ${yourid}`;
        let query = `SELECT myId FROM friends WHERE friendId = ${yourid} limit ${limit} OFFSET ${offset}`;
        try{
            const countResult = await pool.queryParam(countQuery);
            const profileResult = await pool.queryParam(query);
            let result = {};

            await Promise.all(profileResult.map(async(element) =>{
                let id = element.myId;
                query = `SELECT id, name, profileImage, message FROM user WHERE id = ${id}`;
                let result2 = await pool.queryParam(query);
                element.id = result2[0].id;
                element.name = result2[0].name;
                element.profileImage = result2[0].profileImage;
                element.message = result2[0].message;

                //내가 팔로우하고 있는지 여부
                query = `SELECT COUNT(*) as cnt FROM friends WHERE myId=${myid} and friendId=${id}`;
                let result3 = await pool.queryParam(query);
                if(result3[0].cnt !== 0){
                    element.isFollowing = true;
                }
                else{
                    element.isFollowing = false;
                }
            }));
            result.count = countResult[0].cnt;
            result.list = profileResult.map(profileData);
            return result;
        }catch(err){
            console.log('otherFollower err: ', err);
        }throw err;
    },

    getRecommend: async (myid, limit, offset) =>{
        let countQuery = `SELECT COUNT(*) as cnt FROM recommend WHERE userIdx = ${myid}`;
        let query = `SELECT recommendIdx FROM recommend WHERE userIdx = ${myid} limit ${limit} OFFSET ${offset}`;
        try{
            const countResult = await pool.queryParam(countQuery);
            let profileResult = await pool.queryParam(query);
            let result = {};

            await Promise.all(profileResult.map(async(element) =>{
                let id = element.recommendIdx;
                query = `SELECT id, name, profileImage, message FROM user WHERE id = ${id}`;
                let result2 = await pool.queryParam(query);
                element.id = result2[0].id;
                element.name = result2[0].name;
                element.profileImage = result2[0].profileImage;
                element.message = result2[0].message;

                //내가 팔로우하고 있는지 여부
                query = `SELECT COUNT(*) as cnt FROM friends WHERE myId=${myid} and friendId=${id}`;
                let result3 = await pool.queryParam(query);
                if(result3[0].cnt !== 0){
                    element.isFollowing = true;
                }
                else{
                    element.isFollowing = false;
                }
            }));
            result.count = countResult[0].cnt;
            result.list = profileResult.map(profileData);
            return result;

        }catch(err){
            console.log('getRecommend err: ', err);
        }throw err;
    },

    editImg: async(id, imgLocation) =>{
        let query = `UPDATE user SET profileImage = "${imgLocation}" WHERE id = ${id}`;
        let result = {};
        try{
            await pool.queryParam(query);
            query = `SELECT name, profileImage, message FROM user WHERE id=${id}`;
            result = await pool.queryParam(query);
            return result[0];
        }catch(err){
            console.log('editProfile err: ', err);
        }throw err;
    },

    editText: async(id, message) =>{
        let query = `UPDATE user SET message = "${message}" WHERE id = ${id}`;
        let result = {};
        try{
            await pool.queryParam(query);
            query = `SELECT name, profileImage, message FROM user WHERE id=${id}`;
            result = await pool.queryParam(query);
            return result[0];
        }catch(err){
            console.log('editProfile err: ', err);
        }throw err;
    },

    follow: async(myid, yourid) =>{
        let query = `SELECT * FROM friends WHERE myId=${myid} and friendId=${yourid}`;
        let recquery = `SELECT * FROM recommend WHERE userIdx=${myid} and recommendIdx=${yourid}`;
        try{
            let result = "";
            const selectResult = await pool.queryParam(query);
            const recResult = await pool.queryParam(recquery);

            if(selectResult.length === 0){//팔로우 안했던 유저 -> 팔로우 추가하기
                query = `INSERT INTO friends(myId, friendId) VALUE(${myid}, ${yourid})`;
                await pool.queryParam(query);

                if(recResult.length === 1){//추천친구 목록에 있던사람이면 추천친구 목록에서 삭제
                    query = `DELETE FROM recommend WHERE userIdx=${myid} and recommendIdx=${yourid}`;
                    await pool.queryParam(query);
                }
                result = true;
            }

            else{//팔로우했던 유저 -> 팔로우 취소하기
                query = `DELETE FROM friends WHERE myId=${myid} and friendId=${yourid}`;
                await pool.queryParam(query);

                //추천친구 목록에 삽입
                query = `INSERT INTO recommend(userIdx, recommendIdx) VALUE(${myid}, ${yourid})`;
                await pool.queryParam(query);
                result = false;
            }
            return result;
        }catch(err){
            console.log('follow err: ', err);
        }throw err;
    }
}

module.exports = user;