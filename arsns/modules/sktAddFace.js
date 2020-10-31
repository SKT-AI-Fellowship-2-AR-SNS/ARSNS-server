const request = require('request');
const fs = require('fs');

module.exports = {
    addFace: (image, appid, groupid, subjectid, facename)=>{
        return new Promise((resolve, reject)=>{
            // console.log('여긴나오니');
            let formData = {
                'image' : fs.createReadStream(`${image}`)
            }
            let options = {
                'method' : 'POST',
                'uri' : `https://stg-va.sktnugu.com/api/v1/face/face`, 
                'headers': {
                    'app-id' : `${appid}`,
                    'group-id' : `${groupid}`,
                    'subject-id' : `${subjectid}`,
                    'face-name' : `${subjectid}`
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