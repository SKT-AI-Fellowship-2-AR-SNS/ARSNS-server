const request = require('request');
// const at = '1KPzg7ThDEgf9oo2kmLzJ5p0OhnlvM9Xq5IixQo9dRoAAAFzuRyxRg';

module.exports = {
    getKakaoFriend: (at)=>{
        console.log('at 3: ', at);
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
                console.log('친구목록 결과!~: ', jsonResult);
                if(err) {
                    console.log('request err : ' + err);
                    reject(err)
                }
                else resolve(jsonResult);
            })
        })
    }
};