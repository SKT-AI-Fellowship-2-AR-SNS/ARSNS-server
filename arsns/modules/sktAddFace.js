const request = require('request');
const fs = require('fs');

module.exports = {
    addFace: (image, subjectid, facename)=>{
        return new Promise((resolve, reject)=>{
            // console.log('여긴나오니');
            let formData = {
                'image' : fs.createReadStream(`${image}`)
            }
            let options = {
                'method' : 'POST',
                'uri' : `https://stg-va.sktnugu.com/api/v1/face/face`, 
                'headers': {
                    'app-id' : "FHJEF7O455",
                    'group-id' : "SMB2NA4ND0",
                    'subject-id' : `${subjectid}`,
                    'face-name' : `${subjectid}`
                },
                'formData' : formData,
                'json' : true
            };
            
            request(options, async (err, result)=>{
                // console.log(result.body);
                if(err) {
                    console.log('request err : ' + err);
                    reject(err)
                }
                else{
                    if(result.body == undefined){
                        console.log('얼굴사진!!');
                        resolve(true);//얼굴사진
                    }

                    else{
                        console.log('얼굴사진이 아님');
                        resolve(false);//얼굴이 아닌사진
                    }
                } 
            })
        })
    }
};