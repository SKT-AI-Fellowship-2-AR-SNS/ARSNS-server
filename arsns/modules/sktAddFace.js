const request = require('request');

module.exports = {
    addFace: ()=>{
        return new Promise((resolve, reject)=>{
            const options = {
                'method' : 'POST',
                'uri' : `https://stg-va.sktnugu.com/api/v1/face/face`, 
                'headers': {
                    'app-id' : "FHJEF7O455",
                    'group-id' : "ICQ2WADNJ1",
                    'subject-id' : "VLQKPD0USA",
                    'face-name' : "test2"
                },
                'body': {
                    'image' : "test2.png"
				},
                'json' : true
            };
            
            request(options, async (err, result)=>{
                if(err) {
                    console.log('request err : ' + err);
                    reject(err)
                }
                else{
                    console.log(result.body);
                    resolve(result);
                } 
            })
        })
    }
};