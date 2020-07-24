const request = require('request');
const fs = require('fs');

module.exports = {
    addFace: (image)=>{
        return new Promise((resolve, reject)=>{
            let formData = {
                'image' : fs.createReadStream(`${image}`)
            }
            let options = {
                'method' : 'POST',
                'uri' : `https://stg-va.sktnugu.com/api/v1/face/face`, 
                'headers': {
                    'app-id' : "FHJEF7O455",
                    'group-id' : "ICQ2WADNJ1",
                    'subject-id' : "VLQKPD0USA",
                    'face-name' : "test3"
                },
                'formData' : formData,
                'json' : true
            };
            
            request(options, async (err, result)=>{
                if(err) {
                    console.log('request err : ' + err);
                    reject(err)
                }
                else{
                    resolve(result);
                } 
            })
        })
    }
};