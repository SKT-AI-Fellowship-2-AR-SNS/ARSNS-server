const request = require('request');
const fs = require('fs');
const at = '9le1516orRzRehe0Ik14n2y503N';

module.exports = {
    sirvToken: (clientId, clientSecret)=>{
        return new Promise((resolve, reject)=>{
            // console.log('1토큰받기');
            
            let options = {
                "method": "POST",
                "port": null,
                "uri" : `https://api.sirv.com/v2/token`, 
                "headers": {
                    "content-type": "application/json",
                },
                "body":{
                    "clientId": `${clientId}`,
                    "clientSecret" : `${clientSecret}`
                },
                'json' : true
            };
            
            request(options, async (err, result)=>{
                // console.log(result.body.token);
                if(err) {
                    console.log('request err : ' + err);
                    reject(err)
                }
                else{
                    resolve(result.body.token);
                } 
            })
        })
    }
};