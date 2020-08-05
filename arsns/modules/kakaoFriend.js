const request = require('request');
const ak = '1KPzg7ThDEgf9oo2kmLzJ5p0OhnlvM9Xq5IixQo9dRoAAAFzuRyxRg';

module.exports = {
    getKakaoFriend: (keyword)=>{
        return new Promise((resolve, reject)=>{
            const options = {
                'uri' : `https://kapi.kakao.com/v1/api/talk/friends`, 
                'headers' : {
                    'Authorization' : `Bearer ${ak}`,
                },
                'qs' : {
                    // 'query' : `${keyword}`,
                    // 'sort' : 'accuracy',
                    // 'size' : 30,
                    // 'target' : 'title'
                }  
            };
            
            request(options, async (err, result)=>{
                const jsonResult = JSON.parse(result.body);
                if(err) {
                    console.log('request err : ' + err);
                    reject(err)
                }
                else resolve(jsonResult);
            })
        })
    }
};