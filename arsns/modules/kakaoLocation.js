const request = require('request');
const ak = '7a1191c54eacb4e90235ab3e181bb119';

module.exports = {
    getAddress: (lat,lon)=>{
        return new Promise((resolve, reject)=>{
            // console.log(lat);
            // console.log(lon);
            
            const options = {
                'uri' : `https://dapi.kakao.com/v2/local/geo/coord2address.json`,
                'method' : 'GET',
                'headers' : {
                    'Authorization' : `KakaoAK ${ak}`,
                },
                'qs' : {
                    'x' : `${lon}`,
                    'y' : `${lat}`
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