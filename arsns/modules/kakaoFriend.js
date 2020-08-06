const request = require('request');
// const at = '1KPzg7ThDEgf9oo2kmLzJ5p0OhnlvM9Xq5IixQo9dRoAAAFzuRyxRg';
const at = 'fJ0pcomDvJcV7IJsDjkLiJ0ed0O15sf6LzVhCQo9dVsAAAFzwscCEQ';

module.exports = {
    getKakaoFriend: (keyword)=>{
        return new Promise((resolve, reject)=>{
            const options = {
                'uri' : `https://kapi.kakao.com/v1/api/talk/friends`, 
                // 'uri' : `https://kapi.kakao.com/v2/user/me`, 
                'headers' : {
                    'Authorization' : `Bearer ${at}`,
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