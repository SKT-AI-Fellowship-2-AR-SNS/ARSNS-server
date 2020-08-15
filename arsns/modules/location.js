const request = require('request');
// const at = '4qKvhjcv4pY2PIFWJr4FI65Uy8H3jGUi0QSkUAo9dGkAAAFzx0SQXQ';
const token = '30b53a73bdcac1';
module.exports = {
    getLocation: (bssid1, bssid2)=>{
        return new Promise((resolve, reject)=>{
            // console.log(bssid1);
            // console.log(bssid2);
            const options = {
                'async' : true,
                'crossDomain' : true,
                'method' : 'POST',
                'uri' : `https://us1.unwiredlabs.com/v2/process.php`, 
                // 'headers' : {
                //     "token": "30b53a73bdcac1",
                // },
                'processData' : false,
                'body':{
                    "token": "30b53a73bdcac1",
                    "wifi": [{
                        // "bssid": "00:08:9f:01:cc:9c",
                        "bssid" : `${bssid1}`,
                        "channel": 11,
                        "frequency": 2412,
                        "signal": -51
                    }, {
                        // "bssid": "10:e3:c7:05:a9:c7"
                        "bssid" : `${bssid2}`,
                    }],
                    "address": 1
            },
                'json' : true
            };
            
            request(options, async (err, result)=>{
                // const jsonResult = JSON.parse(result.body);
                const jsonResult = result.body;
                // console.log('x: ', jsonResult.lat);
                // console.log('y: ', jsonResult.lon);
                if(err) {
                    console.log('request err : ' + err);
                    reject(err)
                }
                else resolve(jsonResult);
            })
        })
    }
};